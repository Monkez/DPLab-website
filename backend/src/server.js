import 'dotenv/config'
import cors from 'cors'
import crypto from 'crypto'
import express from 'express'
import {
  authenticateAdmin,
  createAdminUser,
  deleteProduct,
  deleteAdminUser,
  getAdminUser,
  getSettings,
  initDatabase,
  listAdminUsers,
  listAnalyticsEvents,
  listQuotes,
  listProducts,
  resetDemoData,
  saveQuote,
  saveProduct,
  saveSettings,
  recordAnalyticsEvent,
  updateQuoteStatus,
  updateAdminUser,
} from './db.js'
import { hasPermission } from './permissions.js'

const app = express()
const port = Number(process.env.PORT || 10000)
const configuredOrigins = (process.env.FRONTEND_URL || '').split(',').map(value => value.trim().replace(/\/$/, '')).filter(Boolean)
const allowedOrigins = new Set([
  ...configuredOrigins,
  'https://dtpt.tech',
  'https://www.dtpt.tech',
  'https://dtpt.shop',
  'https://www.dtpt.shop',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
])
const sessionSecret = process.env.ADMIN_SESSION_SECRET
if (!sessionSecret) throw new Error('ADMIN_SESSION_SECRET is required')

app.use(cors({
  origin(origin, callback) {
    const normalizedOrigin = origin?.replace(/\/$/, '')
    if (!normalizedOrigin || allowedOrigins.has(normalizedOrigin)) callback(null, true)
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

async function resolveAdmin(req) {
  const token = getAdminFromRequest(req)
  if (!token) return null
  const admin = await getAdminUser(token.username)
  return admin?.active ? admin : null
}

const requirePermission = (...permissions) => asyncRoute(async (req, res, next) => {
  const admin = await resolveAdmin(req)
  if (!admin) return res.status(401).json({ message: 'Phiên đăng nhập đã hết hạn hoặc tài khoản đã bị khóa' })
  if (permissions.length && !permissions.some(permission => hasPermission(admin, permission))) {
    return res.status(403).json({ message: 'Tài khoản không có quyền thực hiện thao tác này' })
  }
  req.admin = admin
  next()
})

function isValidProduct(product) {
  return Boolean(
    product?.id?.trim?.() && product?.slug?.trim?.() && product?.name?.trim?.() &&
    product?.model?.trim?.() && product?.category?.trim?.() &&
    ['active', 'draft'].includes(product.status) &&
    ['fixed', 'from', 'range', 'contact'].includes(product.priceMode) &&
    Array.isArray(product.highlights) && Array.isArray(product.applications) && Array.isArray(product.specifications)
  )
}

function isValidSettings(settings) {
  if (!settings?.storeName?.trim?.() || !settings?.content || !Array.isArray(settings.categories) || !settings.categories.length) return false
  const categoryIds = new Set()
  const categoryNames = new Set()
  for (const category of settings.categories) {
    if (!category?.id?.trim?.() || !category?.name?.trim?.() || !Array.isArray(category.subcategories)) return false
    if (categoryIds.has(category.id) || categoryNames.has(category.name)) return false
    categoryIds.add(category.id); categoryNames.add(category.name)
  }
  return settings.visibility && settings.appearance && [3, 4].includes(Number(settings.appearance.productsPerRow))
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'dtpt-industrial-api' })
})

app.get('/api/bootstrap', asyncRoute(async (_req, res) => {
  const admin = await resolveAdmin(_req)
  const [products, quotes, settings] = await Promise.all([listProducts(), listQuotes(), getSettings()])
  res.json({ products, quotes: admin && hasPermission(admin, 'quotes.view') ? quotes : [], settings })
}))

app.post('/api/admin/login', asyncRoute(async (req, res) => {
  const user = await authenticateAdmin(req.body?.username, req.body?.password)
  if (!user) return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' })
  const token = signToken({ username: user.username, exp: Date.now() + 1000 * 60 * 60 * 12 })
  res.json({ token, user })
}))

app.get('/api/admin/me', requirePermission(), asyncRoute(async (req, res) => {
  res.json(req.admin)
}))

app.get('/api/admin/users', requirePermission('users.manage'), asyncRoute(async (_req, res) => {
  res.json(await listAdminUsers())
}))

app.post('/api/analytics/events', asyncRoute(async (req, res) => {
  const event = req.body
  if (!event?.eventId || !event?.visitorId || !event?.sessionId || !event?.path) {
    return res.status(400).json({ message: 'Invalid analytics event' })
  }
  await recordAnalyticsEvent({ ...event, eventType: 'page_view' })
  res.status(204).end()
}))

app.get('/api/admin/analytics', requirePermission('analytics.view'), asyncRoute(async (req, res) => {
  res.json(await listAnalyticsEvents(req.query.days))
}))

app.post('/api/admin/users', requirePermission('users.manage'), asyncRoute(async (req, res) => {
  const protectedAccess = req.body?.role === 'owner' || (Array.isArray(req.body?.permissions) && req.body.permissions.some(permission => ['users.manage', 'system.reset'].includes(permission)))
  if (protectedAccess && !req.admin.isRoot) return res.status(403).json({ message: 'Chỉ tài khoản gốc mới có thể cấp quyền Chủ sở hữu, quản lý tài khoản hoặc reset hệ thống' })
  res.status(201).json(await createAdminUser(req.body))
}))

app.put('/api/admin/users/:username', requirePermission('users.manage'), asyncRoute(async (req, res) => {
  const user = await updateAdminUser(req.params.username, req.body, req.admin)
  if (!user) return res.status(404).json({ message: 'Không tìm thấy tài khoản' })
  res.json(user)
}))

app.delete('/api/admin/users/:username', requirePermission('users.manage'), asyncRoute(async (req, res) => {
  const deleted = await deleteAdminUser(req.params.username, req.admin)
  if (!deleted) return res.status(404).json({ message: 'Không tìm thấy tài khoản' })
  res.status(204).end()
}))

app.get('/api/products', asyncRoute(async (_req, res) => {
  res.json(await listProducts())
}))

app.post('/api/products', requirePermission('products.manage'), asyncRoute(async (req, res) => {
  const product = req.body
  if (!isValidProduct(product)) return res.status(400).json({ message: 'Sản phẩm thiếu ID, slug, tên, model hoặc ngành hàng' })
  res.status(201).json(await saveProduct(product))
}))

app.put('/api/products/:id', requirePermission('products.manage'), asyncRoute(async (req, res) => {
  const product = { ...req.body, id: req.params.id }
  if (!isValidProduct(product)) return res.status(400).json({ message: 'Sản phẩm thiếu ID, slug, tên, model hoặc ngành hàng' })
  res.json(await saveProduct(product))
}))

app.delete('/api/products/:id', requirePermission('products.manage'), asyncRoute(async (req, res) => {
  await deleteProduct(req.params.id)
  res.status(204).end()
}))

app.get('/api/quotes', requirePermission('quotes.view'), asyncRoute(async (_req, res) => {
  res.json(await listQuotes())
}))

app.post('/api/quotes', asyncRoute(async (req, res) => {
  const customer = req.body?.customer
  const items = Array.isArray(req.body?.items) ? req.body.items : []
  if (!customer?.name?.trim() || !customer?.company?.trim() || !customer?.phone?.trim() || !customer?.email?.trim()) return res.status(400).json({ message: 'Vui lòng điền đủ thông tin liên hệ' })
  if (!items.length || items.length > 50) return res.status(400).json({ message: 'Danh sách sản phẩm không hợp lệ' })
  const products = await listProducts()
  const validIds = new Set(products.filter(product => product.status === 'active').map(product => product.id))
  if (items.some(item => !validIds.has(item.productId) || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 999)) return res.status(400).json({ message: 'Sản phẩm hoặc số lượng không hợp lệ' })
  const quote = { id: `RFQ-${new Date().toISOString().slice(2, 10).replaceAll('-', '')}-${crypto.randomInt(1000, 9999)}`, createdAt: new Date().toISOString(), customer: { name: customer.name.trim().slice(0, 100), company: customer.company.trim().slice(0, 160), phone: customer.phone.trim().slice(0, 30), email: customer.email.trim().slice(0, 160), note: String(customer.note || '').trim().slice(0, 4000) }, items: items.map(item => ({ productId: item.productId, quantity: item.quantity, requirement: String(item.requirement || '').slice(0, 1000) })), status: 'new' }
  res.status(201).json(await saveQuote(quote))
}))

app.patch('/api/quotes/:id/status', requirePermission('quotes.manage'), asyncRoute(async (req, res) => {
  if (!['new', 'reviewing', 'quoted', 'won', 'closed'].includes(req.body.status)) return res.status(400).json({ message: 'Invalid quote status' })
  const quote = await updateQuoteStatus(req.params.id, req.body.status)
  if (!quote) return res.status(404).json({ message: 'Quote not found' })
  res.json(quote)
}))

app.get('/api/settings', asyncRoute(async (_req, res) => {
  res.json(await getSettings())
}))

app.put('/api/settings', requirePermission('categories.manage', 'branding.manage', 'content.manage', 'display.manage'), asyncRoute(async (req, res) => {
  if (!isValidSettings(req.body)) return res.status(400).json({ message: 'Cấu hình website không hợp lệ hoặc ngành hàng bị trùng' })
  const current = await getSettings()
  const changedSections = [
    ['categories.manage', current.categories, req.body.categories],
    ['branding.manage', {
      storeName: current.storeName, slogan: current.slogan, logoStyle: current.logoStyle, logoRoundSrc: current.logoRoundSrc,
      logoWideSrc: current.logoWideSrc, faviconSrc: current.faviconSrc, phone: current.phone, address: current.address,
      email: current.email, facebook: current.facebook,
    }, {
      storeName: req.body.storeName, slogan: req.body.slogan, logoStyle: req.body.logoStyle, logoRoundSrc: req.body.logoRoundSrc,
      logoWideSrc: req.body.logoWideSrc, faviconSrc: req.body.faviconSrc, phone: req.body.phone, address: req.body.address,
      email: req.body.email, facebook: req.body.facebook,
    }],
    ['content.manage', current.content, req.body.content],
    ['display.manage', { visibility: current.visibility, appearance: current.appearance }, { visibility: req.body.visibility, appearance: req.body.appearance }],
  ].filter(([, before, after]) => JSON.stringify(before) !== JSON.stringify(after))
  if (changedSections.some(([permission]) => !hasPermission(req.admin, permission))) {
    return res.status(403).json({ message: 'Tài khoản không có quyền sửa một hoặc nhiều nhóm cài đặt này' })
  }
  res.json(await saveSettings(req.body))
}))

app.post('/api/reset-demo', requirePermission('system.reset'), asyncRoute(async (_req, res) => {
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
  console.log(`DTPT Techs industrial API is running on port ${port}`)
})
