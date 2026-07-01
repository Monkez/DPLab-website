import { ArrowLeft, BarChart3, Bell, Boxes, ChevronDown, CircleDollarSign, ClipboardList, Edit3, Eye, LayoutDashboard, Menu, MoreHorizontal, Package, Plus, RefreshCcw, Search, Settings, ShoppingBag, Trash2, TrendingUp, Users, X } from 'lucide-react'
import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { Logo } from '../components/Logo'
import { ProductArt } from '../components/ProductArt'
import { api, type AdminSession } from '../services/api'
import { useStore } from '../store/StoreContext'
import type { AdminUser, OrderStatus, Product, ProductStatus, SiteContent, StoreSettings } from '../types'

type AdminTab = 'dashboard' | 'products' | 'orders' | 'accounts' | 'settings'
const money = (value: number) => new Intl.NumberFormat('vi-VN').format(value) + 'â‚«'
const orderLabels: Record<OrderStatus, string> = { new: 'ÄÆ¡n má»›i', confirmed: 'ÄÃ£ xÃ¡c nháº­n', shipping: 'Äang giao', completed: 'HoÃ n thÃ nh', cancelled: 'ÄÃ£ há»§y' }

export function AdminPage({ navigate }: { navigate: (path: string) => void }) {
  const { products, orders, settings, updateOrderStatus, saveProduct, deleteProduct, updateSettings, resetDemo } = useStore()
  const [session, setSession] = useState<AdminSession | null>(() => api.getAdminSession())
  const [tab, setTab] = useState<AdminTab>('dashboard')
  const [sidebar, setSidebar] = useState(false)
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState<Product | null | 'new'>(null)
  const visibleProducts = products.filter(product => `${product.name} ${product.id} ${product.brand}`.toLowerCase().includes(query.toLowerCase()))
  const revenue = orders.filter(o => o.status !== 'cancelled').reduce((sum, order) => sum + order.total, 0)
  const newOrders = orders.filter(order => order.status === 'new').length

  if (!session) return <AdminLogin navigate={navigate} onLogin={nextSession => { setSession(nextSession); window.location.reload() }} />

  const go = (next: AdminTab) => { setTab(next); setSidebar(false) }
  const logout = () => { api.logoutAdmin(); setSession(null); navigate('/') }
  return <div className="admin">
    <aside className={`admin-sidebar ${sidebar ? 'admin-sidebar--open' : ''}`}><div className="admin-sidebar__head"><Logo inverse variant={settings.logoStyle} name={settings.storeName} slogan={settings.slogan} roundSrc={settings.logoRoundSrc} wideSrc={settings.logoWideSrc} /><button className="admin-sidebar__close" onClick={() => setSidebar(false)}><X /></button></div><nav>
      <button className={tab === 'dashboard' ? 'active' : ''} onClick={() => go('dashboard')}><LayoutDashboard />Tá»•ng quan</button>
      <button className={tab === 'products' ? 'active' : ''} onClick={() => go('products')}><Boxes />Sáº£n pháº©m</button>
      <button className={tab === 'orders' ? 'active' : ''} onClick={() => go('orders')}><ClipboardList />ÄÆ¡n hÃ ng{newOrders > 0 && <span>{newOrders}</span>}</button>
      <button className={tab === 'accounts' ? 'active' : ''} onClick={() => go('accounts')}><Users />Tài khoản</button><button><BarChart3 />Báo cáo<small>Sớm</small></button>
      <p>HỆ THỐNG</p><button className={tab === 'settings' ? 'active' : ''} onClick={() => go('settings')}><Settings />Cài đặt</button>
    </nav><button className="admin-user admin-user--button" onClick={logout}><span>TĐ</span><div><strong>{session.user.displayName}</strong><small>Đăng xuất</small></div><MoreHorizontal /></button></aside>
    {sidebar && <button className="admin-mobile-backdrop" onClick={() => setSidebar(false)} aria-label="ÄÃ³ng menu" />}
    <div className="admin-main"><header className="admin-topbar"><button className="admin-menu" onClick={() => setSidebar(true)}><Menu /></button><label><Search /><input placeholder="Tìm kiếm nhanh..." /></label><div><button className="icon-button"><Bell />{newOrders > 0 && <span />}</button><button className="button button--light" onClick={() => navigate('/')}><Eye />Xem cửa hàng</button></div></header>
      <div className="admin-content">
        {tab === 'dashboard' && <DashboardTab products={products} orders={orders} revenue={revenue} newOrders={newOrders} displayName={session.user.displayName} onOrders={() => go('orders')} />}
        {tab === 'products' && <><PageTitle eyebrow="KHO HÃ€NG" title="Quáº£n lÃ½ sáº£n pháº©m" subtitle={`${products.length} sáº£n pháº©m trong danh má»¥c`}><button className="button button--primary" onClick={() => setEditing('new')}><Plus />ThÃªm sáº£n pháº©m</button></PageTitle><div className="admin-panel"><div className="table-tools"><label><Search /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="TÃ¬m tÃªn, mÃ£, thÆ°Æ¡ng hiá»‡u..." /></label><button><ChevronDown />Táº¥t cáº£ tráº¡ng thÃ¡i</button></div><div className="table-wrap"><table><thead><tr><th>Sáº£n pháº©m</th><th>PhÃ¢n loáº¡i</th><th>GiÃ¡ bÃ¡n</th><th>Tá»“n kho</th><th>Tráº¡ng thÃ¡i</th><th /></tr></thead><tbody>{visibleProducts.map(product => <tr key={product.id}><td><div className="table-product"><ProductArt product={product} /><span><strong>{product.name}</strong><small>{product.id} Â· {product.cpu}</small></span></div></td><td>{product.brand}<small className="cell-sub">{product.category}</small></td><td><strong>{money(product.price)}</strong></td><td>{product.stock} mÃ¡y</td><td><span className={`status-pill status-pill--${product.status}`}>{product.status === 'active' ? 'Äang bÃ¡n' : product.status === 'draft' ? 'Báº£n nhÃ¡p' : 'Háº¿t hÃ ng'}</span></td><td><div className="row-actions"><button onClick={() => setEditing(product)} aria-label={`Sá»­a ${product.name}`}><Edit3 /></button><button onClick={() => window.confirm(`XÃ³a ${product.name}?`) && deleteProduct(product.id)} aria-label={`XÃ³a ${product.name}`}><Trash2 /></button></div></td></tr>)}</tbody></table></div></div></>}
        {tab === 'orders' && <><PageTitle eyebrow="BÃN HÃ€NG" title="ÄÆ¡n hÃ ng" subtitle={`${newOrders} Ä‘Æ¡n má»›i Ä‘ang chá» xá»­ lÃ½`} /><div className="admin-panel"><div className="table-wrap"><table><thead><tr><th>MÃ£ Ä‘Æ¡n</th><th>KhÃ¡ch hÃ ng</th><th>Sáº£n pháº©m</th><th>Tá»•ng tiá»n</th><th>NgÃ y Ä‘áº·t</th><th>Tráº¡ng thÃ¡i</th></tr></thead><tbody>{orders.map(order => <tr key={order.id}><td><strong>#{order.id}</strong></td><td><strong>{order.customer.name}</strong><small className="cell-sub">{order.customer.phone}</small></td><td>{order.items.reduce((sum, item) => sum + item.quantity, 0)} sáº£n pháº©m<small className="cell-sub">{order.customer.address}</small></td><td><strong>{money(order.total)}</strong></td><td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td><td><select className={`order-select order-select--${order.status}`} value={order.status} onChange={event => updateOrderStatus(order.id, event.target.value as OrderStatus)}>{Object.entries(orderLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></td></tr>)}</tbody></table></div></div></>}
        {tab === 'accounts' && <AccountsTab currentUsername={session.user.username} />}
        {tab === 'settings' && <SettingsTab settings={settings} updateSettings={updateSettings} resetDemo={resetDemo} />}
      </div>
    </div>
    {editing && <ProductModal product={editing === 'new' ? null : editing} onClose={() => setEditing(null)} onSave={product => { saveProduct(product); setEditing(null) }} />}
  </div>
}

function AdminLogin({ navigate, onLogin }: { navigate: (path: string) => void; onLogin: (session: AdminSession) => void }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    const data = new FormData(event.currentTarget)
    const username = String(data.get('username') || '')
    const password = String(data.get('password') || '')
    try {
      if (!api.enabled) {
        if (username === 'delai' && password === '1711@pie') return onLogin({ token: 'local-demo', user: { username: 'delai', displayName: 'Tiến Đệ' } })
        throw new Error('Tên đăng nhập hoặc mật khẩu không đúng')
      }
      onLogin(await api.loginAdmin(username, password))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không đăng nhập được')
    } finally {
      setLoading(false)
    }
  }

  return <main className="admin-login">
    <form className="admin-login-card" onSubmit={submit}>
      <button type="button" className="admin-login-back" onClick={() => navigate('/')}>← Về cửa hàng</button>
      <div className="admin-login-brand"><span>DP</span><div><strong>DP Lab Admin</strong><small>Đăng nhập để quản lý website</small></div></div>
      <label>Tên đăng nhập<input name="username" autoComplete="username" defaultValue="delai" required /></label>
      <label>Mật khẩu<input name="password" type="password" autoComplete="current-password" required /></label>
      {error && <p className="admin-login-error">{error}</p>}
      <button className="button button--primary" disabled={loading}>{loading ? 'Đang đăng nhập...' : 'Đăng nhập'}</button>
    </form>
  </main>
}

function AccountsTab({ currentUsername }: { currentUsername: string }) {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const loadUsers = () => {
    setLoading(true)
    api.listAdminUsers()
      .then(setUsers)
      .catch(error => setMessage(error instanceof Error ? error.message : 'Không tải được tài khoản'))
      .finally(() => setLoading(false))
  }

  useEffect(loadUsers, [])

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    setMessage('')
    try {
      await api.createAdminUser({
        username: String(data.get('username') || ''),
        displayName: String(data.get('displayName') || ''),
        password: String(data.get('password') || ''),
      })
      form.reset()
      setMessage('Đã thêm/cập nhật tài khoản.')
      loadUsers()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không lưu được tài khoản')
    }
  }

  const remove = async (username: string) => {
    if (!window.confirm(`Xóa tài khoản ${username}?`)) return
    try {
      await api.deleteAdminUser(username)
      setMessage('Đã xóa tài khoản.')
      loadUsers()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không xóa được tài khoản')
    }
  }

  return <>
    <PageTitle eyebrow="BẢO MẬT" title="Tài khoản quản trị" subtitle="Thêm tài khoản cho người có quyền quản lý website DP Lab." />
    <div className="accounts-grid">
      <form className="admin-panel account-form" onSubmit={submit}>
        <h2>Thêm tài khoản</h2>
        <label>Tên hiển thị<input name="displayName" placeholder="Ví dụ: Tiến Đệ" required /></label>
        <label>Tên đăng nhập<input name="username" placeholder="vidu: tendangnhap" required /></label>
        <label>Mật khẩu<input name="password" type="password" minLength={6} required /></label>
        <button className="button button--primary">Lưu tài khoản</button>
        {message && <p>{message}</p>}
      </form>
      <section className="admin-panel accounts-list">
        <div className="panel-heading panel-heading--padded"><div><h2>Danh sách tài khoản</h2><p>{loading ? 'Đang tải...' : `${users.length} tài khoản quản trị`}</p></div></div>
        <div className="table-wrap"><table><thead><tr><th>Tên hiển thị</th><th>Tên đăng nhập</th><th>Ngày tạo</th><th /></tr></thead><tbody>{users.map(user => <tr key={user.username}><td><strong>{user.displayName}</strong>{user.username === currentUsername && <small className="cell-sub">Đang đăng nhập</small>}</td><td>{user.username}</td><td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '-'}</td><td><div className="row-actions"><button type="button" onClick={() => remove(user.username)} aria-label={`Xóa ${user.username}`}><Trash2 /></button></div></td></tr>)}</tbody></table></div>
      </section>
    </div>
  </>
}

