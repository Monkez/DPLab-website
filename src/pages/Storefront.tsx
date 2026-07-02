import { ArrowRight, BadgeCheck, ChevronLeft, ChevronRight, Headphones, PackageCheck, Phone, ShieldCheck, Sparkles, Truck, Wrench } from 'lucide-react'
import { useMemo, useState } from 'react'
import { ProductCard } from '../components/ProductCard'
import { ProductArt } from '../components/ProductArt'
import { useStore } from '../store/StoreContext'
import { productPath } from '../utils/productSeo'

function normalize(value?: string) {
  return (value || '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/đ/g, 'd').trim()
}

export function Storefront({ navigate }: { navigate: (path: string) => void }) {
  const { products, orders, settings } = useStore()
  const content = settings.content
  const [featuredIndex, setFeaturedIndex] = useState(0)
  const activeProducts = useMemo(() => products.filter(product => product.status === 'active'), [products])

  const salesByProduct = useMemo(() => {
    const sales = new Map<string, number>()
    orders.filter(order => order.status !== 'cancelled').forEach(order => {
      order.items.forEach(item => sales.set(item.productId, (sales.get(item.productId) ?? 0) + item.quantity))
    })
    return sales
  }, [orders])

  const bestSellingProducts = useMemo(() => activeProducts.map((product, index) => {
    const sales = salesByProduct.get(product.id) ?? 0
    const promoted = normalize(product.badge).includes('ban chay') ? 1 : 0
    const discount = product.originalPrice && product.originalPrice > product.price
      ? (product.originalPrice - product.price) / product.originalPrice
      : 0
    return { product, index, score: sales * 1000 + promoted * 100 + discount }
  }).sort((a, b) => b.score - a.score || a.index - b.index).map(item => item.product), [activeProducts, salesByProduct])

  const featuredProducts = bestSellingProducts.slice(0, 10)
  const currentFeaturedIndex = featuredProducts.length ? featuredIndex % featuredProducts.length : 0
  const featured = featuredProducts[currentFeaturedIndex]
  const showPreviousFeatured = () => setFeaturedIndex(current => (current - 1 + featuredProducts.length) % featuredProducts.length)
  const showNextFeatured = () => setFeaturedIndex(current => (current + 1) % featuredProducts.length)

  const homeGroups = [
    { key: 'best-selling', eyebrow: 'ĐƯỢC QUAN TÂM NHIỀU', title: 'Sản phẩm bán chạy', description: 'Những cấu hình được khách hàng lựa chọn và quan tâm nhiều nhất.', products: bestSellingProducts.slice(0, 4) },
    { key: 'newest', eyebrow: 'VỪA CẬP NHẬT', title: 'Sản phẩm mới về', description: 'Các mẫu laptop mới được bổ sung vào danh mục DTPT Shop.', products: activeProducts.slice(0, 4) },
    { key: 'gaming', eyebrow: 'HIỆU NĂNG MẠNH', title: 'Laptop Gaming', description: 'Laptop hiệu năng cao dành cho chơi game, đồ họa và công việc nặng.', products: activeProducts.filter(product => product.category === 'Gaming').slice(0, 4) },
    { key: 'office', eyebrow: 'GỌN NHẸ · BỀN BỈ', title: 'Laptop văn phòng', description: 'Các lựa chọn cân bằng cho học tập, làm việc và di chuyển hàng ngày.', products: activeProducts.filter(product => product.category === 'Văn phòng').slice(0, 4) },
  ]

  return <main>
    <section className="hero"><div className="container hero__grid"><div className="hero__copy"><span className="hero__pill"><Sparkles size={15} /> {content.heroBadge}</span><h1>{content.heroTitle}<br /><em>{content.heroHighlight}</em></h1><p>{content.heroDescription}</p><div className="hero__actions"><button className="button button--primary button--large" onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}>{content.heroPrimaryAction} <ArrowRight size={18} /></button><a className="button button--light button--large" href={`tel:${settings.phone.replace(/\s/g, '')}`}><Phone size={18} />{settings.phone}</a></div><div className="hero__trust"><span><BadgeCheck />{content.trustQuality}</span><span><ShieldCheck />{content.trustWarranty}</span><span><Truck />{content.trustDelivery}</span></div></div>
      {featured && <div className="hero__visual"><div className="hero-card"><div className="hero-card__top"><span>DTPT SHOP CHOICE</span><div className="hero-card__navigation"><small>{String(currentFeaturedIndex + 1).padStart(2, '0')} / {String(featuredProducts.length).padStart(2, '0')}</small><button type="button" onClick={showPreviousFeatured} aria-label="Sản phẩm nổi bật trước"><ChevronLeft /></button><button type="button" onClick={showNextFeatured} aria-label="Sản phẩm nổi bật tiếp theo"><ChevronRight /></button></div></div><ProductArt key={featured.id} product={featured} large /><div className="hero-card__bottom"><div><small>Đề xuất tuần này</small><strong>{featured.name}</strong></div><button type="button" onClick={() => navigate(productPath(featured))} aria-label={`Xem chi tiết ${featured.name}`}><ArrowRight /></button></div></div><div className="float-note float-note--one"><span>Hiệu năng</span><strong>{featured.cpu}</strong></div><div className="float-note float-note--two"><span>Ưu đãi</span><strong>{featured.originalPrice && featured.originalPrice > featured.price ? `Tiết kiệm ${new Intl.NumberFormat('vi-VN').format(featured.originalPrice - featured.price)}₫` : featured.badge || 'Giá tốt'}</strong></div></div>}
    </div></section>

    <section className="service-strip"><div className="container"><div><PackageCheck /><span><strong>{content.service1Title}</strong><small>{content.service1Description}</small></span></div><div><ShieldCheck /><span><strong>{content.service2Title}</strong><small>{content.service2Description}</small></span></div><div><Wrench /><span><strong>{content.service3Title}</strong><small>{content.service3Description}</small></span></div><div><Headphones /><span><strong>{content.service4Title}</strong><small>{content.service4Description}</small></span></div></div></section>

    <section className="home-products" id="products"><div className="container">
      {homeGroups.map(group => group.products.length > 0 && <section className="home-product-section" key={group.key}>
        <div className="home-section-heading"><div><p className="eyebrow">{group.eyebrow}</p><h2>{group.title}</h2><p>{group.description}</p></div><button className="home-see-more" onClick={() => navigate(`/laptop?section=${group.key}`)}>Xem thêm <ArrowRight /></button></div>
        <div className="product-grid">{group.products.map(product => <ProductCard product={product} navigate={navigate} key={product.id} />)}</div>
      </section>)}
    </div></section>

    <section className="why" id="why-us"><div className="container why__grid"><div className="why__aside"><p className="eyebrow">{content.whyEyebrow}</p><h2>{content.whyTitle}</h2><p>{content.whyDescription}</p><a href={`tel:${settings.phone.replace(/\s/g, '')}`}>Trao đổi với kỹ thuật viên <ArrowRight size={17} /></a></div><div className="why__cards"><article><span>01</span><h3>{content.why1Title}</h3><p>{content.why1Description}</p></article><article><span>02</span><h3>{content.why2Title}</h3><p>{content.why2Description}</p></article><article><span>03</span><h3>{content.why3Title}</h3><p>{content.why3Description}</p></article><article><span>04</span><h3>{content.why4Title}</h3><p>{content.why4Description}</p></article></div></div></section>

    <section className="contact-cta" id="contact"><div className="container"><div><p className="eyebrow">{content.contactEyebrow}</p><h2>{content.contactTitle}<br />{content.contactSubtitle}</h2></div><a href={`tel:${settings.phone.replace(/\s/g, '')}`}><span><Phone /></span><small>Hotline tư vấn</small><strong>{settings.phone}</strong></a></div></section>
  </main>
}
