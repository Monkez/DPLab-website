import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { CartDrawer } from './components/CartDrawer'
import { CheckoutModal } from './components/CheckoutModal'
import { FloatingContact } from './components/FloatingContact'
import { Header } from './components/Header'
import { AdminPage } from './pages/AdminPage'
import { CatalogPage } from './pages/CatalogPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { Storefront } from './pages/Storefront'
import { useStore } from './store/StoreContext'
import { productPath, productSeoDescription, productSeoTitle } from './utils/productSeo'

function upsertMeta(name: string, content: string) {
  const selector = name.startsWith('og:') ? `meta[property="${name}"]` : `meta[name="${name}"]`
  const meta = document.querySelector<HTMLMetaElement>(selector) ?? document.createElement('meta')
  if (name.startsWith('og:')) meta.setAttribute('property', name)
  else meta.name = name
  meta.content = content
  if (!meta.parentElement) document.head.appendChild(meta)
}

function upsertJsonLd(data: object | null) {
  const id = 'dplab-jsonld'
  document.getElementById(id)?.remove()
  if (!data) return
  const script = document.createElement('script')
  script.id = id
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(data)
  document.head.appendChild(script)
}

export function App() {
  const [route, setRoute] = useState(() => `${window.location.pathname}${window.location.search}`)
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [search, setSearch] = useState(() => new URLSearchParams(window.location.search).get('q') || '')
  const { settings, products } = useStore()
  const path = route.split('?')[0]
  const searchParams = useMemo(() => new URLSearchParams(route.includes('?') ? route.slice(route.indexOf('?') + 1) : ''), [route])

  const detailProduct = useMemo(() => products.find(product => path === productPath(product)), [path, products])

  useEffect(() => {
    const handler = () => {
      setRoute(`${window.location.pathname}${window.location.search}`)
      setSearch(new URLSearchParams(window.location.search).get('q') || '')
    }
    window.addEventListener('popstate', handler)
    return () => window.removeEventListener('popstate', handler)
  }, [])

  useEffect(() => {
    const catalogTitle = search ? `Tìm kiếm “${search}” | ${settings.storeName}` : `Danh mục laptop | ${settings.storeName}`
    const title = detailProduct ? productSeoTitle(detailProduct, settings) : path === '/laptop' ? catalogTitle : `${settings.storeName} | Laptop giá tốt`
    const description = detailProduct ? productSeoDescription(detailProduct) : path === '/laptop' ? `Khám phá danh mục laptop tại ${settings.storeName}, lọc theo nhu cầu và sắp xếp theo giá.` : `${settings.storeName} - ${settings.slogan}. Laptop được chọn kỹ, giá minh bạch, tư vấn tận tâm.`
    document.title = title
    upsertMeta('description', description)
    upsertMeta('og:title', title)
    upsertMeta('og:description', description)
    upsertMeta('og:type', detailProduct ? 'product' : 'website')
    upsertMeta('og:url', window.location.href)
    const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]') ?? document.createElement('link')
    favicon.rel = 'icon'
    favicon.type = 'image/png'
    favicon.href = settings.logoRoundSrc || '/dp-lab-logo.png'
    if (!favicon.parentElement) document.head.appendChild(favicon)
    upsertJsonLd(detailProduct ? {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: detailProduct.name,
      brand: detailProduct.brand,
      description,
      sku: detailProduct.id,
      offers: {
        '@type': 'Offer',
        priceCurrency: 'VND',
        price: detailProduct.price,
        availability: detailProduct.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      },
    } : {
      '@context': 'https://schema.org',
      '@type': 'Store',
      name: settings.storeName,
      description,
      telephone: settings.phone,
      address: settings.address,
    })
  }, [detailProduct, path, search, settings])

  const navigate = (next: string) => {
    window.history.pushState({}, '', next)
    setRoute(`${window.location.pathname}${window.location.search}`)
    setSearch(new URLSearchParams(window.location.search).get('q') || '')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const selectCatalog = (brand?: string, line?: string) => {
    const params = new URLSearchParams()
    if (brand) params.set('brand', brand)
    if (line) params.set('line', line)
    navigate(`/laptop${params.toString() ? `?${params}` : ''}`)
  }

  const handleSearch = (value: string) => {
    setSearch(value)
    const params = new URLSearchParams()
    if (value.trim()) params.set('q', value.trim())
    const next = `/laptop${params.toString() ? `?${params}` : ''}`
    if (path === '/laptop') window.history.replaceState({}, '', next)
    else window.history.pushState({}, '', next)
    setRoute(next)
    if (path !== '/laptop') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (path.startsWith('/admin')) return <AdminPage navigate={navigate} />

  return <>
    <Header onCart={() => setCartOpen(true)} onSearch={handleSearch} search={search} navigate={navigate} onCatalogSelect={selectCatalog} />
    {detailProduct
      ? <ProductDetailPage product={detailProduct} navigate={navigate} />
      : path === '/laptop'
        ? <CatalogPage searchParams={searchParams} navigate={navigate} />
        : <Storefront navigate={navigate} />}
    <Footer settings={settings} navigate={navigate} />
    <FloatingContact settings={settings} />
    <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} onCheckout={() => { setCartOpen(false); setCheckoutOpen(true) }} />
    <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
  </>
}

function Footer({ settings, navigate }: { settings: ReturnType<typeof useStore>['settings']; navigate: (path: string) => void }) {
  return <footer className="footer">
    <div className="container footer__grid">
      <div className="footer__brand">
        <div className={`footer-brand-main footer-brand-main--${settings.logoStyle}`}>
          {settings.logoStyle === 'wide'
            ? <img className="footer-brand-wide" src={settings.logoWideSrc} alt={settings.storeName} />
            : <span className="footer-brand-mark"><img src={settings.logoRoundSrc} alt={settings.storeName} /></span>}
          <div className="footer-brand-copy"><strong>{settings.storeName}</strong><small>{settings.slogan}</small></div>
        </div>
        <p>{settings.content.footerDescription}</p>
        {settings.logoStyle === 'round' && <div className="operator-brand"><span>Đơn vị vận hành</span><img src={settings.logoWideSrc} alt="DTPT Techs" /></div>}
      </div>
      <div><h3>Khám phá</h3><button onClick={() => navigate('/laptop?section=office')}>Laptop văn phòng</button><button onClick={() => navigate('/laptop?category=Đồ họa')}>Laptop đồ họa</button><button onClick={() => navigate('/laptop?section=gaming')}>Laptop gaming</button><button onClick={() => navigate('/admin')}>Trang quản trị</button></div>
      <div><h3>Hỗ trợ</h3><a href="#why-us">Chính sách bảo hành</a><a href="#why-us">Giao nhận & kiểm máy</a><a href="#contact">Tư vấn chọn máy</a></div>
      <div><h3>Liên hệ</h3><a href={`tel:${settings.phone.replace(/\s/g, '')}`}><Phone />{settings.phone}</a><a href={`mailto:${settings.email}`}><Mail />{settings.email}</a><span><MapPin />{settings.address}</span><a href={`https://${settings.facebook}`}><MessageCircle />DTPT Shop</a></div>
    </div>
    <div className="container footer__bottom"><span>© 2026 DTPT Shop. Một thương hiệu thuộc DTPT-Techs.</span><span>{settings.slogan}</span></div>
  </footer>
}