function PageTitle({ eyebrow, title, subtitle, children }: { eyebrow: string; title: string; subtitle: string; children?: React.ReactNode }) {
  return <div className="admin-title"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{subtitle}</p></div>{children}</div>
}

function DashboardTab({ products, orders, revenue, newOrders, displayName, onOrders }: { products: Product[]; orders: ReturnType<typeof useStore>['orders']; revenue: number; newOrders: number; displayName: string; onOrders: () => void }) {
  const latest = orders.slice(0, 5)
  return <><PageTitle eyebrow="HÔM NAY" title={`Chào ${displayName}!`} subtitle="Đây là tình hình cửa hàng của bạn hôm nay." />
    <div className="metric-grid"><article><span className="metric-icon metric-icon--green"><CircleDollarSign /></span><small>Doanh thu ghi nháº­n</small><strong>{money(revenue)}</strong><p><TrendingUp />12,5% <span>so vá»›i ká»³ trÆ°á»›c</span></p></article><article><span className="metric-icon metric-icon--orange"><ShoppingBag /></span><small>ÄÆ¡n hÃ ng má»›i</small><strong>{newOrders}</strong><p><TrendingUp />2 Ä‘Æ¡n <span>cáº§n xÃ¡c nháº­n</span></p></article><article><span className="metric-icon metric-icon--blue"><Package /></span><small>Sáº£n pháº©m Ä‘ang bÃ¡n</small><strong>{products.filter(p => p.status === 'active').length}</strong><p>{products.reduce((sum, p) => sum + p.stock, 0)} <span>mÃ¡y trong kho</span></p></article><article><span className="metric-icon metric-icon--purple"><Users /></span><small>KhÃ¡ch hÃ ng</small><strong>{orders.length}</strong><p><TrendingUp />8,2% <span>tÄƒng trÆ°á»Ÿng</span></p></article></div>
    <div className="dashboard-grid"><section className="admin-panel chart-panel"><div className="panel-heading"><div><h2>Doanh thu</h2><p>Hiá»‡u quáº£ 7 ngÃ y gáº§n nháº¥t</p></div><button>7 ngÃ y <ChevronDown /></button></div><div className="fake-chart"><div className="chart-labels"><span>30tr</span><span>20tr</span><span>10tr</span><span>0</span></div><div className="chart-bars">{[42, 62, 48, 76, 58, 84, 70].map((height, index) => <div key={index}><span style={{ height: `${height}%` }} /><small>{['T2','T3','T4','T5','T6','T7','CN'][index]}</small></div>)}</div></div></section><section className="admin-panel inventory-panel"><div className="panel-heading"><div><h2>TÃ¬nh tráº¡ng kho</h2><p>Cáº­p nháº­t theo danh má»¥c</p></div></div>{['VÄƒn phÃ²ng','Má»ng nháº¹','Äá»“ há»a','Gaming'].map(category => { const stock = products.filter(p => p.category === category).reduce((sum, p) => sum + p.stock, 0); return <div className="stock-row" key={category}><span>{category}</span><div><i style={{ width: `${Math.min(stock * 5, 100)}%` }} /></div><strong>{stock}</strong></div> })}</section></div>
    <section className="admin-panel"><div className="panel-heading panel-heading--padded"><div><h2>ÄÆ¡n hÃ ng gáº§n Ä‘Ã¢y</h2><p>Cáº­p nháº­t ngay khi khÃ¡ch Ä‘áº·t hÃ ng</p></div><button className="text-button" onClick={onOrders}>Xem táº¥t cáº£ <ArrowLeft className="rotate-180" /></button></div><div className="table-wrap"><table><thead><tr><th>MÃ£ Ä‘Æ¡n</th><th>KhÃ¡ch hÃ ng</th><th>GiÃ¡ trá»‹</th><th>Tráº¡ng thÃ¡i</th><th>Thá»i gian</th></tr></thead><tbody>{latest.map(order => <tr key={order.id}><td><strong>#{order.id}</strong></td><td>{order.customer.name}<small className="cell-sub">{order.customer.phone}</small></td><td><strong>{money(order.total)}</strong></td><td><span className={`order-badge order-badge--${order.status}`}>{orderLabels[order.status]}</span></td><td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td></tr>)}</tbody></table></div></section>
  </>
}

function ProductModal({ product, onClose, onSave }: { product: Product | null; onClose: () => void; onSave: (product: Product) => void }) {
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const data = new FormData(event.currentTarget); onSave({ id: String(data.get('id')), name: String(data.get('name')), brand: String(data.get('brand')), category: String(data.get('category')) as Product['category'], cpu: String(data.get('cpu')), ram: String(data.get('ram')), storage: String(data.get('storage')), display: String(data.get('display')), gpu: String(data.get('gpu')), price: Number(data.get('price')), originalPrice: Number(data.get('originalPrice')) || undefined, stock: Number(data.get('stock')), status: String(data.get('status')) as ProductStatus, badge: String(data.get('badge')) || undefined, accent: product?.accent ?? '#7c98a8' }) }
  // The default ID is generated only while the add-product modal is mounted.
  // eslint-disable-next-line react-hooks/purity
  return <div className="modal-shell"><button className="modal-backdrop" onClick={onClose} aria-label="ÄÃ³ng" /><form className="product-modal" onSubmit={submit}><div className="modal-title"><div><p className="eyebrow">Sáº¢N PHáº¨M</p><h2>{product ? 'Chá»‰nh sá»­a sáº£n pháº©m' : 'ThÃªm sáº£n pháº©m má»›i'}</h2></div><button type="button" className="icon-button" onClick={onClose}><X /></button></div><div className="form-grid"><label>MÃ£ sáº£n pháº©m<input name="id" required defaultValue={product?.id ?? `DP-${Date.now().toString().slice(-5)}`} readOnly={!!product} /></label><label>TÃªn sáº£n pháº©m<input name="name" required defaultValue={product?.name} /></label><label>ThÆ°Æ¡ng hiá»‡u<input name="brand" required defaultValue={product?.brand} /></label><label>PhÃ¢n loáº¡i<select name="category" defaultValue={product?.category ?? 'VÄƒn phÃ²ng'}><option>VÄƒn phÃ²ng</option><option>Má»ng nháº¹</option><option>Äá»“ há»a</option><option>Gaming</option></select></label><label>CPU<input name="cpu" required defaultValue={product?.cpu} /></label><label>RAM<input name="ram" required defaultValue={product?.ram} /></label><label>á»” cá»©ng<input name="storage" required defaultValue={product?.storage} /></label><label>MÃ n hÃ¬nh<input name="display" required defaultValue={product?.display} /></label><label>GPU<input name="gpu" required defaultValue={product?.gpu} /></label><label>NhÃ£n ná»•i báº­t<input name="badge" defaultValue={product?.badge} placeholder="BÃ¡n cháº¡y" /></label><label>GiÃ¡ bÃ¡n<input name="price" type="number" min="0" required defaultValue={product?.price} /></label><label>GiÃ¡ niÃªm yáº¿t<input name="originalPrice" type="number" min="0" defaultValue={product?.originalPrice} /></label><label>Tá»“n kho<input name="stock" type="number" min="0" required defaultValue={product?.stock ?? 1} /></label><label>Tráº¡ng thÃ¡i<select name="status" defaultValue={product?.status ?? 'active'}><option value="active">Äang bÃ¡n</option><option value="draft">Báº£n nhÃ¡p</option><option value="out-of-stock">Háº¿t hÃ ng</option></select></label></div><div className="modal-actions"><button type="button" className="button button--light" onClick={onClose}>Há»§y</button><button className="button button--primary">LÆ°u sáº£n pháº©m</button></div></form></div>
}

const readLogoFile = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => resolve(String(reader.result))
  reader.onerror = reject
  reader.readAsDataURL(file)
})

