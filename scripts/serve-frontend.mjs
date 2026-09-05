import http from 'node:http'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import handler from 'serve-handler'

const port = Number(process.env.PORT || 3000)
const host = '0.0.0.0'
const siteUrl = 'https://www.dtpt.shop'
const apiUrl = String(process.env.VITE_API_URL || '').replace(/\/$/, '')
const indexPath = resolve('dist/index.html')
let seoCache = { expiresAt: 0, data: null }

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be a valid TCP port')
}

const escapeHtml = value => String(value || '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character])
const safeJson = value => JSON.stringify(value).replace(/</g, '\\u003c')
async function getSeoData() {
  if (!apiUrl) return null
  if (seoCache.expiresAt > Date.now()) return seoCache.data
  try {
    const response = await fetch(`${apiUrl}/api/bootstrap`, { signal: AbortSignal.timeout(5000) })
    if (!response.ok) return null
    seoCache = { expiresAt: Date.now() + 300000, data: await response.json() }
    return seoCache.data
  } catch { return null }
}
function pageSeo(pathname, data) {
  const product = pathname.startsWith('/san-pham/') ? data?.products?.find(item => item.status === 'active' && item.slug === decodeURIComponent(pathname.slice(10))) : null
  const article = pathname.startsWith('/tin-tuc/') ? data?.articles?.find(item => item.status === 'published' && item.slug === decodeURIComponent(pathname.slice(9))) : null
  const settings = data?.settings || {}; const name = settings.storeName || 'DTPT Techs'; const canonical = `${siteUrl}${pathname === '/' ? '/' : pathname}`
  const title = article ? article.seoTitle || `${article.title} | ${name}` : product ? product.seoTitle || `${product.name} ${product.model} | ${name}` : pathname === '/tin-tuc' ? `Tin tức công nghệ công nghiệp | ${name}` : pathname === '/san-pham' ? `Thiết bị công nghiệp | ${name}` : `${name} | ${settings.slogan || 'Công nghệ tiên tiến. Giá trị bền vững.'}`
  const description = article ? article.seoDescription || article.excerpt : product ? product.seoDescription || product.summary : pathname === '/tin-tuc' ? 'Kiến thức lựa chọn thiết bị, công nghệ mới và kinh nghiệm triển khai cho nhà máy, phòng nghiên cứu.' : settings.content?.heroDescription || 'Thiết bị công nghiệp, đo lường và tự động hóa cho doanh nghiệp, nhà máy và viện nghiên cứu.'
  const imagePath = article?.coverImage || product?.images?.[0] || settings.logoWideSrc || '/dtpt-techs-logo.png'; const image = imagePath.startsWith('http') ? imagePath : `${siteUrl}${imagePath}`
  const schema = article ? { '@context': 'https://schema.org', '@type': 'Article', headline: article.title, description, image: [image], datePublished: article.publishedAt, dateModified: article.updatedAt, author: { '@type': 'Organization', name: article.author }, publisher: { '@type': 'Organization', name }, mainEntityOfPage: canonical } : product ? { '@context': 'https://schema.org', '@type': 'Product', name: `${product.name} ${product.model}`, description, image: [image], brand: { '@type': 'Brand', name: product.brand }, model: product.model, sku: product.id, offers: product.price ? { '@type': 'Offer', priceCurrency: 'VND', price: product.price, availability: 'https://schema.org/PreOrder', url: canonical } : undefined } : { '@context': 'https://schema.org', '@type': 'Organization', name, url: siteUrl, logo: image, email: settings.email, telephone: settings.phone }
  return { title, description, canonical, image, type: article ? 'article' : product ? 'product' : 'website', schema }
}
function injectSeo(html, seo, noindex = false) {
  const tags = `<meta name="robots" content="${noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'}" /><meta name="description" content="${escapeHtml(seo.description)}" /><meta property="og:title" content="${escapeHtml(seo.title)}" /><meta property="og:description" content="${escapeHtml(seo.description)}" /><meta property="og:type" content="${seo.type}" /><meta property="og:url" content="${escapeHtml(seo.canonical)}" /><meta property="og:image" content="${escapeHtml(seo.image)}" /><meta name="twitter:card" content="summary_large_image" /><link rel="canonical" href="${escapeHtml(seo.canonical)}" /><script type="application/ld+json" id="dtpt-structured-data">${safeJson(seo.schema)}</script>`
  return html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(seo.title)}</title>`).replace(/<meta name="description"[^>]*>/gi, '').replace(/<meta name="robots"[^>]*>/gi, '').replace(/<meta property="og:[^"]+"[^>]*>/gi, '').replace(/<meta name="twitter:[^"]+"[^>]*>/gi, '').replace(/<link rel="canonical"[^>]*>/gi, '').replace('</head>', `${tags}</head>`)
}

const serveStatic = (request, response) => handler(request, response, {
  public: 'dist',
  cleanUrls: false,
  rewrites: [{ source: '**', destination: '/index.html' }],
  headers: [
    { source: '**/*.{js,css,png,jpg,jpeg,webp,svg,woff,woff2}', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
    { source: '**', headers: [{ key: 'X-Content-Type-Options', value: 'nosniff' }] },
  ],
})

const server = http.createServer(async (request, response) => {
  const pathname = new URL(request.url || '/', siteUrl).pathname
  if (pathname === '/sitemap.xml' && apiUrl) {
    try {
      const upstream = await fetch(`${apiUrl}/api/sitemap.xml`, { signal: AbortSignal.timeout(5000) })
      if (upstream.ok) { response.writeHead(200, { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=300' }); response.end(await upstream.text()); return }
    } catch { /* use static sitemap fallback */ }
  }
  const isPage = request.method === 'GET' && (pathname === '/' || pathname === '/san-pham' || pathname.startsWith('/san-pham/') || pathname === '/tin-tuc' || pathname.startsWith('/tin-tuc/') || pathname.startsWith('/admin'))
  if (isPage) {
    try {
      const [html, data] = await Promise.all([readFile(indexPath, 'utf8'), getSeoData()])
      const seo = pageSeo(pathname, data)
      response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=0, must-revalidate', 'X-Content-Type-Options': 'nosniff' })
      response.end(injectSeo(html, seo, pathname.startsWith('/admin')))
      return
    } catch (error) { console.error('SEO rendering fallback:', error.message) }
  }
  return serveStatic(request, response)
})

server.listen(port, host, () => {
  console.log(`DTPT Techs frontend listening on http://${host}:${port}`)
})

const shutdown = signal => {
  console.log(`${signal} received, shutting down frontend server`)
  server.close(error => {
    if (error) {
      console.error(error)
      process.exitCode = 1
    }
  })
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))
