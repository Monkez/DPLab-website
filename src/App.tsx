import { Mail, MapPin, Phone } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { CartDrawer } from './components/CartDrawer'
import { CheckoutModal } from './components/CheckoutModal'
import { FloatingContact } from './components/FloatingContact'
import { Header } from './components/Header'
import { AdminPage } from './pages/AdminPage'
import { CatalogPage } from './pages/CatalogPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { Storefront } from './pages/Storefront'
import { api } from './services/api'
import { useStore } from './store/StoreContext'

function meta(name: string, content: string) { const key = name.startsWith('og:') ? 'property' : 'name'; const node = document.querySelector<HTMLMetaElement>(`meta[${key}="${name}"]`) ?? document.createElement('meta'); node.setAttribute(key, name); node.content = content; if (!node.parentElement) document.head.appendChild(node) }
export function App() {
  const [route, setRoute] = useState(`${location.pathname}${location.search}`); const [search, setSearch] = useState(new URLSearchParams(location.search).get('q') || ''); const [drawer, setDrawer] = useState(false); const [modal, setModal] = useState(false); const { products, settings } = useStore()
  const path = route.split('?')[0]; const params = useMemo(() => new URLSearchParams(route.split('?')[1] || ''), [route]); const product = path.startsWith('/san-pham/') ? products.find(item => item.slug === decodeURIComponent(path.slice('/san-pham/'.length))) : undefined
  const navigate = (next: string) => { history.pushState({}, '', next); setRoute(`${location.pathname}${location.search}`); setSearch(new URLSearchParams(location.search).get('q') || ''); scrollTo({ top: 0, behavior: 'smooth' }); setTimeout(() => { if (next.includes('#')) document.getElementById(next.split('#')[1])?.scrollIntoView({ behavior: 'smooth' }) }, 50) }
  useEffect(() => { const handler = () => setRoute(`${location.pathname}${location.search}`); addEventListener('popstate', handler); return () => removeEventListener('popstate', handler) }, [])
  useEffect(() => { const title = product ? `${product.name} ${product.model} | ${settings.storeName}` : path === '/san-pham' ? `Thiết bị công nghiệp | ${settings.storeName}` : `${settings.storeName} | ${settings.slogan}`; const description = product?.summary || settings.content.heroDescription; document.title = title; meta('description', description); meta('og:title', title); meta('og:description', description); meta('og:type', product ? 'product' : 'website'); api.trackPageView(route, product?.id).catch(() => undefined) }, [path, product, route, settings])
  const onSearch = (value: string) => { setSearch(value); const next = `/san-pham${value.trim() ? `?q=${encodeURIComponent(value.trim())}` : ''}`; history.replaceState({}, '', next); setRoute(next) }
  if (path.startsWith('/admin')) return <AdminPage navigate={navigate} />
  return <><Header navigate={navigate} search={search} onSearch={onSearch} onQuote={() => setDrawer(true)} />{product ? <ProductDetailPage product={product} navigate={navigate} /> : path === '/san-pham' ? <CatalogPage params={params} navigate={navigate} /> : <Storefront navigate={navigate} onQuote={() => setModal(true)} />}<Footer navigate={navigate} /><FloatingContact settings={settings} /><CartDrawer open={drawer} onClose={() => setDrawer(false)} onCheckout={() => { setDrawer(false); setModal(true) }} /><CheckoutModal open={modal} onClose={() => setModal(false)} /></>
}
function Footer({ navigate }: { navigate: (path: string) => void }) { const { settings } = useStore(); return <footer className="footer"><div className="container footer__grid"><div><img className="footer-logo" src={settings.logoWideSrc} alt={settings.storeName} /><p>{settings.content.footerDescription}</p></div><div><h3>Khám phá</h3><button onClick={() => navigate('/san-pham')}>Danh mục sản phẩm</button><button onClick={() => navigate('/#linh-vuc')}>Lĩnh vực cung cấp</button><button onClick={() => navigate('/#nang-luc')}>Năng lực DTPT Techs</button></div><div><h3>Liên hệ</h3><a href={`tel:${settings.phone.replace(/\s/g, '')}`}><Phone />{settings.phone}</a><a href={`mailto:${settings.email}`}><Mail />{settings.email}</a><span><MapPin />{settings.address}</span></div></div><div className="container footer__bottom"><span>© 2026 DTPT Techs. All rights reserved.</span><span>{settings.slogan}</span></div></footer> }