function SettingsTab({ settings, updateSettings, resetDemo }: { settings: StoreSettings; updateSettings: (value: StoreSettings) => void; resetDemo: () => void }) {
  const [saved, setSaved] = useState(false)
  const [previewLogo, setPreviewLogo] = useState(settings.logoStyle)
  const [logoRoundSrc, setLogoRoundSrc] = useState(settings.logoRoundSrc)
  const [logoWideSrc, setLogoWideSrc] = useState(settings.logoWideSrc)

  const uploadLogo = async (event: ChangeEvent<HTMLInputElement>, target: 'round' | 'wide') => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      window.alert('Vui lÃ²ng chá»n file áº£nh logo.')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      window.alert('Logo nÃªn dÆ°á»›i 2MB Ä‘á»ƒ website táº£i nhanh vÃ  lÆ°u á»•n Ä‘á»‹nh.')
      event.target.value = ''
      return
    }
    const src = await readLogoFile(file)
    if (target === 'round') { setLogoRoundSrc(src); setPreviewLogo('round') }
    else { setLogoWideSrc(src); setPreviewLogo('wide') }
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const content = { ...settings.content }
    ;(Object.keys(content) as Array<keyof SiteContent>).forEach(key => { content[key] = String(data.get(key) ?? '') })
    updateSettings({
      storeName: String(data.get('storeName')), slogan: String(data.get('slogan')),
      logoStyle: String(data.get('logoStyle')) as StoreSettings['logoStyle'],
      logoRoundSrc, logoWideSrc,
      phone: String(data.get('phone')), address: String(data.get('address')),
      email: String(data.get('email')), facebook: String(data.get('facebook')), content,
    })
    setSaved(true)
    window.setTimeout(() => setSaved(false), 1800)
  }

  return <>
    <PageTitle eyebrow="GIAO DIá»†N WEBSITE" title="Ná»™i dung & nháº­n diá»‡n" subtitle="Chá»‰nh logo vÃ  toÃ n bá»™ ná»™i dung chÃ­nh Ä‘ang hiá»ƒn thá»‹ ngoÃ i cá»­a hÃ ng." />
    <form className="settings-form settings-form--cms" onSubmit={submit}>
      <section className="admin-panel settings-card">
        <div className="settings-card__heading"><span>01</span><div><h2>Logo vÃ  thÆ°Æ¡ng hiá»‡u</h2><p>Chá»n máº«u logo sá»­ dá»¥ng xuyÃªn suá»‘t website vÃ  trang quáº£n trá»‹.</p></div></div>
        <div className="settings-card__body">
          <div className="logo-manager">
            <div className="logo-manager__preview">
              <span>Xem trÆ°á»›c logo Ä‘ang dÃ¹ng</span>
              <Logo variant={previewLogo} name={settings.storeName} slogan={settings.slogan} roundSrc={logoRoundSrc} wideSrc={logoWideSrc} />
            </div>
            <div className="logo-manager__controls">
              <div className="logo-style-toggle" role="radiogroup" aria-label="Chá»n kiá»ƒu logo hiá»ƒn thá»‹">
                <label className={previewLogo === 'round' ? 'active' : ''}><input type="radio" name="logoStyle" value="round" checked={previewLogo === 'round'} onChange={() => setPreviewLogo('round')} /> DÃ¹ng logo trÃ²n</label>
                <label className={previewLogo === 'wide' ? 'active' : ''}><input type="radio" name="logoStyle" value="wide" checked={previewLogo === 'wide'} onChange={() => setPreviewLogo('wide')} /> DÃ¹ng logo dÃ i</label>
              </div>
              <div className="logo-upload-row">
                <div><strong>Logo trÃ²n</strong><small>NÃªn dÃ¹ng áº£nh vuÃ´ng PNG/WebP.</small></div>
                <span className="logo-upload-button">Chá»n áº£nh<input className="logo-file-input" type="file" accept="image/*" onChange={event => uploadLogo(event, 'round')} /></span>
                <button type="button" onClick={() => setLogoRoundSrc('/dp-lab-logo.png')}>Máº·c Ä‘á»‹nh</button>
              </div>
              <div className="logo-upload-row">
                <div><strong>Logo dÃ i</strong><small>NÃªn dÃ¹ng áº£nh ngang, ná»n trong suá»‘t hoáº·c tráº¯ng.</small></div>
                <span className="logo-upload-button">Chá»n áº£nh<input className="logo-file-input" type="file" accept="image/*" onChange={event => uploadLogo(event, 'wide')} /></span>
                <button type="button" onClick={() => setLogoWideSrc('/dtpt-techs-logo.png')}>Máº·c Ä‘á»‹nh</button>
              </div>
            </div>
          </div>
          <div className="form-grid settings-fields"><label>TÃªn cá»­a hÃ ng<input name="storeName" defaultValue={settings.storeName} /></label><label>Kháº©u hiá»‡u<input name="slogan" defaultValue={settings.slogan} /></label><label>Sá»‘ Ä‘iá»‡n thoáº¡i<input name="phone" defaultValue={settings.phone} /></label><label>Email<input name="email" defaultValue={settings.email} /></label><label className="form-span">Äá»‹a chá»‰<textarea name="address" rows={3} defaultValue={settings.address} /></label><label className="form-span">Facebook<input name="facebook" defaultValue={settings.facebook} /></label></div>
        </div>
      </section>

      <ContentSection number="02" title="Thanh Ä‘áº§u trang & menu" description="Hai dÃ²ng thÃ´ng bÃ¡o trÃªn cÃ¹ng vÃ  tÃªn cÃ¡c má»¥c Ä‘iá»u hÆ°á»›ng.">
        <ContentInput name="announcementPrimary" label="ThÃ´ng bÃ¡o bÃªn trÃ¡i" value={settings.content.announcementPrimary} />
        <ContentInput name="announcementSecondary" label="ThÃ´ng bÃ¡o bÃªn pháº£i" value={settings.content.announcementSecondary} />
        <ContentInput name="navProducts" label="Menu sáº£n pháº©m" value={settings.content.navProducts} />
        <ContentInput name="navWhy" label="Menu giá»›i thiá»‡u" value={settings.content.navWhy} />
        <ContentInput name="navContact" label="Menu liÃªn há»‡" value={settings.content.navContact} />
      </ContentSection>

      <ContentSection number="03" title="Banner chÃ­nh" description="ThÃ´ng Ä‘iá»‡p Ä‘áº§u tiÃªn khÃ¡ch hÃ ng nhÃ¬n tháº¥y khi má»Ÿ website.">
        <ContentInput name="heroBadge" label="NhÃ£n nhá»" value={settings.content.heroBadge} />
        <ContentInput name="heroPrimaryAction" label="NÃºt hÃ nh Ä‘á»™ng" value={settings.content.heroPrimaryAction} />
        <ContentInput name="heroTitle" label="TiÃªu Ä‘á» chÃ­nh" value={settings.content.heroTitle} />
        <ContentInput name="heroHighlight" label="DÃ²ng tiÃªu Ä‘á» ná»•i báº­t" value={settings.content.heroHighlight} />
        <ContentInput name="heroDescription" label="Äoáº¡n giá»›i thiá»‡u" value={settings.content.heroDescription} multiline wide />
        <ContentInput name="trustQuality" label="Cam káº¿t 1" value={settings.content.trustQuality} />
        <ContentInput name="trustWarranty" label="Cam káº¿t 2" value={settings.content.trustWarranty} />
        <ContentInput name="trustDelivery" label="Cam káº¿t 3" value={settings.content.trustDelivery} />
      </ContentSection>

      <ContentSection number="04" title="Dáº£i dá»‹ch vá»¥" description="Bá»‘n lá»£i Ã­ch náº±m ngay dÆ°á»›i banner chÃ­nh.">
        <ContentInput name="service1Title" label="Dá»‹ch vá»¥ 1 â€” tiÃªu Ä‘á»" value={settings.content.service1Title} /><ContentInput name="service1Description" label="Dá»‹ch vá»¥ 1 â€” mÃ´ táº£" value={settings.content.service1Description} />
        <ContentInput name="service2Title" label="Dá»‹ch vá»¥ 2 â€” tiÃªu Ä‘á»" value={settings.content.service2Title} /><ContentInput name="service2Description" label="Dá»‹ch vá»¥ 2 â€” mÃ´ táº£" value={settings.content.service2Description} />
        <ContentInput name="service3Title" label="Dá»‹ch vá»¥ 3 â€” tiÃªu Ä‘á»" value={settings.content.service3Title} /><ContentInput name="service3Description" label="Dá»‹ch vá»¥ 3 â€” mÃ´ táº£" value={settings.content.service3Description} />
        <ContentInput name="service4Title" label="Dá»‹ch vá»¥ 4 â€” tiÃªu Ä‘á»" value={settings.content.service4Title} /><ContentInput name="service4Description" label="Dá»‹ch vá»¥ 4 â€” mÃ´ táº£" value={settings.content.service4Description} />
      </ContentSection>

      <ContentSection number="05" title="Khu vá»±c sáº£n pháº©m" description="TiÃªu Ä‘á» vÃ  lá»i dáº«n phÃ­a trÃªn danh sÃ¡ch laptop.">
        <ContentInput name="productsEyebrow" label="NhÃ£n má»¥c" value={settings.content.productsEyebrow} />
        <ContentInput name="productsTitle" label="TiÃªu Ä‘á»" value={settings.content.productsTitle} />
        <ContentInput name="productsDescription" label="MÃ´ táº£" value={settings.content.productsDescription} multiline wide />
      </ContentSection>

      <ContentSection number="06" title="VÃ¬ sao chá»n DP Lab" description="ThÃ´ng Ä‘iá»‡p thÆ°Æ¡ng hiá»‡u vÃ  bá»‘n Ä‘iá»ƒm thuyáº¿t phá»¥c khÃ¡ch hÃ ng.">
        <ContentInput name="whyEyebrow" label="NhÃ£n má»¥c" value={settings.content.whyEyebrow} /><ContentInput name="whyTitle" label="TiÃªu Ä‘á»" value={settings.content.whyTitle} />
        <ContentInput name="whyDescription" label="Äoáº¡n giá»›i thiá»‡u" value={settings.content.whyDescription} multiline wide />
        <ContentInput name="why1Title" label="LÃ½ do 1 â€” tiÃªu Ä‘á»" value={settings.content.why1Title} /><ContentInput name="why1Description" label="LÃ½ do 1 â€” mÃ´ táº£" value={settings.content.why1Description} multiline />
        <ContentInput name="why2Title" label="LÃ½ do 2 â€” tiÃªu Ä‘á»" value={settings.content.why2Title} /><ContentInput name="why2Description" label="LÃ½ do 2 â€” mÃ´ táº£" value={settings.content.why2Description} multiline />
        <ContentInput name="why3Title" label="LÃ½ do 3 â€” tiÃªu Ä‘á»" value={settings.content.why3Title} /><ContentInput name="why3Description" label="LÃ½ do 3 â€” mÃ´ táº£" value={settings.content.why3Description} multiline />
        <ContentInput name="why4Title" label="LÃ½ do 4 â€” tiÃªu Ä‘á»" value={settings.content.why4Title} /><ContentInput name="why4Description" label="LÃ½ do 4 â€” mÃ´ táº£" value={settings.content.why4Description} multiline />
      </ContentSection>

      <ContentSection number="07" title="KÃªu gá»i liÃªn há»‡ & footer" description="Khá»‘i gá»i Ä‘iá»‡n cuá»‘i trang vÃ  lá»i giá»›i thiá»‡u trong footer.">
        <ContentInput name="contactEyebrow" label="NhÃ£n liÃªn há»‡" value={settings.content.contactEyebrow} />
        <ContentInput name="contactTitle" label="TiÃªu Ä‘á» liÃªn há»‡" value={settings.content.contactTitle} />
        <ContentInput name="contactSubtitle" label="DÃ²ng phá»¥ liÃªn há»‡" value={settings.content.contactSubtitle} />
        <ContentInput name="footerDescription" label="Giá»›i thiá»‡u á»Ÿ footer" value={settings.content.footerDescription} multiline wide />
      </ContentSection>

      <div className="settings-actions settings-actions--sticky"><button type="button" className="button button--light" onClick={() => window.confirm('KhÃ´i phá»¥c toÃ n bá»™ dá»¯ liá»‡u demo ban Ä‘áº§u?') && resetDemo()}><RefreshCcw />KhÃ´i phá»¥c máº·c Ä‘á»‹nh</button><div><span>Má»i thay Ä‘á»•i sáº½ Ã¡p dá»¥ng ngay ngoÃ i website.</span><button className={`button button--primary ${saved ? 'button--success' : ''}`}>{saved ? 'ÄÃ£ lÆ°u thay Ä‘á»•i' : 'LÆ°u toÃ n bá»™ thay Ä‘á»•i'}</button></div></div>
    </form>
  </>
}

function ContentSection({ number, title, description, children }: { number: string; title: string; description: string; children: React.ReactNode }) {
  return <section className="admin-panel settings-card"><div className="settings-card__heading"><span>{number}</span><div><h2>{title}</h2><p>{description}</p></div></div><div className="settings-card__body settings-content-grid">{children}</div></section>
}

function ContentInput({ name, label, value, multiline = false, wide = false }: { name: keyof SiteContent; label: string; value: string; multiline?: boolean; wide?: boolean }) {
  return <label className={wide ? 'form-span' : ''}>{label}{multiline ? <textarea name={name} rows={3} defaultValue={value} /> : <input name={name} defaultValue={value} />}</label>
}
