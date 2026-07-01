import {
  ArrowLeft,
  BarChart3,
  Bell,
  Boxes,
  ChevronDown,
  CircleDollarSign,
  ClipboardList,
  Edit3,
  Eye,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  Package,
  Plus,
  RefreshCcw,
  Search,
  Settings,
  ShoppingBag,
  Trash2,
  TrendingUp,
  Users,
  X,
} from 'lucide-react'
import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { Logo } from '../components/Logo'
import { ProductArt } from '../components/ProductArt'
import { api, type AdminSession } from '../services/api'
import { useStore } from '../store/StoreContext'
import type { AdminUser, OrderStatus, Product, ProductCondition, ProductStatus, SiteContent, StoreSettings } from '../types'

type AdminTab = 'dashboard' | 'products' | 'orders' | 'accounts' | 'settings'

const money = (value: number) => `${new Intl.NumberFormat('vi-VN').format(value)}â‚«`
const orderLabels: Record<OrderStatus, string> = {
  new: 'ÄÆ¡n má»›i',
  confirmed: 'ÄÃ£ xÃ¡c nháº­n',
  shipping: 'Äang giao',
  completed: 'HoÃ n thÃ nh',
  cancelled: 'ÄÃ£ há»§y',
}

const productStatusLabels: Record<ProductStatus, string> = {
  active: 'Äang bÃ¡n',
  draft: 'Báº£n nhÃ¡p',
  'out-of-stock': 'Háº¿t hÃ ng',
}

const productCategories: Product['category'][] = ['Văn phòng', 'Mỏng nhẹ', 'Đồ họa', 'Gaming']
const productConditions: ProductCondition[] = ['Mới', 'Like new', 'Đã qua sử dụng']

