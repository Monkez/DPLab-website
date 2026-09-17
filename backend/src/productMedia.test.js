import test from 'node:test'
import assert from 'node:assert/strict'
import { once } from 'node:events'
import express from 'express'
import sharp from 'sharp'
import { createProductMediaRouter } from './productMedia.js'
import { MAX_IMAGE_BYTES } from './articleMedia.js'

test('product image HTTP upload checks permission, validates images and serves stored WebP', async t => {
  const saved = new Map()
  const app = express()
  app.use('/api/product-media', createProductMediaRouter({
    requirePermission: permission => {
      assert.equal(permission, 'products.manage')
      return (req, res, next) => req.headers['x-test-permission'] === permission ? next() : res.sendStatus(403)
    },
    saveImage: async (id, data) => saved.set(id, data),
    getImage: async id => saved.get(id),
  }))
  app.use((error, _req, res, _next) => res.sendStatus(error.status || 500))
  const server = app.listen(0, '127.0.0.1')
  await once(server, 'listening')
  t.after(() => { server.closeAllConnections(); server.close() })
  const base = `http://127.0.0.1:${server.address().port}`
  const input = await sharp({ create: { width: 50, height: 40, channels: 4, background: '#123456' } }).png().toBuffer()
  const upload = (body, permission = 'products.manage') => fetch(`${base}/api/product-media`, { method: 'POST', headers: { 'Content-Type': 'image/png', 'x-test-permission': permission }, body })
  assert.equal((await upload(input, '')).status, 403)
  assert.equal((await upload(input, 'articles.manage')).status, 403)
  assert.equal((await upload(Buffer.from('not an image'))).status, 400)
  assert.equal((await upload(Buffer.alloc(MAX_IMAGE_BYTES + 1))).status, 413)
  assert.equal(saved.size, 0)
  const response = await upload(input)
  assert.equal(response.status, 201)
  const { path } = await response.json()
  assert.match(path, /^\/api\/product-media\/[0-9a-f-]+$/)
  const downloaded = await fetch(`${base}${path}`)
  assert.equal(downloaded.status, 200)
  assert.equal(downloaded.headers.get('content-type'), 'image/webp')
  assert.equal(downloaded.headers.get('x-content-type-options'), 'nosniff')
  const metadata = await sharp(Buffer.from(await downloaded.arrayBuffer())).metadata()
  assert.equal(metadata.format, 'webp')
  assert.equal(metadata.width, 50)
  assert.equal((await fetch(`${base}/api/product-media/not-an-id`)).status, 404)
  assert.equal((await fetch(`${base}/api/product-media/00000000-0000-0000-0000-000000000000`)).status, 404)
})
