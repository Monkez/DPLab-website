import { ArrowRight, BadgeCheck, Headphones, Laptop, PackageCheck, Phone, ShieldCheck, Sparkles, Truck, Wrench, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { ProductCard } from '../components/ProductCard'
import { ProductArt } from '../components/ProductArt'
import { useStore } from '../store/StoreContext'

const categories = ['Tất cả', 'Văn phòng', 'Mỏng nhẹ', 'Đồ họa', 'Gaming'] as const

function normalize(value?: string) {
  return (value || '').toLowerCase().trim()
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

export function Storefront({ search, openCart, selectedBrand, selectedLine, onClearCatalog }: { search: string; openCart: () => void; selectedBrand?: string; selectedLine?: string; onClearCatalog: () => void }) {
  const { products, settings, addToCart } = useStore()
  const content = settings.content
  const [category, setCategory] = useState<(typeof categories)[number]>('Tất cả')
  const activeProducts = products.filter(product => product.status === 'active')
  const featured = activeProducts[2] ?? activeProducts[0]
  const hasCatalogFilter = Boolean(selectedBrand || selectedLine)

  const filtered = useMemo(() => activeProducts.filter(product => {
    const text = `${product.name} ${product.brand} ${product.line ?? ''} ${product.cpu}`.toLowerCase()
    return (category === 'Tất cả' || product.category === category)
      && belongsToBrand(product.brand, selectedBrand)
      && belongsToLine(product, selectedLine)
      && text.includes(search.toLowerCase())
  }), [activeProducts, category, search, selectedBrand, selectedLine])

  return <main>
    <section className="hero"><div className="container hero__grid"><div className="hero__copy"><span className="hero__pill"><Sparkles size={15} /> {content.heroBadge}</span><h1>{content.heroTitle}<br /><em>{content.heroHighlight}</em></h1><p>{content.heroDescription}</p><div className="hero__actions"><button className="button button--primary button--large" onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}>{content.heroPrimaryAction} <ArrowRight size={18} /></button><a className="button button--light button--large" href={`tel:${settings.phone.replace(/\s/g, '')}`}><Phone size={18} />{settings.phone}</a></div><div className="hero__trust"><span><BadgeCheck />{content.trustQuality}</span><span><ShieldCheck />{content.trustWarranty}</span><span><Truck />{content.trustDelivery}</span></div></div>
      {featured && <div className="hero__visual"><div className="hero-card"><div className="hero-card__top"><span>DP LAB CHOICE</span><small>01 / 10</small></div><ProductArt product={featured} large /><div className="hero-card__bottom"><div><small>Đề xuất tuần này</small><strong>{featured.name}</strong></div><button onClick={() => { addToCart(featured.id); openCart() }}><ArrowRight /></button></div></div><div className="float-note float-note--one"><span>Hiệu năng</span><strong>{featured.cpu}</strong></div><div className="float-note float-note--two"><span>Ưu đãi</span><strong>Giảm đến 4 triệu</strong></div></div>}
    </div></section>

    <section className="service-strip"><div className="container"><div><PackageCheck /><span><strong>{content.service1Title}</strong><small>{content.service1Description}</small></span></div><div><ShieldCheck /><span><strong>{content.service2Title}</strong><small>{content.service2Description}</small></span></div><div><Wrench /><span><strong>{content.service3Title}</strong><small>{content.service3Description}</small></span></div><div><Headphones /><span><strong>{content.service4Title}</strong><small>{content.service4Description}</small></span></div></div></section>

    <section className="products-section" id="products"><div className="container"><div className="section-heading"><div><p className="eyebrow">{content.productsEyebrow}</p><h2>{content.productsTitle}</h2></div><p>{content.productsDescription}</p></div>
      {hasCatalogFilter && <div className="catalog-filter-chip"><span>Đang xem: <strong>{selectedBrand}{selectedLine ? ` / ${selectedLine}` : ''}</strong></span><button onClick={onClearCatalog}><X size={14} />Xem tất cả</button></div>}
      <div className="category-tabs" role="tablist">{categories.map(item => <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div>
      {filtered.length > 0 ? <div className="product-grid">{filtered.map(product => <ProductCard product={product} key={product.id} />)}</div> : <div className="no-results"><Laptop size={36} /><h3>Chưa thấy chiếc máy phù hợp</h3><p>Thử từ khóa khác hoặc gọi {settings.phone} để DP Lab tìm máy giúp bạn.</p></div>}
    </div></section>

    <section className="why" id="why-us"><div className="container why__grid"><div className="why__aside"><p className="eyebrow">{content.whyEyebrow}</p><h2>{content.whyTitle}</h2><p>{content.whyDescription}</p><a href={`tel:${settings.phone.replace(/\s/g, '')}`}>Trao đổi với kỹ thuật viên <ArrowRight size={17} /></a></div><div className="why__cards"><article><span>01</span><h3>{content.why1Title}</h3><p>{content.why1Description}</p></article><article><span>02</span><h3>{content.why2Title}</h3><p>{content.why2Description}</p></article><article><span>03</span><h3>{content.why3Title}</h3><p>{content.why3Description}</p></article><article><span>04</span><h3>{content.why4Title}</h3><p>{content.why4Description}</p></article></div></div></section>

    <section className="contact-cta" id="contact"><div className="container"><div><p className="eyebrow">{content.contactEyebrow}</p><h2>{content.contactTitle}<br />{content.contactSubtitle}</h2></div><a href={`tel:${settings.phone.replace(/\s/g, '')}`}><span><Phone /></span><small>Hotline tư vấn</small><strong>{settings.phone}</strong></a></div></section>
  </main>
}
