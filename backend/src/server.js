import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import {
  deleteProduct,
  getSettings,
  initDatabase,
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

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'dplab-backend' })
})

app.get('/api/bootstrap', asyncRoute(async (_req, res) => {
  const [products, orders, settings] = await Promise.all([listProducts(), listOrders(), getSettings()])
  res.json({ products, orders, settings })
}))

app.get('/api/products', asyncRoute(async (_req, res) => {
  res.json(await listProducts())
}))

app.post('/api/products', asyncRoute(async (req, res) => {
  const product = req.body
  if (!product?.id) return res.status(400).json({ message: 'Product id is required' })
  res.status(201).json(await saveProduct(product))
}))

app.put('/api/products/:id', asyncRoute(async (req, res) => {
  const product = { ...req.body, id: req.params.id }
  res.json(await saveProduct(product))
}))

app.delete('/api/products/:id', asyncRoute(async (req, res) => {
  await deleteProduct(req.params.id)
  res.status(204).end()
}))

app.get('/api/orders', asyncRoute(async (_req, res) => {
  res.json(await listOrders())
}))

app.post('/api/orders', asyncRoute(async (req, res) => {
  const order = req.body
  if (!order?.id) return res.status(400).json({ message: 'Order id is required' })
  res.status(201).json(await saveOrder(order))
}))

app.patch('/api/orders/:id/status', asyncRoute(async (req, res) => {
  const order = await updateOrderStatus(req.params.id, req.body.status)
  if (!order) return res.status(404).json({ message: 'Order not found' })
  res.json(order)
}))

app.get('/api/settings', asyncRoute(async (_req, res) => {
  res.json(await getSettings())
}))

app.put('/api/settings', asyncRoute(async (req, res) => {
  res.json(await saveSettings(req.body))
}))

app.post('/api/reset-demo', asyncRoute(async (_req, res) => {
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
  console.log(`DP Lab backend is running on port ${port}`)
})
