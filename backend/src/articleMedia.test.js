import { test } from 'node:test'
import assert from 'node:assert/strict'
import sharp from 'sharp'
import { MAX_IMAGE_BYTES, normalizeArticleImage } from './articleMedia.js'

test('article images are decoded, resized and stripped of metadata', async () => {
  const input = await sharp({ create: { width: 2400, height: 1200, channels: 3, background: '#2980b9' } }).jpeg().withMetadata().toBuffer()
  const output = await normalizeArticleImage(input)
  const metadata = await sharp(output).metadata()
  assert.equal(metadata.format, 'webp')
  assert.equal(metadata.width, 1920)
  assert.equal(metadata.height, 960)
  assert.equal(metadata.exif, undefined)
  assert.equal(metadata.icc, undefined)
})
test('reject oversized, corrupt, empty and unsupported images', async () => {
  for (const input of [Buffer.alloc(0), Buffer.alloc(MAX_IMAGE_BYTES + 1), Buffer.from('not an image'), Buffer.from('<svg width="10" height="10"><rect width="10" height="10"/></svg>'), {}]) {
    await assert.rejects(normalizeArticleImage(input))
  }
})
