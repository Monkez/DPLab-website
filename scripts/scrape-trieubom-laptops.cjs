const fs = require('fs')
const https = require('https')

const categories = [
  ['Lenovo', 'https://trieubom.com/lenovo/'],
  ['Asus', 'https://trieubom.com/asus/'],
  ['HP', 'https://trieubom.com/hp/'],
  ['Laptop khác', 'https://trieubom.com/laptop-khac/'],
]

const money = value => {
  const numbers = String(value).match(/[\d.,]+/g) || []
  const candidates = numbers
    .map(item => Number(item.replace(/[^\d]/g, '')))
    .filter(value => value >= 1000000 && value <= 200000000)
  return candidates[0] || 0
}
const clean = value => String(value || '').replace(/<[^>]+>/g, ' ').replace(/&quot;/g, '"').replace(/&#8211;/g, '-').replace(/&#8217;/g, "'").replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim()
const slug = value => clean(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

function get(url) {
  return new Promise(resolve => {
    https.get(url, response => {
      let data = ''
      response.on('data', chunk => { data += chunk })
      response.on('end', () => resolve(response.statusCode === 200 ? data : ''))
    }).on('error', () => resolve(''))
  })
}

function detectLine(brand, name) {
  const lines = ['Legion', 'Yoga', 'ThinkBook', 'ThinkPad', 'IdeaPad', 'LOQ', 'Lecoo', 'XPS', 'Latitude', 'Inspiron', 'Vostro', 'Precision', 'Alienware', 'Zenbook', 'Vivobook', 'ROG', 'TUF', 'ProArt', 'ExpertBook', 'Pavilion', 'Envy', 'Spectre', 'EliteBook', 'ProBook', 'Omen', 'MacBook', 'Surface', 'Gram', 'Katana']
  return lines.find(line => name.toLowerCase().includes(line.toLowerCase())) || (brand === 'Laptop khác' ? 'Laptop khác' : undefined)
}

function detectBrand(group, name) {
  if (group !== 'Laptop khác') return group
  if (/macbook|apple/i.test(name)) return 'Apple'
  if (/msi/i.test(name)) return 'MSI'
  if (/surface|microsoft/i.test(name)) return 'Microsoft'
  if (/lg|gram/i.test(name)) return 'LG'
  return 'Laptop khác'
}

function detectCategory(name) {
  if (/rtx|gaming|legion|tuf|rog|nitro|loq|omen|predator/i.test(name)) return 'Gaming'
  if (/proart|creator|studio|rtx|oled/i.test(name)) return 'Đồ họa'
  if (/air|yoga|zenbook|slim|gram|surface/i.test(name)) return 'Mỏng nhẹ'
  return 'Văn phòng'
}

function spec(pattern, name, fallback) {
  return clean((name.match(pattern) || [])[0] || fallback)
}

function productFromCard(group, html, index) {
  const link = (html.match(/<a href="([^"]+)"[^>]*aria-label="([^"]+)"/) || [])
  const href = link[1]
  const name = clean(link[2])
  if (!href || !name || !/laptop|thinkbook|legion|yoga|zenbook|vivobook|proart|tuf|pavilion|macbook|surface|gram|loq|nitro|rog/i.test(name)) return null
  const image = (html.match(/data-src="([^"]+)"/) || html.match(/src="([^"]+)"/) || [])[1]
  const priceStart = html.indexOf('price-wrapper')
  const priceBox = priceStart >= 0 ? html.slice(priceStart, priceStart + 1800) : html
  const prices = [...priceBox.matchAll(/<bdi>([\s\S]*?)(?:&#8363;|₫|woocommerce-Price-currencySymbol)/g)].map(match => money(match[1])).filter(Boolean)
  const sortedPrices = [...new Set(prices)].sort((a, b) => a - b)
  const price = sortedPrices[0] || 0
  const originalPrice = sortedPrices.length > 1 ? sortedPrices[sortedPrices.length - 1] : undefined
  const brand = detectBrand(group, name)
  const line = detectLine(brand, name)
  const category = detectCategory(name)
  const cpu = spec(/(Ryzen|Intel|Core|Ultra|Apple)[^,|\-]{3,32}/i, name, 'Đang cập nhật')
  const ram = spec(/\b(8GB|16GB|24GB|32GB|64GB|96GB)\b/i, name, 'Đang cập nhật')
  const storage = spec(/\b(256GB|512GB|1TB|2TB|4TB)\b/i, name, 'Đang cập nhật')
  const display = spec(/\b(13|14|14\.5|15\.6|16|17)(("| inch|”)[^,)]{0,24})/i, name, 'Đang cập nhật')
  const gpu = spec(/\b(RTX\s?\d{4}|GTX\s?\d{4}|Intel Iris Xe|Radeon|Apple GPU)[^,)]{0,20}/i, name, 'Đang cập nhật')
  const id = `TB-${slug(name).slice(0, 48)}-${index}`.toUpperCase()
  const summary = `${name} phù hợp cho nhu cầu ${category.toLowerCase()}. DP Lab tổng hợp cấu hình, tình trạng, giá bán và tư vấn lựa chọn theo đúng nhu cầu sử dụng.`
  return {
    sourceUrl: href,
    id, name, brand, line, category, cpu, ram, storage, display, gpu,
    price, originalPrice, stock: 2, status: 'active', condition: 'Mới',
    badge: category === 'Gaming' ? 'Gaming' : category === 'Đồ họa' ? 'Creator' : 'Giá tốt',
    accent: category === 'Gaming' ? '#455865' : category === 'Đồ họa' ? '#645d73' : '#7997ae',
    salesSummary: summary,
    detailTitle: `Có nên chọn ${name}?`,
    detailArticle: `${summary}\nMáy được đưa vào danh mục DP Lab để khách dễ so sánh theo cấu hình, ngân sách và mục đích sử dụng.\nNếu bạn cần kiểm tra tình trạng thực tế, nâng cấp RAM/SSD hoặc tư vấn dòng máy tương đương, hãy liên hệ DP Lab trước khi đặt hàng.`,
    detailImages: image ? [image] : [],
    seoTitle: `${name} giá tốt tại DP Lab`,
    seoDescription: `${name} - xem giá, cấu hình, tình trạng và tư vấn chọn laptop tại DP Lab.`,
  }
}

async function scrape() {
  const items = []
  const seen = new Set()
  for (const [group, base] of categories) {
    for (let page = 1; page <= 8; page++) {
      const url = page === 1 ? base : `${base}page/${page}/`
      const html = await get(url)
      const count = (html.match(/woocommerce-LoopProduct-link/g) || []).length
      if (!html || count === 0) break
      const blocks = html.split('<div class="product-small box').slice(1)
      for (const [index, block] of blocks.entries()) {
        const product = productFromCard(group, block, `${page}-${index}`)
        if (!product || seen.has(product.name)) continue
        seen.add(product.name)
        items.push(product)
      }
      if (count < 40) break
    }
  }
  for (const product of items) {
    const html = await get(product.sourceUrl)
    const images = [...html.matchAll(/(?:data-src|src)="(https:\/\/trieubom\.com\/wp-content\/uploads\/[^"]+\.(?:jpg|jpeg|png|webp))"/gi)]
      .map(match => match[1])
      .filter(src => !src.includes('-100x100') && !src.includes('-150x150'))
      .filter(src => !/logo|favicon|cropped|icon|4-2-1/i.test(src.split('/').pop() || ''))
    product.detailImages = [...new Set([...(product.detailImages || []), ...images])].slice(0, 6)
    delete product.sourceUrl
  }
  return items
}

function jsObject(products, ts) {
  const json = JSON.stringify(products, null, 2)
  return ts
    ? `import type { Product } from '../types'\n\nexport const importedLaptopProducts: Product[] = ${json}\n`
    : `export const importedLaptopProducts = ${json}\n`
}

scrape().then(products => {
  fs.writeFileSync('src/data/importedLaptopProducts.ts', jsObject(products, true), 'utf8')
  fs.writeFileSync('backend/src/importedLaptopProducts.js', jsObject(products, false), 'utf8')
  console.log(`Imported ${products.length} laptop products from trieubom.com public category pages.`)
})