export function AdminPage({ navigate }: { navigate: (path: string) => void }) {
  const { products, orders, settings, updateOrderStatus, saveProduct, deleteProduct, updateSettings, resetDemo } = useStore()
  const [session, setSession] = useState<AdminSession | null>(() => api.getAdminSession())
  const [tab, setTab] = useState<AdminTab>('dashboard')
  const [sidebar, setSidebar] = useState(false)
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState<Product | null | 'new'>(null)

  const visibleProducts = products.filter(product => `${product.name} ${product.id} ${product.brand}`.toLowerCase().includes(query.toLowerCase()))
  const revenue = orders.filter(order => order.status !== 'cancelled').reduce((sum, order) => sum + order.total, 0)
  const newOrders = orders.filter(order => order.status === 'new').length

  if (!session) {
    return <AdminLogin navigate={navigate} onLogin={nextSession => { setSession(nextSession); if (api.enabled) window.location.reload() }} />
  }

  const go = (next: AdminTab) => { setTab(next); setSidebar(false) }
  const logout = () => { api.logoutAdmin(); setSession(null); navigate('/') }

  return <div className="admin">
    <aside className={`admin-sidebar ${sidebar ? 'admin-sidebar--open' : ''}`}>
      <div className="admin-sidebar__head">
        <Logo inverse variant={settings.logoStyle} name={settings.storeName} slogan={settings.slogan} roundSrc={settings.logoRoundSrc} wideSrc={settings.logoWideSrc} />
        <button className="admin-sidebar__close" onClick={() => setSidebar(false)} aria-label="ÄÃ³ng menu"><X /></button>
      </div>
      <nav>
        <button className={tab === 'dashboard' ? 'active' : ''} onClick={() => go('dashboard')}><LayoutDashboard />Tá»•ng quan</button>
        <button className={tab === 'products' ? 'active' : ''} onClick={() => go('products')}><Boxes />Sáº£n pháº©m</button>
        <button className={tab === 'orders' ? 'active' : ''} onClick={() => go('orders')}><ClipboardList />ÄÆ¡n hÃ ng{newOrders > 0 && <span>{newOrders}</span>}</button>
        <button className={tab === 'accounts' ? 'active' : ''} onClick={() => go('accounts')}><Users />TÃ i khoáº£n</button>
        <button><BarChart3 />BÃ¡o cÃ¡o<small>Sá»›m</small></button>
        <p>Há»† THá»NG</p>
        <button className={tab === 'settings' ? 'active' : ''} onClick={() => go('settings')}><Settings />CÃ i Ä‘áº·t</button>
      </nav>
      <button className="admin-user admin-user--button" onClick={logout}>
        <span>TÄ</span>
        <div><strong>{session.user.displayName}</strong><small>ÄÄƒng xuáº¥t</small></div>
        <MoreHorizontal />
      </button>
    </aside>

    {sidebar && <button className="admin-mobile-backdrop" onClick={() => setSidebar(false)} aria-label="ÄÃ³ng menu" />}

    <div className="admin-main">
      <header className="admin-topbar">
        <button className="admin-menu" onClick={() => setSidebar(true)} aria-label="Má»Ÿ menu"><Menu /></button>
        <label><Search /><input placeholder="TÃ¬m kiáº¿m nhanh..." /></label>
        <div>
          <button className="icon-button" aria-label="ThÃ´ng bÃ¡o"><Bell />{newOrders > 0 && <span />}</button>
          <button className="button button--light" onClick={() => navigate('/')}><Eye />Xem cá»­a hÃ ng</button>
        </div>
      </header>

      <div className="admin-content">
        {tab === 'dashboard' && <DashboardTab products={products} orders={orders} revenue={revenue} newOrders={newOrders} displayName={session.user.displayName} onOrders={() => go('orders')} />}
        {tab === 'products' && <ProductsTab products={visibleProducts} total={products.length} query={query} setQuery={setQuery} onAdd={() => setEditing('new')} onEdit={setEditing} onDelete={deleteProduct} />}
        {tab === 'orders' && <OrdersTab orders={orders} newOrders={newOrders} updateOrderStatus={updateOrderStatus} />}
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
        if (username === 'delai' && password === '1711@pie') {
          const session = { token: 'local-demo', user: { username: 'delai', displayName: 'Tiáº¿n Äá»‡' } }
          api.saveAdminSession(session)
          return onLogin(session)
        }
        throw new Error('TÃªn Ä‘Äƒng nháº­p hoáº·c máº­t kháº©u khÃ´ng Ä‘Ãºng')
      }
      onLogin(await api.loginAdmin(username, password))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'KhÃ´ng Ä‘Äƒng nháº­p Ä‘Æ°á»£c')
    } finally {
      setLoading(false)
    }
  }

  return <main className="admin-login">
    <form className="admin-login-card" onSubmit={submit}>
      <button type="button" className="admin-login-back" onClick={() => navigate('/')}>â† Vá» cá»­a hÃ ng</button>
      <div className="admin-login-brand"><span>DP</span><div><strong>DP Lab Admin</strong><small>ÄÄƒng nháº­p Ä‘á»ƒ quáº£n lÃ½ website</small></div></div>
      <label>TÃªn Ä‘Äƒng nháº­p<input name="username" autoComplete="username" required /></label>
      <label>Máº­t kháº©u<input name="password" type="password" autoComplete="current-password" required /></label>
      {error && <p className="admin-login-error">{error}</p>}
      <button className="button button--primary" disabled={loading}>{loading ? 'Äang Ä‘Äƒng nháº­p...' : 'ÄÄƒng nháº­p'}</button>
    </form>
  </main>
}

function PageTitle({ eyebrow, title, subtitle, children }: { eyebrow: string; title: string; subtitle: string; children?: React.ReactNode }) {
  return <div className="admin-title"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{subtitle}</p></div>{children}</div>
}

