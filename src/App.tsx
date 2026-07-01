import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { CartDrawer } from './components/CartDrawer'
import { CheckoutModal } from './components/CheckoutModal'
import { FloatingContact } from './components/FloatingContact'
import { Header } from './components/Header'
import { AdminPage } from './pages/AdminPage'
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
  const [path, setPath] = useState(window.location.pathname)
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedBrand, setSelectedBrand] = useState<string | undefined>()
  const [selectedLine, setSelectedLine] = useState<string | undefined>()
  const { settings, products } = useStore()

  const detailProduct = useMemo(() => products.find(product => path === productPath(product)), [path, products])

  useEffect(() => {
    const handler = () => setPath(window.location.pathname)
    window.addEventListener('popstate', handler)
    return () => window.removeEventListener('popstate', handler)
  }, [])

  useEffect(() => {
    const title = detailProduct ? productSeoTitle(detailProduct, settings) : `${settings.storeName} | Laptop giá tốt`
    const description = detailProduct ? productSeoDescription(detailProduct) : `${settings.storeName} - ${settings.slogan}. Laptop được chọn kỹ, giá minh bạch, tư vấn tận tâm.`
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
  }, [detailProduct, settings])

  const navigate = (next: string) => {
    window.history.pushState({}, '', next)
    setPath(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const selectCatalog = (brand?: string, line?: string) => {
    setSelectedBrand(brand)
    setSelectedLine(line)
  }

  if (path.startsWith('/admin')) return <AdminPage navigate={navigate} />

  return <>
    <Header onCart={() => setCartOpen(true)} onSearch={setSearch} search={search} navigate={navigate} onCatalogSelect={selectCatalog} />
    {detailProduct
      ? <ProductDetailPage product={detailProduct} navigate={navigate} />
      : <Storefront search={search} openCart={() => setCartOpen(true)} selectedBrand={selectedBrand} selectedLine={selectedLine} onClearCatalog={() => selectCatalog()} navigate={navigate} />}
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
      <div><h3>Khám phá</h3><a href="#products">Laptop văn phòng</a><a href="#products">Laptop đồ họa</a><a href="#products">Laptop gaming</a><button onClick={() => navigate('/admin')}>Trang quản trị</button></div>
      <div><h3>Hỗ trợ</h3><a href="#why-us">Chính sách bảo hành</a><a href="#why-us">Giao nhận & kiểm máy</a><a href="#contact">Tư vấn chọn máy</a></div>
      <div><h3>Liên hệ</h3><a href={`tel:${settings.phone.replace(/\s/g, '')}`}><Phone />{settings.phone}</a><a href={`mailto:${settings.email}`}><Mail />{settings.email}</a><span><MapPin />{settings.address}</span><a href={`https://${settings.facebook}`}><MessageCircle />DP Lab</a></div>
    </div>
    <div className="container footer__bottom"><span>© 2026 DP Lab. Một thương hiệu thuộc DTPT-Techs.</span><span>{settings.slogan}</span></div>
  </footer>
}
