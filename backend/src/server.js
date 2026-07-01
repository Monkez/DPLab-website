import 'dotenv/config'
import cors from 'cors'
import crypto from 'crypto'
import express from 'express'
import {
  authenticateAdmin,
  createAdminUser,
  deleteProduct,
  deleteAdminUser,
  getSettings,
  initDatabase,
  listAdminUsers,
  listOrders,
  listProducts,
  resetDemoData,
  saveOrder,
  saveProduct,
  saveSettings,
  updateOrderStatus,
} from './db.js'

const app = express()
const port = Number(process.env.PORT || 10000)
const allowedOrigins = (process.env.FRONTEND_URL || '').split(',').map(value => value.trim()).filter(Boolean)
const sessionSecret = process.env.ADMIN_SESSION_SECRET || process.env.DATABASE_URL || 'dplab-local-session-secret'

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) callback(null, true)
    else callback(new Error(`Origin ${origin} is not allowed by CORS`))
  },
}))
app.use(express.json({ limit: '8mb' }))

const asyncRoute = handler => async (req, res, next) => {
  try { await handler(req, res) }
  catch (error) { next(error) }
}

function signToken(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = crypto.createHmac('sha256', sessionSecret).update(body).digest('base64url')
  return `${body}.${signature}`
}

function readToken(token) {
  if (!token || !token.includes('.')) return null
  const [body, signature] = token.split('.')
  const expected = crypto.createHmac('sha256', sessionSecret).update(body).digest('base64url')
  if (Buffer.byteLength(signature) !== Buffer.byteLength(expected)) return null
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null
  const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'))
  if (!payload.exp || Date.now() > payload.exp) return null
  return payload
}

function getAdminFromRequest(req) {
  const auth = req.headers.authorization || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
  return readToken(token)
}

function requireAdmin(req, res, next) {
  const admin = getAdminFromRequest(req)
  if (!admin) return res.status(401).json({ message: 'Admin login required' })
  req.admin = admin
  next()
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'dplab-backend' })
})

app.get('/api/bootstrap', asyncRoute(async (_req, res) => {
  const admin = getAdminFromRequest(_req)
  const [products, orders, settings] = await Promise.all([listProducts(), listOrders(), getSettings()])
  res.json({ products, orders: admin ? orders : [], settings })
}))

app.post('/api/admin/login', asyncRoute(async (req, res) => {
  const user = await authenticateAdmin(req.body?.username, req.body?.password)
  if (!user) return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' })
  const token = signToken({ username: user.username, displayName: user.displayName, exp: Date.now() + 1000 * 60 * 60 * 12 })
  res.json({ token, user })
}))

app.get('/api/admin/users', requireAdmin, asyncRoute(async (_req, res) => {
  res.json(await listAdminUsers())
}))

app.post('/api/admin/users', requireAdmin, asyncRoute(async (req, res) => {
  res.status(201).json(await createAdminUser(req.body))
}))

app.delete('/api/admin/users/:username', requireAdmin, asyncRoute(async (req, res) => {
  await deleteAdminUser(req.params.username)
  res.status(204).end()
}))

app.get('/api/products', asyncRoute(async (_req, res) => {
  res.json(await listProducts())
}))

app.post('/api/products', requireAdmin, asyncRoute(async (req, res) => {
  const product = req.body
  if (!product?.id) return res.status(400).json({ message: 'Product id is required' })
  res.status(201).json(await saveProduct(product))
}))

app.put('/api/products/:id', requireAdmin, asyncRoute(async (req, res) => {
  const product = { ...req.body, id: req.params.id }
  res.json(await saveProduct(product))
}))

app.delete('/api/products/:id', requireAdmin, asyncRoute(async (req, res) => {
  await deleteProduct(req.params.id)
  res.status(204).end()
}))

app.get('/api/orders', requireAdmin, asyncRoute(async (_req, res) => {
  res.json(await listOrders())
}))

app.post('/api/orders', asyncRoute(async (req, res) => {
  const order = req.body
  if (!order?.id) return res.status(400).json({ message: 'Order id is required' })
  res.status(201).json(await saveOrder(order))
}))

app.patch('/api/orders/:id/status', requireAdmin, asyncRoute(async (req, res) => {
  const order = await updateOrderStatus(req.params.id, req.body.status)
  if (!order) return res.status(404).json({ message: 'Order not found' })
  res.json(order)
}))

app.get('/api/settings', asyncRoute(async (_req, res) => {
  res.json(await getSettings())
}))

app.put('/api/settings', requireAdmin, asyncRoute(async (req, res) => {
  res.json(await saveSettings(req.body))
}))

app.post('/api/reset-demo', requireAdmin, asyncRoute(async (_req, res) => {
  res.json(await resetDemoData())
}))

app.use((error, _req, res, _next) => {
  console.error(error)
  res.status(500).json({ message: error.message || 'Internal server error' })
})

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is required')
  process.exit(1)
}

await initDatabase()
app.listen(port, () => {
  console.log(`DTPT Shop backend is running on port ${port}`)
})