function DashboardTab({ products, orders, revenue, newOrders, displayName, onOrders }: { products: Product[]; orders: ReturnType<typeof useStore>['orders']; revenue: number; newOrders: number; displayName: string; onOrders: () => void }) {
  const latest = orders.slice(0, 5)
  return <>
    <PageTitle eyebrow="HÃ”M NAY" title={`ChÃ o ${displayName}!`} subtitle="ÄÃ¢y lÃ  tÃ¬nh hÃ¬nh cá»­a hÃ ng cá»§a báº¡n hÃ´m nay." />
    <div className="metric-grid">
      <Metric icon={<CircleDollarSign />} tone="green" label="Doanh thu ghi nháº­n" value={money(revenue)} note="12,5% so vá»›i ká»³ trÆ°á»›c" />
      <Metric icon={<ShoppingBag />} tone="orange" label="ÄÆ¡n hÃ ng má»›i" value={newOrders} note="Cáº§n xÃ¡c nháº­n trong ngÃ y" />
      <Metric icon={<Package />} tone="blue" label="Sáº£n pháº©m Ä‘ang bÃ¡n" value={products.filter(product => product.status === 'active').length} note={`${products.reduce((sum, product) => sum + product.stock, 0)} mÃ¡y trong kho`} />
      <Metric icon={<Users />} tone="purple" label="KhÃ¡ch hÃ ng" value={orders.length} note="TÄƒng trÆ°á»Ÿng tá»« Ä‘Æ¡n hÃ ng" />
    </div>
    <div className="dashboard-grid">
      <section className="admin-panel chart-panel">
        <div className="panel-heading"><div><h2>Doanh thu</h2><p>Hiá»‡u quáº£ 7 ngÃ y gáº§n nháº¥t</p></div><button>7 ngÃ y <ChevronDown /></button></div>
        <div className="fake-chart"><div className="chart-labels"><span>30tr</span><span>20tr</span><span>10tr</span><span>0</span></div><div className="chart-bars">{[42, 62, 48, 76, 58, 84, 70].map((height, index) => <div key={index}><span style={{ height: `${height}%` }} /><small>{['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'][index]}</small></div>)}</div></div>
      </section>
      <section className="admin-panel inventory-panel">
        <div className="panel-heading"><div><h2>TÃ¬nh tráº¡ng kho</h2><p>Cáº­p nháº­t theo danh má»¥c</p></div></div>
        {productCategories.map(category => {
          const stock = products.filter(product => product.category === category).reduce((sum, product) => sum + product.stock, 0)
          return <div className="stock-row" key={category}><span>{category}</span><div><i style={{ width: `${Math.min(stock * 5, 100)}%` }} /></div><strong>{stock}</strong></div>
        })}
      </section>
    </div>
    <section className="admin-panel">
      <div className="panel-heading panel-heading--padded"><div><h2>ÄÆ¡n hÃ ng gáº§n Ä‘Ã¢y</h2><p>Cáº­p nháº­t ngay khi khÃ¡ch Ä‘áº·t hÃ ng</p></div><button className="text-button" onClick={onOrders}>Xem táº¥t cáº£ <ArrowLeft className="rotate-180" /></button></div>
      <div className="table-wrap"><table><thead><tr><th>MÃ£ Ä‘Æ¡n</th><th>KhÃ¡ch hÃ ng</th><th>GiÃ¡ trá»‹</th><th>Tráº¡ng thÃ¡i</th><th>Thá»i gian</th></tr></thead><tbody>{latest.map(order => <tr key={order.id}><td><strong>#{order.id}</strong></td><td>{order.customer.name}<small className="cell-sub">{order.customer.phone}</small></td><td><strong>{money(order.total)}</strong></td><td><span className={`order-badge order-badge--${order.status}`}>{orderLabels[order.status]}</span></td><td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td></tr>)}</tbody></table></div>
    </section>
  </>
}

function Metric({ icon, tone, label, value, note }: { icon: React.ReactNode; tone: 'green' | 'orange' | 'blue' | 'purple'; label: string; value: string | number; note: string }) {
  return <article><span className={`metric-icon metric-icon--${tone}`}>{icon}</span><small>{label}</small><strong>{value}</strong><p><TrendingUp />{note}</p></article>
}

function ProductsTab({ products, total, query, setQuery, onAdd, onEdit, onDelete }: { products: Product[]; total: number; query: string; setQuery: (value: string) => void; onAdd: () => void; onEdit: (product: Product) => void; onDelete: (id: string) => void }) {
  return <>
    <PageTitle eyebrow="KHO HÃ€NG" title="Quáº£n lÃ½ sáº£n pháº©m" subtitle={`${total} sáº£n pháº©m trong danh má»¥c`}><button className="button button--primary" onClick={onAdd}><Plus />ThÃªm sáº£n pháº©m</button></PageTitle>
    <div className="admin-panel">
      <div className="table-tools"><label><Search /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="TÃ¬m tÃªn, mÃ£, thÆ°Æ¡ng hiá»‡u..." /></label><button><ChevronDown />Táº¥t cáº£ tráº¡ng thÃ¡i</button></div>
      <div className="table-wrap"><table><thead><tr><th>Sáº£n pháº©m</th><th>PhÃ¢n loáº¡i</th><th>GiÃ¡ bÃ¡n</th><th>Tá»“n kho</th><th>Tráº¡ng thÃ¡i</th><th /></tr></thead><tbody>{products.map(product => <tr key={product.id}><td><div className="table-product"><ProductArt product={product} /><span><strong>{product.name}</strong><small>{product.id} Â· {product.cpu}</small></span></div></td><td>{product.brand}<small className="cell-sub">{product.line ? `${product.line} Â· ${product.category}` : product.category}</small></td><td><strong>{money(product.price)}</strong></td><td>{product.stock} mÃ¡y</td><td><span className={`status-pill status-pill--${product.status}`}>{productStatusLabels[product.status]}</span></td><td><div className="row-actions"><button onClick={() => onEdit(product)} aria-label={`Sá»­a ${product.name}`}><Edit3 /></button><button onClick={() => window.confirm(`XÃ³a ${product.name}?`) && onDelete(product.id)} aria-label={`XÃ³a ${product.name}`}><Trash2 /></button></div></td></tr>)}</tbody></table></div>
    </div>
  </>
}

function OrdersTab({ orders, newOrders, updateOrderStatus }: { orders: ReturnType<typeof useStore>['orders']; newOrders: number; updateOrderStatus: (id: string, status: OrderStatus) => void }) {
  return <>
    <PageTitle eyebrow="BÃN HÃ€NG" title="ÄÆ¡n hÃ ng" subtitle={`${newOrders} Ä‘Æ¡n má»›i Ä‘ang chá» xá»­ lÃ½`} />
    <div className="admin-panel"><div className="table-wrap"><table><thead><tr><th>MÃ£ Ä‘Æ¡n</th><th>KhÃ¡ch hÃ ng</th><th>Sáº£n pháº©m</th><th>Tá»•ng tiá»n</th><th>NgÃ y Ä‘áº·t</th><th>Tráº¡ng thÃ¡i</th></tr></thead><tbody>{orders.map(order => <tr key={order.id}><td><strong>#{order.id}</strong></td><td><strong>{order.customer.name}</strong><small className="cell-sub">{order.customer.phone}</small></td><td>{order.items.reduce((sum, item) => sum + item.quantity, 0)} sáº£n pháº©m<small className="cell-sub">{order.customer.address}</small></td><td><strong>{money(order.total)}</strong></td><td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td><td><select className={`order-select order-select--${order.status}`} value={order.status} onChange={event => updateOrderStatus(order.id, event.target.value as OrderStatus)}>{Object.entries(orderLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></td></tr>)}</tbody></table></div></div>
  </>
}

function AccountsTab({ currentUsername }: { currentUsername: string }) {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const loadUsers = () => {
    setLoading(true)
    api.listAdminUsers()
      .then(setUsers)
      .catch(error => setMessage(error instanceof Error ? error.message : 'KhÃ´ng táº£i Ä‘Æ°á»£c tÃ i khoáº£n'))
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
      setMessage('ÄÃ£ thÃªm/cáº­p nháº­t tÃ i khoáº£n.')
      loadUsers()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'KhÃ´ng lÆ°u Ä‘Æ°á»£c tÃ i khoáº£n')
    }
  }

  const remove = async (username: string) => {
    if (!window.confirm(`XÃ³a tÃ i khoáº£n ${username}?`)) return
    try {
      await api.deleteAdminUser(username)
      setMessage('ÄÃ£ xÃ³a tÃ i khoáº£n.')
      loadUsers()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'KhÃ´ng xÃ³a Ä‘Æ°á»£c tÃ i khoáº£n')
    }
  }

  return <>
    <PageTitle eyebrow="Báº¢O Máº¬T" title="TÃ i khoáº£n quáº£n trá»‹" subtitle="ThÃªm tÃ i khoáº£n cho ngÆ°á»i cÃ³ quyá»n quáº£n lÃ½ website DP Lab." />
    <div className="accounts-grid">
      <form className="admin-panel account-form" onSubmit={submit}>
        <h2>ThÃªm tÃ i khoáº£n</h2>
        <label>TÃªn hiá»ƒn thá»‹<input name="displayName" placeholder="VÃ­ dá»¥: Tiáº¿n Äá»‡" required /></label>
        <label>TÃªn Ä‘Äƒng nháº­p<input name="username" placeholder="VÃ­ dá»¥: tendangnhap" required /></label>
        <label>Máº­t kháº©u<input name="password" type="password" minLength={6} required /></label>
        <button className="button button--primary">LÆ°u tÃ i khoáº£n</button>
        {message && <p>{message}</p>}
      </form>
      <section className="admin-panel accounts-list">
        <div className="panel-heading panel-heading--padded"><div><h2>Danh sÃ¡ch tÃ i khoáº£n</h2><p>{loading ? 'Äang táº£i...' : `${users.length} tÃ i khoáº£n quáº£n trá»‹`}</p></div></div>
        <div className="table-wrap"><table><thead><tr><th>TÃªn hiá»ƒn thá»‹</th><th>TÃªn Ä‘Äƒng nháº­p</th><th>NgÃ y táº¡o</th><th /></tr></thead><tbody>{users.map(user => <tr key={user.username}><td><strong>{user.displayName}</strong>{user.username === currentUsername && <small className="cell-sub">Äang Ä‘Äƒng nháº­p</small>}</td><td>{user.username}</td><td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '-'}</td><td><div className="row-actions"><button type="button" onClick={() => remove(user.username)} aria-label={`XÃ³a ${user.username}`}><Trash2 /></button></div></td></tr>)}</tbody></table></div>
      </section>
    </div>
  </>
}

