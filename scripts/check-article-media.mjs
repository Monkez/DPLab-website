// Integration check against an explicitly selected, disposable local PostgreSQL database.
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { createServer } from 'node:net'
import crypto from 'node:crypto'
import { createRequire } from 'node:module'
const sharp = createRequire(new URL('../backend/package.json', import.meta.url))('sharp')

const databaseUrl = new URL(process.env.TEST_DATABASE_URL || 'http://missing')
if (!['localhost', '127.0.0.1'].includes(databaseUrl.hostname) || !databaseUrl.pathname.startsWith('/dtpt_test_')) throw new Error('Set TEST_DATABASE_URL to a disposable local database named dtpt_test_*.')
const port = await new Promise(resolve => { const socket = createServer(); socket.listen(0, '127.0.0.1', () => { const port = socket.address().port; socket.close(() => resolve(port)) }) })
const base = `http://127.0.0.1:${port}`
const password = crypto.randomUUID(), username = `media-${crypto.randomUUID().slice(0, 24)}`
let server, logs = ''
async function boot() {
  server = spawn(process.execPath, ['src/server.js'], { cwd: new URL('../backend/', import.meta.url), env: { ...process.env, DATABASE_URL: databaseUrl.href, DATABASE_SSL: 'false', PORT: String(port), ADMIN_SESSION_SECRET: 'isolated-integration-' + password, ADMIN_DEFAULT_USERNAME: username, ADMIN_DEFAULT_PASSWORD: password }, stdio: ['ignore', 'pipe', 'pipe'] })
  server.stdout.on('data', value => logs += value); server.stderr.on('data', value => logs += value)
  for (let i = 0; i < 100; i++) { try { if ((await fetch(base + '/api/bootstrap')).ok) return } catch {} await new Promise(resolve => setTimeout(resolve, 100)) }
  throw new Error(logs)
}
async function stop() { if (server && server.exitCode === null) { const exited = once(server, 'exit'); server.kill(); await exited } }
const json = (path, method, body, token) => fetch(base + path, { method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify(body) })
const login = async user => { const response = await json('/api/admin/login', 'POST', { username: user, password }); assert.equal(response.status, 200); return (await response.json()).token }
const upload = (body, token, type = 'image/png') => fetch(base + '/api/article-media', { method: 'POST', headers: { 'Content-Type': type, ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body })
try {
  await boot()
  const token = await login(username)
  const png = await sharp({ create: { width: 30, height: 20, channels: 3, background: '#086ad8' } }).png().toBuffer()
  assert.equal((await upload(png)).status, 401)
  const viewer = `viewer-${crypto.randomUUID().slice(0, 24)}`
  assert.equal((await json('/api/admin/users', 'POST', { username: viewer, password, displayName: 'Media test viewer', role: 'viewer' }, token)).status, 201)
  assert.equal((await upload(png, await login(viewer))).status, 403)
  const editor = `editor-${crypto.randomUUID().slice(0, 24)}`
  assert.equal((await json('/api/admin/users', 'POST', { username: editor, password, displayName: 'Media test editor', role: 'content_editor' }, token)).status, 201)
  const editorToken = await login(editor)
  const response = await upload(png, editorToken); assert.equal(response.status, 201)
  const { path } = await response.json()
  assert.match(path, /^\/api\/article-media\/[a-f0-9-]+$/)
  const media = await fetch(base + path); assert.equal(media.status, 200)
  assert.match(media.headers.get('content-type'), /image\/webp/)
  assert.equal(media.headers.get('x-content-type-options'), 'nosniff')
  const bytes = Buffer.from(await media.arrayBuffer()); assert.equal((await sharp(bytes).metadata()).width, 30)
  assert.equal((await upload(Buffer.from('<svg/>'), editorToken, 'image/svg+xml')).status, 400)
  assert.equal((await upload(Buffer.from('corrupt'), editorToken)).status, 400)
  assert.equal((await upload(Buffer.alloc(5 * 1024 * 1024 + 1), editorToken)).status, 413)
  assert.equal((await fetch(base + '/api/article-media/not-a-uuid')).status, 404)
  assert.equal((await fetch(base + '/api/article-media/' + crypto.randomUUID())).status, 404)
  const id = crypto.randomUUID()
  const article = { id, slug: `media-test-${id}`, title: 'Inline image integration', excerpt: 'Integration only', content: `Before\n\n![First](<${path}> "Caption 1")\n\nBetween\n\n![Second](<${path}> "Caption 2")\n\nAfter`, author: 'Test', tags: [], status: 'draft', publishedAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  assert.equal((await json('/api/articles', 'POST', article, editorToken)).status, 201)
  assert(!(await (await fetch(base + '/api/articles')).json()).some(item => item.id === id))
  article.status = 'published'
  assert.equal((await json('/api/articles/' + id, 'PUT', article, editorToken)).status, 200)
  await stop(); await boot()
  assert.deepEqual(Buffer.from(await (await fetch(base + path)).arrayBuffer()), bytes)
  assert.equal((await (await fetch(base + '/api/articles')).json()).find(item => item.id === id).content, article.content)
  assert.equal((await json('/api/articles/' + id, 'DELETE', undefined, editorToken)).status, 204)
  assert.equal((await fetch(base + path)).status, 200, 'Removing an article must not delete shared media')
  console.log('PASS: image upload permissions, validation, PostgreSQL persistence, draft/publish and restart')
} finally { await stop() }
