import { ArrowRight, ArrowUpDown, BadgeCheck, ChevronLeft, ChevronRight, Headphones, Laptop, PackageCheck, Phone, ShieldCheck, Sparkles, Truck, Wrench, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { ProductCard } from '../components/ProductCard'
import { ProductArt } from '../components/ProductArt'
import { useStore } from '../store/StoreContext'
import { productPath } from '../utils/productSeo'

const categories = ['Tất cả', 'Văn phòng', 'Mỏng nhẹ', 'Đồ họa', 'Gaming'] as const
type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'best-selling'

function normalize(value?: string) {
  return (value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/đ/g, 'd')
    .trim()
}

function belongsToBrand(productBrand: string, selectedBrand?: string) {
  if (!selectedBrand) return true
  if (selectedBrand === 'Laptop khác') return !['lenovo', 'dell', 'asus', 'acer', 'hp'].includes(normalize(productBrand))
  return normalize(productBrand) === normalize(selectedBrand)
}

function belongsToLine(product: { name: string; line?: string }, selectedLine?: string) {
  if (!selectedLine) return true
  const line = normalize(selectedLine)
  return normalize(product.line).includes(line) || normalize(product.name).includes(line)
}

export function Storefront({ search, selectedBrand, selectedLine, onClearCatalog, navigate }: { search: string; selectedBrand?: string; selectedLine?: string; onClearCatalog: () => void; navigate: (path: string) => void }) {
  const { products, orders, settings } = useStore()
  const content = settings.content
  const [category, setCategory] = useState<(typeof categories)[number]>('Tất cả')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [featuredIndex, setFeaturedIndex] = useState(0)
  const activeProducts = useMemo(() => products.filter(product => product.status === 'active'), [products])
  const hasCatalogFilter = Boolean(selectedBrand || selectedLine)

  const salesByProduct = useMemo(() => {
    const sales = new Map<string, number>()
    orders.filter(order => order.status !== 'cancelled').forEach(order => {
      order.items.forEach(item => sales.set(item.productId, (sales.get(item.productId) ?? 0) + item.quantity))
    })
    return sales
  }, [orders])

  const featuredProducts = useMemo(() => activeProducts.map((product, index) => {
    const sales = salesByProduct.get(product.id) ?? 0
    const promoted = normalize(product.badge).includes('ban chay') ? 1 : 0
    const discount = product.originalPrice && product.originalPrice > product.price
      ? (product.originalPrice - product.price) / product.originalPrice
      : 0
    return { product, index, score: sales * 1000 + promoted * 100 + discount }
  }).sort((a, b) => b.score - a.score || a.index - b.index).slice(0, 10).map(item => item.product), [activeProducts, salesByProduct])
  const currentFeaturedIndex = featuredProducts.length ? featuredIndex % featuredProducts.length : 0
  const featured = featuredProducts[currentFeaturedIndex]
  const showPreviousFeatured = () => setFeaturedIndex(current => (current - 1 + featuredProducts.length) % featuredProducts.length)
  const showNextFeatured = () => setFeaturedIndex(current => (current + 1) % featuredProducts.length)

  const filtered = useMemo(() => activeProducts.filter(product => {
    const text = normalize([product.name, product.brand, product.line, product.cpu, product.ram, product.storage, product.display, product.gpu].filter(Boolean).join(' '))
    const query = normalize(search)
    return (category === 'Tất cả' || product.category === category)
      && belongsToBrand(product.brand, selectedBrand)
      && belongsToLine(product, selectedLine)
      && text.includes(query)
  }).map((product, index) => ({ product, index })).sort((a, b) => {
    if (sortBy === 'price-asc') return a.product.price - b.product.price || a.index - b.index
    if (sortBy === 'price-desc') return b.product.price - a.product.price || a.index - b.index
    if (sortBy === 'best-selling') {
      const score = (item: typeof a) => (salesByProduct.get(item.product.id) ?? 0) * 100 + (normalize(item.product.badge).includes('ban chay') ? 1 : 0)
      return score(b) - score(a) || a.index - b.index
    }
    return a.index - b.index
  }).map(item => item.product), [activeProducts, category, search, selectedBrand, selectedLine, sortBy, salesByProduct])

  return <main>
    <section className="hero"><div className="container hero__grid"><div className="hero__copy"><span className="hero__pill"><Sparkles size={15} /> {content.heroBadge}</span><h1>{content.heroTitle}<br /><em>{content.heroHighlight}</em></h1><p>{content.heroDescription}</p><div className="hero__actions"><button className="button button--primary button--large" onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}>{content.heroPrimaryAction} <ArrowRight size={18} /></button><a className="button button--light button--large" href={`tel:${settings.phone.replace(/\s/g, '')}`}><Phone size={18} />{settings.phone}</a></div><div className="hero__trust"><span><BadgeCheck />{content.trustQuality}</span><span><ShieldCheck />{content.trustWarranty}</span><span><Truck />{content.trustDelivery}</span></div></div>
      {featured && <div className="hero__visual"><div className="hero-card"><div className="hero-card__top"><span>DTPT SHOP CHOICE</span><div className="hero-card__navigation"><small>{String(currentFeaturedIndex + 1).padStart(2, '0')} / {String(featuredProducts.length).padStart(2, '0')}</small><button type="button" onClick={showPreviousFeatured} aria-label="Sản phẩm nổi bật trước"><ChevronLeft /></button><button type="button" onClick={showNextFeatured} aria-label="Sản phẩm nổi bật tiếp theo"><ChevronRight /></button></div></div><ProductArt key={featured.id} product={featured} large /><div className="hero-card__bottom"><div><small>Đề xuất tuần này</small><strong>{featured.name}</strong></div><button type="button" onClick={() => navigate(productPath(featured))} aria-label={`Xem chi tiết ${featured.name}`}><ArrowRight /></button></div></div><div className="float-note float-note--one"><span>Hiệu năng</span><strong>{featured.cpu}</strong></div><div className="float-note float-note--two"><span>Ưu đãi</span><strong>{featured.originalPrice && featured.originalPrice > featured.price ? `Tiết kiệm ${new Intl.NumberFormat('vi-VN').format(featured.originalPrice - featured.price)}₫` : featured.badge || 'Giá tốt'}</strong></div></div>}
    </div></section>

    <section className="service-strip"><div className="container"><div><PackageCheck /><span><strong>{content.service1Title}</strong><small>{content.service1Description}</small></span></div><div><ShieldCheck /><span><strong>{content.service2Title}</strong><small>{content.service2Description}</small></span></div><div><Wrench /><span><strong>{content.service3Title}</strong><small>{content.service3Description}</small></span></div><div><Headphones /><span><strong>{content.service4Title}</strong><small>{content.service4Description}</small></span></div></div></section>

    <section className="products-section" id="products"><div className="container"><div className="section-heading"><div><p className="eyebrow">{content.productsEyebrow}</p><h2>{content.productsTitle}</h2></div><p>{content.productsDescription}</p></div>
      {hasCatalogFilter && <div className="catalog-filter-chip"><span>Đang xem: <strong>{selectedBrand}{selectedLine ? ` / ${selectedLine}` : ''}</strong></span><button onClick={onClearCatalog}><X size={14} />Xem tất cả</button></div>}
      <div className="catalog-toolbar">
        <div className="category-tabs" role="tablist">{categories.map(item => <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div>
        <label className="product-sort"><ArrowUpDown size={16} /><span>Sắp xếp</span><select value={sortBy} onChange={event => setSortBy(event.target.value as SortOption)} aria-label="Sắp xếp sản phẩm"><option value="newest">Mới nhất</option><option value="price-asc">Giá thấp đến cao</option><option value="price-desc">Giá cao đến thấp</option><option value="best-selling">Bán chạy nhất</option></select></label>
      </div>
      {search.trim() && <div className="search-result-note">Tìm thấy <strong>{filtered.length}</strong> sản phẩm cho “{search.trim()}”</div>}
      {filtered.length > 0 ? <div className="product-grid">{filtered.map(product => <ProductCard product={product} navigate={navigate} key={product.id} />)}</div> : <div className="no-results"><Laptop size={36} /><h3>Chưa thấy chiếc máy phù hợp</h3><p>Thử từ khóa khác hoặc gọi {settings.phone} để DTPT Shop tìm máy giúp bạn.</p></div>}
    </div></section>

    <section className="why" id="why-us"><div className="container why__grid"><div className="why__aside"><p className="eyebrow">{content.whyEyebrow}</p><h2>{content.whyTitle}</h2><p>{content.whyDescription}</p><a href={`tel:${settings.phone.replace(/\s/g, '')}`}>Trao đổi với kỹ thuật viên <ArrowRight size={17} /></a></div><div className="why__cards"><article><span>01</span><h3>{content.why1Title}</h3><p>{content.why1Description}</p></article><article><span>02</span><h3>{content.why2Title}</h3><p>{content.why2Description}</p></article><article><span>03</span><h3>{content.why3Title}</h3><p>{content.why3Description}</p></article><article><span>04</span><h3>{content.why4Title}</h3><p>{content.why4Description}</p></article></div></div></section>

    <section className="contact-cta" id="contact"><div className="container"><div><p className="eyebrow">{content.contactEyebrow}</p><h2>{content.contactTitle}<br />{content.contactSubtitle}</h2></div><a href={`tel:${settings.phone.replace(/\s/g, '')}`}><span><Phone /></span><small>Hotline tư vấn</small><strong>{settings.phone}</strong></a></div></section>
  </main>
}
