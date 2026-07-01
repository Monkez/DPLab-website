import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { useEffect, useState } from 'react'
import { CartDrawer } from './components/CartDrawer'
import { CheckoutModal } from './components/CheckoutModal'
import { Header } from './components/Header'
import { AdminPage } from './pages/AdminPage'
import { Storefront } from './pages/Storefront'
import { useStore } from './store/StoreContext'

export function App() {
  const [path, setPath] = useState(window.location.pathname)
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedBrand, setSelectedBrand] = useState<string | undefined>()
  const [selectedLine, setSelectedLine] = useState<string | undefined>()
  const { settings } = useStore()

  useEffect(() => {
    const handler = () => setPath(window.location.pathname)
    window.addEventListener('popstate', handler)
    return () => window.removeEventListener('popstate', handler)
  }, [])

  useEffect(() => {
    document.title = `${settings.storeName} | Laptop giá tốt`
    const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]') ?? document.createElement('link')
    favicon.rel = 'icon'
    favicon.type = 'image/png'
    favicon.href = settings.logoRoundSrc || '/dp-lab-logo.png'
    if (!favicon.parentElement) document.head.appendChild(favicon)
  }, [settings.logoRoundSrc, settings.storeName])

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
    <Storefront search={search} openCart={() => setCartOpen(true)} selectedBrand={selectedBrand} selectedLine={selectedLine} onClearCatalog={() => selectCatalog()} />
    <footer className="footer">
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
    <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} onCheckout={() => { setCartOpen(false); setCheckoutOpen(true) }} />
    <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
  </>
}