function ProductModal({ product, onClose, onSave }: { product: Product | null; onClose: () => void; onSave: (product: Product) => void }) {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    onSave({
      id: String(data.get('id')),
      name: String(data.get('name')),
      brand: String(data.get('brand')),
      line: String(data.get('line')) || undefined,
      category: String(data.get('category')) as Product['category'],
      cpu: String(data.get('cpu')),
      ram: String(data.get('ram')),
      storage: String(data.get('storage')),
      display: String(data.get('display')),
      gpu: String(data.get('gpu')),
      price: Number(data.get('price')),
      originalPrice: Number(data.get('originalPrice')) || undefined,
      stock: Number(data.get('stock')),
      status: String(data.get('status')) as ProductStatus,
      condition: String(data.get('condition')) as ProductCondition,
      badge: String(data.get('badge')) || undefined,
      salesSummary: String(data.get('salesSummary')) || undefined,
      detailTitle: String(data.get('detailTitle')) || undefined,
      detailArticle: String(data.get('detailArticle')) || undefined,
      detailImages: String(data.get('detailImages') || '').split('\n').map(item => item.trim()).filter(Boolean),
      videoUrl: String(data.get('videoUrl')) || undefined,
      seoTitle: String(data.get('seoTitle')) || undefined,
      seoDescription: String(data.get('seoDescription')) || undefined,
      accent: product?.accent ?? '#7c98a8',
    })
  }

  return <div className="modal-shell">
    <button className="modal-backdrop" onClick={onClose} aria-label="ÄÃ³ng" />
    <form className="product-modal" onSubmit={submit}>
      <div className="modal-title"><div><p className="eyebrow">Sáº¢N PHáº¨M</p><h2>{product ? 'Chá»‰nh sá»­a sáº£n pháº©m' : 'ThÃªm sáº£n pháº©m má»›i'}</h2></div><button type="button" className="icon-button" onClick={onClose}><X /></button></div>
      <div className="form-grid">
        <label>MÃ£ sáº£n pháº©m<input name="id" required defaultValue={product?.id ?? `DP-${Date.now().toString().slice(-5)}`} readOnly={!!product} /></label>
        <label>TÃªn sáº£n pháº©m<input name="name" required defaultValue={product?.name} /></label>
        <label>ThÆ°Æ¡ng hiá»‡u<input name="brand" required defaultValue={product?.brand} /></label>
        <label>DÃ²ng sáº£n pháº©m<input name="line" defaultValue={product?.line} placeholder="VÃ­ dá»¥: Legion, XPS, Zenbook..." /></label>
        <label>PhÃ¢n loáº¡i<select name="category" defaultValue={product?.category ?? 'VÄƒn phÃ²ng'}>{productCategories.map(category => <option key={category}>{category}</option>)}</select></label>
        <label>CPU<input name="cpu" required defaultValue={product?.cpu} /></label>
        <label>RAM<input name="ram" required defaultValue={product?.ram} /></label>
        <label>á»” cá»©ng<input name="storage" required defaultValue={product?.storage} /></label>
        <label>MÃ n hÃ¬nh<input name="display" required defaultValue={product?.display} /></label>
        <label>GPU<input name="gpu" required defaultValue={product?.gpu} /></label>
        <label>TÃ¬nh tráº¡ng<select name="condition" defaultValue={product?.condition ?? 'Like new'}>{productConditions.map(condition => <option key={condition}>{condition}</option>)}</select></label>
        <label>NhÃ£n ná»•i báº­t<input name="badge" defaultValue={product?.badge} placeholder="BÃ¡n cháº¡y" /></label>
        <label>GiÃ¡ bÃ¡n<input name="price" type="number" min="0" required defaultValue={product?.price} /></label>
        <label>GiÃ¡ niÃªm yáº¿t<input name="originalPrice" type="number" min="0" defaultValue={product?.originalPrice} /></label>
        <label>Tá»“n kho<input name="stock" type="number" min="0" required defaultValue={product?.stock ?? 1} /></label>
        <label>Tráº¡ng thÃ¡i<select name="status" defaultValue={product?.status ?? 'active'}>{Object.entries(productStatusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <label className="form-span">Tóm tắt bán hàng<textarea name="salesSummary" rows={3} defaultValue={product?.salesSummary} placeholder="Viết ngắn gọn điểm mạnh, nhu cầu phù hợp, lý do nên chọn máy này." /></label>
        <label className="form-span">Tiêu đề bài viết chi tiết<input name="detailTitle" defaultValue={product?.detailTitle} placeholder="Ví dụ: Vì sao nên chọn Lenovo Legion 5 Pro?" /></label>
        <label className="form-span">Bài viết giới thiệu<textarea name="detailArticle" rows={6} defaultValue={product?.detailArticle} placeholder="Mỗi đoạn xuống dòng một lần. Nội dung này hiển thị trên trang chi tiết sản phẩm." /></label>
        <label className="form-span">Link ảnh chi tiết<textarea name="detailImages" rows={3} defaultValue={(product?.detailImages ?? []).join('`n')} placeholder="Mỗi dòng một link ảnh. Có thể dùng ảnh CDN hoặc ảnh public." /></label>
        <label className="form-span">Link video giới thiệu<input name="videoUrl" defaultValue={product?.videoUrl} placeholder="YouTube hoặc link video nhúng" /></label>
        <label>SEO title<input name="seoTitle" defaultValue={product?.seoTitle} placeholder="Tiêu đề Google cho sản phẩm" /></label>
        <label>SEO description<input name="seoDescription" defaultValue={product?.seoDescription} placeholder="Mô tả ngắn hiển thị trên Google" /></label>
      </div>
      <div className="modal-actions"><button type="button" className="button button--light" onClick={onClose}>Há»§y</button><button className="button button--primary">LÆ°u sáº£n pháº©m</button></div>
    </form>
  </div>
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
    if (!file.type.startsWith('image/')) return window.alert('Vui lÃ²ng chá»n file áº£nh logo.')
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
      storeName: String(data.get('storeName')),
      slogan: String(data.get('slogan')),
      logoStyle: String(data.get('logoStyle')) as StoreSettings['logoStyle'],
      logoRoundSrc,
      logoWideSrc,
      phone: String(data.get('phone')),
      address: String(data.get('address')),
      email: String(data.get('email')),
      facebook: String(data.get('facebook')),
      content,
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
            <div className="logo-manager__preview"><span>Xem trÆ°á»›c logo Ä‘ang dÃ¹ng</span><Logo variant={previewLogo} name={settings.storeName} slogan={settings.slogan} roundSrc={logoRoundSrc} wideSrc={logoWideSrc} /></div>
            <div className="logo-manager__controls">
              <div className="logo-style-toggle" role="radiogroup" aria-label="Chá»n kiá»ƒu logo hiá»ƒn thá»‹">
                <label className={previewLogo === 'round' ? 'active' : ''}><input type="radio" name="logoStyle" value="round" checked={previewLogo === 'round'} onChange={() => setPreviewLogo('round')} /> DÃ¹ng logo trÃ²n</label>
                <label className={previewLogo === 'wide' ? 'active' : ''}><input type="radio" name="logoStyle" value="wide" checked={previewLogo === 'wide'} onChange={() => setPreviewLogo('wide')} /> DÃ¹ng logo dÃ i</label>
              </div>
              <div className="logo-upload-row"><div><strong>Logo trÃ²n</strong><small>NÃªn dÃ¹ng áº£nh vuÃ´ng PNG/WebP.</small></div><span className="logo-upload-button">Chá»n áº£nh<input className="logo-file-input" type="file" accept="image/*" onChange={event => uploadLogo(event, 'round')} /></span><button type="button" onClick={() => setLogoRoundSrc('/dp-lab-logo.png')}>Máº·c Ä‘á»‹nh</button></div>
              <div className="logo-upload-row"><div><strong>Logo dÃ i</strong><small>NÃªn dÃ¹ng áº£nh ngang, ná»n trong suá»‘t hoáº·c tráº¯ng.</small></div><span className="logo-upload-button">Chá»n áº£nh<input className="logo-file-input" type="file" accept="image/*" onChange={event => uploadLogo(event, 'wide')} /></span><button type="button" onClick={() => setLogoWideSrc('/dtpt-techs-logo.png')}>Máº·c Ä‘á»‹nh</button></div>
            </div>
          </div>
          <div className="form-grid settings-fields">
            <label>TÃªn cá»­a hÃ ng<input name="storeName" defaultValue={settings.storeName} /></label>
            <label>Kháº©u hiá»‡u<input name="slogan" defaultValue={settings.slogan} /></label>
            <label>Sá»‘ Ä‘iá»‡n thoáº¡i<input name="phone" defaultValue={settings.phone} /></label>
            <label>Email<input name="email" defaultValue={settings.email} /></label>
            <label className="form-span">Äá»‹a chá»‰<textarea name="address" rows={3} defaultValue={settings.address} /></label>
            <label className="form-span">Facebook<input name="facebook" defaultValue={settings.facebook} /></label>
          </div>
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
        {(['1', '2', '3', '4'] as const).map(number => <>
          <ContentInput key={`service${number}Title`} name={`service${number}Title` as keyof SiteContent} label={`Dá»‹ch vá»¥ ${number} â€” tiÃªu Ä‘á»`} value={settings.content[`service${number}Title` as keyof SiteContent]} />
          <ContentInput key={`service${number}Description`} name={`service${number}Description` as keyof SiteContent} label={`Dá»‹ch vá»¥ ${number} â€” mÃ´ táº£`} value={settings.content[`service${number}Description` as keyof SiteContent]} />
        </>)}
      </ContentSection>

      <ContentSection number="05" title="Khu vá»±c sáº£n pháº©m" description="TiÃªu Ä‘á» vÃ  lá»i dáº«n phÃ­a trÃªn danh sÃ¡ch laptop.">
        <ContentInput name="productsEyebrow" label="NhÃ£n má»¥c" value={settings.content.productsEyebrow} />
        <ContentInput name="productsTitle" label="TiÃªu Ä‘á»" value={settings.content.productsTitle} />
        <ContentInput name="productsDescription" label="MÃ´ táº£" value={settings.content.productsDescription} multiline wide />
      </ContentSection>

      <ContentSection number="06" title="VÃ¬ sao chá»n DP Lab" description="ThÃ´ng Ä‘iá»‡p thÆ°Æ¡ng hiá»‡u vÃ  bá»‘n Ä‘iá»ƒm thuyáº¿t phá»¥c khÃ¡ch hÃ ng.">
        <ContentInput name="whyEyebrow" label="NhÃ£n má»¥c" value={settings.content.whyEyebrow} />
        <ContentInput name="whyTitle" label="TiÃªu Ä‘á»" value={settings.content.whyTitle} />
        <ContentInput name="whyDescription" label="Äoáº¡n giá»›i thiá»‡u" value={settings.content.whyDescription} multiline wide />
        {(['1', '2', '3', '4'] as const).map(number => <>
          <ContentInput key={`why${number}Title`} name={`why${number}Title` as keyof SiteContent} label={`LÃ½ do ${number} â€” tiÃªu Ä‘á»`} value={settings.content[`why${number}Title` as keyof SiteContent]} />
          <ContentInput key={`why${number}Description`} name={`why${number}Description` as keyof SiteContent} label={`LÃ½ do ${number} â€” mÃ´ táº£`} value={settings.content[`why${number}Description` as keyof SiteContent]} multiline />
        </>)}
      </ContentSection>

      <ContentSection number="07" title="KÃªu gá»i liÃªn há»‡ & footer" description="Khá»‘i gá»i Ä‘iá»‡n cuá»‘i trang vÃ  lá»i giá»›i thiá»‡u trong footer.">
        <ContentInput name="contactEyebrow" label="NhÃ£n liÃªn há»‡" value={settings.content.contactEyebrow} />
        <ContentInput name="contactTitle" label="TiÃªu Ä‘á» liÃªn há»‡" value={settings.content.contactTitle} />
        <ContentInput name="contactSubtitle" label="DÃ²ng phá»¥ liÃªn há»‡" value={settings.content.contactSubtitle} />
        <ContentInput name="footerDescription" label="Giá»›i thiá»‡u á»Ÿ footer" value={settings.content.footerDescription} multiline wide />
      </ContentSection>

      <div className="settings-actions settings-actions--sticky">
        <button type="button" className="button button--light" onClick={() => window.confirm('KhÃ´i phá»¥c toÃ n bá»™ dá»¯ liá»‡u demo ban Ä‘áº§u?') && resetDemo()}><RefreshCcw />KhÃ´i phá»¥c máº·c Ä‘á»‹nh</button>
        <div><span>Má»i thay Ä‘á»•i sáº½ Ã¡p dá»¥ng ngay ngoÃ i website.</span><button className={`button button--primary ${saved ? 'button--success' : ''}`}>{saved ? 'ÄÃ£ lÆ°u thay Ä‘á»•i' : 'LÆ°u toÃ n bá»™ thay Ä‘á»•i'}</button></div>
      </div>
    </form>
  </>
}

function ContentSection({ number, title, description, children }: { number: string; title: string; description: string; children: React.ReactNode }) {
  return <section className="admin-panel settings-card"><div className="settings-card__heading"><span>{number}</span><div><h2>{title}</h2><p>{description}</p></div></div><div className="settings-card__body settings-content-grid">{children}</div></section>
}

function ContentInput({ name, label, value, multiline = false, wide = false }: { name: keyof SiteContent; label: string; value: string; multiline?: boolean; wide?: boolean }) {
  return <label className={wide ? 'form-span' : ''}>{label}{multiline ? <textarea name={name} rows={3} defaultValue={value} /> : <input name={name} defaultValue={value} />}</label>
}
