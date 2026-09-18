import { validateVariants, prepareQuoteItems } from './productVariants.js'
import 'dotenv/config'
import cors from 'cors'
import crypto from 'crypto'
import express from 'express'
import { validateQuoteRequest } from './quoteValidation.js'
import {
  authenticateAdmin,
  saveArticleMedia,
  getArticleMedia,
  createAdminUser,
  deleteProduct,
  deleteArticle,
  deleteAdminUser,
  getAdminUser,
  getSettings,
  initDatabase,
  listAdminUsers,
  listAnalyticsEvents,
  listQuotes,
  listProducts,
  listArticles,
  resetDemoData,
  saveQuote,
  saveProduct,
  saveArticle,
  saveSettings,
  recordAnalyticsEvent,
  updateQuoteStatus,
  updateAdminUser,
  clearAnalyticsEvents,
} from './db.js'
import { hasPermission } from './permissions.js'
import { normalizeArticleImage, MAX_IMAGE_BYTES } from './articleMedia.js'
import { createProductMediaRouter } from './productMedia.js'
import { buildAnalyticsReport } from './analyticsReport.js'

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
  try { await handler(req, res, next) }
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

function isValidArticle(article) {
  return Boolean(
    article?.id?.trim?.() && article?.slug?.trim?.() && article?.title?.trim?.() &&
    article?.excerpt?.trim?.() && article?.content?.trim?.() && article?.author?.trim?.() &&
    ['published', 'draft'].includes(article.status) && Array.isArray(article.tags) &&
    /^[-a-z0-9]+$/.test(article.slug)
  )
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'dtpt-industrial-api' })
})

app.get('/api/bootstrap', asyncRoute(async (_req, res) => {
  const admin = await resolveAdmin(_req)
  const [products, quotes, articles, settings] = await Promise.all([listProducts(), listQuotes(), listArticles(), getSettings()])
  res.json({ products, quotes: admin && hasPermission(admin, 'quotes.view') ? quotes : [], articles: admin && hasPermission(admin, 'articles.manage') ? articles : articles.filter(article => article.status === 'published'), settings })
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
  const clean = value => String(value || '').trim().slice(0, 300) || undefined
  const eventId = clean(event?.eventId); const visitorId = clean(event?.visitorId); const sessionId = clean(event?.sessionId); const path = clean(event?.path)
  if (!eventId || !visitorId || !sessionId || !path || path.startsWith('/admin')) {
    return res.status(400).json({ message: 'Invalid analytics event' })
  }
  const device = ['desktop', 'tablet', 'mobile'].includes(event.device) ? event.device : 'desktop'
  await recordAnalyticsEvent({ eventId, visitorId, sessionId, eventType: 'page_view', path, productId: clean(event.productId), referrer: clean(event.referrer), device, browser: clean(event.browser), operatingSystem: clean(event.operatingSystem), utmSource: clean(event.utmSource), utmMedium: clean(event.utmMedium), utmCampaign: clean(event.utmCampaign), createdAt: new Date().toISOString() })
  res.status(204).end()
}))

app.get('/api/admin/analytics', requirePermission('analytics.view'), asyncRoute(async (req, res) => {
  const days = Math.min(Math.max(Number(req.query.days) || 30, 1), 365)
  res.json(buildAnalyticsReport(await listAnalyticsEvents(days), days))
}))

app.delete('/api/admin/analytics', requirePermission('analytics.view'), asyncRoute(async (req, res) => {
  if (!req.admin.isRoot && req.admin.role !== 'owner') return res.status(403).json({ message: 'Chỉ chủ sở hữu mới có thể xóa dữ liệu lưu lượng' })
  res.json({ deleted: await clearAnalyticsEvents() })
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
  const variantError = validateVariants(product)
  if (variantError) return res.status(400).json({ message: variantError })
  res.status(201).json(await saveProduct(product))
}))

app.put('/api/products/:id', requirePermission('products.manage'), asyncRoute(async (req, res) => {
  const product = { ...req.body, id: req.params.id }
  if (!isValidProduct(product)) return res.status(400).json({ message: 'Sản phẩm thiếu ID, slug, tên, model hoặc ngành hàng' })
  const variantError = validateVariants(product)
  if (variantError) return res.status(400).json({ message: variantError })
  res.json(await saveProduct(product))
}))

app.delete('/api/products/:id', requirePermission('products.manage'), asyncRoute(async (req, res) => {
  await deleteProduct(req.params.id)
  res.status(204).end()
}))

// Reuse the durable media table; product upload permissions remain independent of articles.
app.use('/api/product-media', createProductMediaRouter({ requirePermission, saveImage: saveArticleMedia, getImage: getArticleMedia }))

app.post('/api/article-media', requirePermission('articles.manage'), express.raw({ type: ['image/jpeg', 'image/png', 'image/webp', 'application/octet-stream'], limit: MAX_IMAGE_BYTES }), asyncRoute(async (req, res) => {
  let data
  try { data = await normalizeArticleImage(req.body) }
  catch { return res.status(400).json({ message: 'Ảnh không hợp lệ. Chọn ảnh tĩnh JPG, PNG hoặc WebP tối đa 5 MB, tối đa 40 megapixel.' }) }
  const id = crypto.randomUUID()
  await saveArticleMedia(id, data)
  res.status(201).json({ path: `/api/article-media/${id}` })
}))
app.get('/api/article-media/:id', asyncRoute(async (req, res) => {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(req.params.id)) return res.sendStatus(404)
  const data = await getArticleMedia(req.params.id)
  if (!data) return res.sendStatus(404)
  res.set({ 'Content-Type': 'image/webp', 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'public, max-age=31536000, immutable' }).send(data)
}))

app.get('/api/articles', asyncRoute(async (req, res) => {
  const admin = await resolveAdmin(req)
  const articles = await listArticles()
  res.json(admin && hasPermission(admin, 'articles.manage') ? articles : articles.filter(article => article.status === 'published'))
}))

app.post('/api/articles', requirePermission('articles.manage'), asyncRoute(async (req, res) => {
  const article = req.body
  if (!isValidArticle(article)) return res.status(400).json({ message: 'Bài viết thiếu tiêu đề, slug, mô tả, nội dung hoặc tác giả' })
  const articles = await listArticles()
  if (articles.some(item => item.id !== article.id && item.slug === article.slug)) return res.status(409).json({ message: 'Slug bài viết đã tồn tại' })
  res.status(201).json(await saveArticle(article))
}))

app.put('/api/articles/:id', requirePermission('articles.manage'), asyncRoute(async (req, res) => {
  const article = { ...req.body, id: req.params.id }
  if (!isValidArticle(article)) return res.status(400).json({ message: 'Bài viết thiếu tiêu đề, slug, mô tả, nội dung hoặc tác giả' })
  const articles = await listArticles()
  if (articles.some(item => item.id !== article.id && item.slug === article.slug)) return res.status(409).json({ message: 'Slug bài viết đã tồn tại' })
  res.json(await saveArticle(article))
}))

app.delete('/api/articles/:id', requirePermission('articles.manage'), asyncRoute(async (req, res) => {
  await deleteArticle(req.params.id)
  res.status(204).end()
}))

app.get('/api/sitemap.xml', asyncRoute(async (_req, res) => {
  const baseUrl = 'https://dtpt.shop'
  const [products, articles] = await Promise.all([listProducts(), listArticles()])
  const urls = [
    { loc: `${baseUrl}/`, priority: '1.0' },
    { loc: `${baseUrl}/san-pham`, priority: '0.9' },
    { loc: `${baseUrl}/tin-tuc`, priority: '0.8' },
    { loc: `${baseUrl}/huong-dan-mua-hang`, priority: '0.6' },
    ...products.filter(item => item.status === 'active').map(item => ({ loc: `${baseUrl}/san-pham/${encodeURIComponent(item.slug)}`, priority: '0.7', lastmod: item.priceUpdatedAt })),
    ...articles.filter(item => item.status === 'published').map(item => ({ loc: `${baseUrl}/tin-tuc/${encodeURIComponent(item.slug)}`, priority: '0.7', lastmod: item.updatedAt || item.publishedAt })),
  ]
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(item => `  <url>\n    <loc>${item.loc}</loc>${item.lastmod ? `\n    <lastmod>${String(item.lastmod).slice(0, 10)}</lastmod>` : ''}\n    <priority>${item.priority}</priority>\n  </url>`).join('\n')}\n</urlset>`
  res.type('application/xml').send(xml)
}))

app.get('/api/quotes', requirePermission('quotes.view'), asyncRoute(async (_req, res) => {
  res.json(await listQuotes())
}))

app.post('/api/quotes', asyncRoute(async (req, res) => {
  const result = validateQuoteRequest(req.body)
  if (result.error) return res.status(400).json({ message: result.error })
  const { customer, items } = result
  const products = await listProducts()
  let preparedItems
  try { preparedItems = prepareQuoteItems(products, items) } catch (error) { return res.status(400).json({ message: error.message }) }
  const quote = { id: `RFQ-${new Date().toISOString().slice(2, 10).replaceAll('-', '')}-${crypto.randomInt(1000, 9999)}`, createdAt: new Date().toISOString(), customer: { name: customer.name.trim().slice(0, 100), company: customer.company.trim().slice(0, 160), phone: customer.phone.trim().slice(0, 30), email: customer.email.trim().slice(0, 160), note: String(customer.note || '').trim().slice(0, 4000) }, items: preparedItems, status: 'new' }
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
  if (error.type === 'entity.too.large') return res.status(413).json({ message: 'Dữ liệu tải lên vượt dung lượng cho phép.' })
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
