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
import { AnalyticsTab } from './admin/AnalyticsTab'

type AdminTab = 'dashboard' | 'products' | 'orders' | 'accounts' | 'analytics' | 'settings'

const money = (value: number) => `${new Intl.NumberFormat('vi-VN').format(value)}₫`
const orderLabels: Record<OrderStatus, string> = {
  new: 'Đơn mới',
  confirmed: 'Đã xác nhận',
  shipping: 'Đang giao',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
}

const productStatusLabels: Record<ProductStatus, string> = {
  active: 'Đang bán',
  draft: 'Bản nháp',
  'out-of-stock': 'Hết hàng',
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
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    const handleUnauthorized = () => {
      setAuthError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
      setSession(null)
    }
    window.addEventListener('dtpt-admin-unauthorized', handleUnauthorized)
    return () => window.removeEventListener('dtpt-admin-unauthorized', handleUnauthorized)
  }, [])

  const visibleProducts = products.filter(product => `${product.name} ${product.id} ${product.brand}`.toLowerCase().includes(query.toLowerCase()))
  const revenue = orders.filter(order => order.status !== 'cancelled').reduce((sum, order) => sum + order.total, 0)
  const newOrders = orders.filter(order => order.status === 'new').length

  if (!session) {
    return <AdminLogin navigate={navigate} initialError={authError} onLogin={nextSession => { setAuthError(''); setSession(nextSession); if (api.enabled) window.location.reload() }} />
  }

  const go = (next: AdminTab) => { setTab(next); setSidebar(false) }
  const logout = () => { api.logoutAdmin(); setSession(null); navigate('/') }

  return <div className="admin">
    <aside className={`admin-sidebar ${sidebar ? 'admin-sidebar--open' : ''}`}>
      <div className="admin-sidebar__head">
        <Logo inverse variant={settings.logoStyle} name={settings.storeName} slogan={settings.slogan} roundSrc={settings.logoRoundSrc} wideSrc={settings.logoWideSrc} />
        <button className="admin-sidebar__close" onClick={() => setSidebar(false)} aria-label="Đóng menu"><X /></button>
      </div>
      <nav>
        <button className={tab === 'dashboard' ? 'active' : ''} onClick={() => go('dashboard')}><LayoutDashboard />Tổng quan</button>
        <button className={tab === 'products' ? 'active' : ''} onClick={() => go('products')}><Boxes />Sản phẩm</button>
        <button className={tab === 'orders' ? 'active' : ''} onClick={() => go('orders')}><ClipboardList />Đơn hàng{newOrders > 0 && <span>{newOrders}</span>}</button>
        <button className={tab === 'accounts' ? 'active' : ''} onClick={() => go('accounts')}><Users />Tài khoản</button>
        <button className={tab === 'analytics' ? 'active' : ''} onClick={() => go('analytics')}><BarChart3 />Báo cáo</button>
        <p>HỆ THỐNG</p>
        <button className={tab === 'settings' ? 'active' : ''} onClick={() => go('settings')}><Settings />Cài đặt</button>
      </nav>
      <button className="admin-user admin-user--button" onClick={logout}>
        <span>TĐ</span>
        <div><strong>{session.user.displayName}</strong><small>Đăng xuất</small></div>
        <MoreHorizontal />
      </button>
    </aside>

    {sidebar && <button className="admin-mobile-backdrop" onClick={() => setSidebar(false)} aria-label="Đóng menu" />}

    <div className="admin-main">
      <header className="admin-topbar">
        <button className="admin-menu" onClick={() => setSidebar(true)} aria-label="Mở menu"><Menu /></button>
        <label><Search /><input placeholder="Tìm kiếm nhanh..." /></label>
        <div>
          <button className="icon-button" aria-label="Thông báo"><Bell />{newOrders > 0 && <span />}</button>
          <button className="button button--light" onClick={() => navigate('/')}><Eye />Xem cửa hàng</button>
        </div>
      </header>

      <div className="admin-content">
        {tab === 'dashboard' && <DashboardTab products={products} orders={orders} revenue={revenue} newOrders={newOrders} displayName={session.user.displayName} onOrders={() => go('orders')} />}
        {tab === 'products' && <ProductsTab products={visibleProducts} total={products.length} query={query} setQuery={setQuery} onAdd={() => setEditing('new')} onEdit={setEditing} onDelete={deleteProduct} />}
        {tab === 'orders' && <OrdersTab orders={orders} newOrders={newOrders} updateOrderStatus={updateOrderStatus} />}
        {tab === 'accounts' && <AccountsTab currentUsername={session.user.username} />}
        {tab === 'analytics' && <AnalyticsTab products={products} />}
        {tab === 'settings' && <SettingsTab settings={settings} updateSettings={updateSettings} resetDemo={resetDemo} />}
      </div>
    </div>

    {editing && <ProductModal product={editing === 'new' ? null : editing} onClose={() => setEditing(null)} onSave={product => { saveProduct(product); setEditing(null) }} />}
  </div>
}

function AdminLogin({ navigate, initialError, onLogin }: { navigate: (path: string) => void; initialError?: string; onLogin: (session: AdminSession) => void }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(initialError || '')

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
          const session = { token: 'local-demo', user: { username: 'delai', displayName: 'Tiến Đệ' } }
          api.saveAdminSession(session)
          return onLogin(session)
        }
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
      <div className="admin-login-brand"><span>DT</span><div><strong>DTPT Shop Admin</strong><small>Đăng nhập để quản lý website</small></div></div>
      <label>Tên đăng nhập<input name="username" autoComplete="username" required /></label>
      <label>Mật khẩu<input name="password" type="password" autoComplete="current-password" required /></label>
      {error && <p className="admin-login-error">{error}</p>}
      <button className="button button--primary" disabled={loading}>{loading ? 'Đang đăng nhập...' : 'Đăng nhập'}</button>
    </form>
  </main>
}

function PageTitle({ eyebrow, title, subtitle, children }: { eyebrow: string; title: string; subtitle: string; children?: React.ReactNode }) {
  return <div className="admin-title"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{subtitle}</p></div>{children}</div>
}

function DashboardTab({ products, orders, revenue, newOrders, displayName, onOrders }: { products: Product[]; orders: ReturnType<typeof useStore>['orders']; revenue: number; newOrders: number; displayName: string; onOrders: () => void }) {
  const latest = orders.slice(0, 5)
  return <>
    <PageTitle eyebrow="HÔM NAY" title={`Chào ${displayName}!`} subtitle="Đây là tình hình cửa hàng của bạn hôm nay." />
    <div className="metric-grid">
      <Metric icon={<CircleDollarSign />} tone="green" label="Doanh thu ghi nhận" value={money(revenue)} note="12,5% so với kỳ trước" />
      <Metric icon={<ShoppingBag />} tone="orange" label="Đơn hàng mới" value={newOrders} note="Cần xác nhận trong ngày" />
      <Metric icon={<Package />} tone="blue" label="Sản phẩm đang bán" value={products.filter(product => product.status === 'active').length} note={`${products.reduce((sum, product) => sum + product.stock, 0)} máy trong kho`} />
      <Metric icon={<Users />} tone="purple" label="Khách hàng" value={orders.length} note="Tăng trưởng từ đơn hàng" />
    </div>
    <div className="dashboard-grid">
      <section className="admin-panel chart-panel">
        <div className="panel-heading"><div><h2>Doanh thu</h2><p>Hiệu quả 7 ngày gần nhất</p></div><button>7 ngày <ChevronDown /></button></div>
        <div className="fake-chart"><div className="chart-labels"><span>30tr</span><span>20tr</span><span>10tr</span><span>0</span></div><div className="chart-bars">{[42, 62, 48, 76, 58, 84, 70].map((height, index) => <div key={index}><span style={{ height: `${height}%` }} /><small>{['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'][index]}</small></div>)}</div></div>
      </section>
      <section className="admin-panel inventory-panel">
        <div className="panel-heading"><div><h2>Tình trạng kho</h2><p>Cập nhật theo danh mục</p></div></div>
        {productCategories.map(category => {
          const stock = products.filter(product => product.category === category).reduce((sum, product) => sum + product.stock, 0)
          return <div className="stock-row" key={category}><span>{category}</span><div><i style={{ width: `${Math.min(stock * 5, 100)}%` }} /></div><strong>{stock}</strong></div>
        })}
      </section>
    </div>
    <section className="admin-panel">
      <div className="panel-heading panel-heading--padded"><div><h2>Đơn hàng gần đây</h2><p>Cập nhật ngay khi khách đặt hàng</p></div><button className="text-button" onClick={onOrders}>Xem tất cả <ArrowLeft className="rotate-180" /></button></div>
      <div className="table-wrap"><table><thead><tr><th>Mã đơn</th><th>Khách hàng</th><th>Giá trị</th><th>Trạng thái</th><th>Thời gian</th></tr></thead><tbody>{latest.map(order => <tr key={order.id}><td><strong>#{order.id}</strong></td><td>{order.customer.name}<small className="cell-sub">{order.customer.phone}</small></td><td><strong>{money(order.total)}</strong></td><td><span className={`order-badge order-badge--${order.status}`}>{orderLabels[order.status]}</span></td><td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td></tr>)}</tbody></table></div>
    </section>
  </>
}

function Metric({ icon, tone, label, value, note }: { icon: React.ReactNode; tone: 'green' | 'orange' | 'blue' | 'purple'; label: string; value: string | number; note: string }) {
  return <article><span className={`metric-icon metric-icon--${tone}`}>{icon}</span><small>{label}</small><strong>{value}</strong><p><TrendingUp />{note}</p></article>
}

function ProductsTab({ products, total, query, setQuery, onAdd, onEdit, onDelete }: { products: Product[]; total: number; query: string; setQuery: (value: string) => void; onAdd: () => void; onEdit: (product: Product) => void; onDelete: (id: string) => void }) {
  return <>
    <PageTitle eyebrow="KHO HÀNG" title="Quản lý sản phẩm" subtitle={`${total} sản phẩm trong danh mục`}><button className="button button--primary" onClick={onAdd}><Plus />Thêm sản phẩm</button></PageTitle>
    <div className="admin-panel">
      <div className="table-tools"><label><Search /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Tìm tên, mã, thương hiệu..." /></label><button><ChevronDown />Tất cả trạng thái</button></div>
      <div className="table-wrap"><table><thead><tr><th>Sản phẩm</th><th>Phân loại</th><th>Giá bán</th><th>Tồn kho</th><th>Trạng thái</th><th /></tr></thead><tbody>{products.map(product => <tr key={product.id}><td><div className="table-product"><ProductArt product={product} /><span><strong>{product.name}</strong><small>{product.id} · {product.cpu}</small></span></div></td><td>{product.brand}<small className="cell-sub">{product.line ? `${product.line} · ${product.category}` : product.category}</small></td><td><strong>{money(product.price)}</strong></td><td>{product.stock} máy</td><td><span className={`status-pill status-pill--${product.status}`}>{productStatusLabels[product.status]}</span></td><td><div className="row-actions"><button onClick={() => onEdit(product)} aria-label={`Sửa ${product.name}`}><Edit3 /></button><button onClick={() => window.confirm(`Xóa ${product.name}?`) && onDelete(product.id)} aria-label={`Xóa ${product.name}`}><Trash2 /></button></div></td></tr>)}</tbody></table></div>
    </div>
  </>
}

function OrdersTab({ orders, newOrders, updateOrderStatus }: { orders: ReturnType<typeof useStore>['orders']; newOrders: number; updateOrderStatus: (id: string, status: OrderStatus) => void }) {
  return <>
    <PageTitle eyebrow="BÁN HÀNG" title="Đơn hàng" subtitle={`${newOrders} đơn mới đang chờ xử lý`} />
    <div className="admin-panel"><div className="table-wrap"><table><thead><tr><th>Mã đơn</th><th>Khách hàng</th><th>Sản phẩm</th><th>Tổng tiền</th><th>Ngày đặt</th><th>Trạng thái</th></tr></thead><tbody>{orders.map(order => <tr key={order.id}><td><strong>#{order.id}</strong></td><td><strong>{order.customer.name}</strong><small className="cell-sub">{order.customer.phone}</small></td><td>{order.items.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm<small className="cell-sub">{order.customer.address}</small></td><td><strong>{money(order.total)}</strong></td><td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td><td><select className={`order-select order-select--${order.status}`} value={order.status} onChange={event => updateOrderStatus(order.id, event.target.value as OrderStatus)}>{Object.entries(orderLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></td></tr>)}</tbody></table></div></div>
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
    <PageTitle eyebrow="BẢO MẬT" title="Tài khoản quản trị" subtitle="Thêm tài khoản cho người có quyền quản lý website DTPT Shop." />
    <div className="accounts-grid">
      <form className="admin-panel account-form" onSubmit={submit}>
        <h2>Thêm tài khoản</h2>
        <label>Tên hiển thị<input name="displayName" placeholder="Ví dụ: Tiến Đệ" required /></label>
        <label>Tên đăng nhập<input name="username" placeholder="Ví dụ: tendangnhap" required /></label>
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
      specifications: String(data.get('specifications') || '').split('\n').map(item => item.trim()).filter(Boolean).map(item => {
        const separator = item.indexOf(':')
        return separator > 0 ? { label: item.slice(0, separator).trim(), value: item.slice(separator + 1).trim() } : null
      }).filter((item): item is { label: string; value: string } => Boolean(item?.label && item.value)),
      videoUrl: String(data.get('videoUrl')) || undefined,
      seoTitle: String(data.get('seoTitle')) || undefined,
      seoDescription: String(data.get('seoDescription')) || undefined,
      accent: product?.accent ?? '#7c98a8',
    })
  }

  return <div className="modal-shell">
    <button className="modal-backdrop" onClick={onClose} aria-label="Đóng" />
    <form className="product-modal" onSubmit={submit}>
      <div className="modal-title"><div><p className="eyebrow">SẢN PHẨM</p><h2>{product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2></div><button type="button" className="icon-button" onClick={onClose}><X /></button></div>
      <div className="form-grid">
        <label>Mã sản phẩm<input name="id" required defaultValue={product?.id ?? `DTPT-${Date.now().toString().slice(-5)}`} readOnly={!!product} /></label>
        <label>Tên sản phẩm<input name="name" required defaultValue={product?.name} /></label>
        <label>Thương hiệu<input name="brand" required defaultValue={product?.brand} /></label>
        <label>Dòng sản phẩm<input name="line" defaultValue={product?.line} placeholder="Ví dụ: Legion, XPS, Zenbook..." /></label>
        <label>Phân loại<select name="category" defaultValue={product?.category ?? 'Văn phòng'}>{productCategories.map(category => <option key={category}>{category}</option>)}</select></label>
        <label>CPU<input name="cpu" required defaultValue={product?.cpu} /></label>
        <label>RAM<input name="ram" required defaultValue={product?.ram} /></label>
        <label>Ổ cứng<input name="storage" required defaultValue={product?.storage} /></label>
        <label>Màn hình<input name="display" required defaultValue={product?.display} /></label>
        <label>GPU<input name="gpu" required defaultValue={product?.gpu} /></label>
        <label>Tình trạng<select name="condition" defaultValue={product?.condition ?? 'Like new'}>{productConditions.map(condition => <option key={condition}>{condition}</option>)}</select></label>
        <label>Nhãn nổi bật<input name="badge" defaultValue={product?.badge} placeholder="Bán chạy" /></label>
        <label>Giá bán<input name="price" type="number" min="0" required defaultValue={product?.price} /></label>
        <label>Giá niêm yết<input name="originalPrice" type="number" min="0" defaultValue={product?.originalPrice} /></label>
        <label>Tồn kho<input name="stock" type="number" min="0" required defaultValue={product?.stock ?? 1} /></label>
        <label>Trạng thái<select name="status" defaultValue={product?.status ?? 'active'}>{Object.entries(productStatusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <label className="form-span">Tóm tắt bán hàng<textarea name="salesSummary" rows={3} defaultValue={product?.salesSummary} placeholder="Viết ngắn gọn điểm mạnh, nhu cầu phù hợp, lý do nên chọn máy này." /></label>
        <label className="form-span">Tiêu đề bài viết chi tiết<input name="detailTitle" defaultValue={product?.detailTitle} placeholder="Ví dụ: Vì sao nên chọn Lenovo Legion 5 Pro?" /></label>
        <label className="form-span">Bài viết giới thiệu<textarea name="detailArticle" rows={6} defaultValue={product?.detailArticle} placeholder="Mỗi đoạn xuống dòng một lần. Nội dung này hiển thị trên trang chi tiết sản phẩm." /></label>
        <label className="form-span">Link ảnh chi tiết<textarea name="detailImages" rows={3} defaultValue={(product?.detailImages ?? []).join('\n')} placeholder="Mỗi dòng một link ảnh. Có thể dùng ảnh CDN hoặc ảnh public." /></label>
        <label className="form-span">Cấu hình chi tiết<textarea name="specifications" rows={8} defaultValue={(product?.specifications ?? []).map(item => `${item.label}: ${item.value}`).join('\n')} placeholder={'Mỗi dòng một thông số, ví dụ:\nCPU: Intel Core Ultra 7 255H\nRAM: 32GB LPDDR5X'} /></label>
        <label className="form-span">Link video giới thiệu<input name="videoUrl" defaultValue={product?.videoUrl} placeholder="YouTube hoặc link video nhúng" /></label>
        <label>SEO title<input name="seoTitle" defaultValue={product?.seoTitle} placeholder="Tiêu đề Google cho sản phẩm" /></label>
        <label>SEO description<input name="seoDescription" defaultValue={product?.seoDescription} placeholder="Mô tả ngắn hiển thị trên Google" /></label>
      </div>
      <div className="modal-actions"><button type="button" className="button button--light" onClick={onClose}>Hủy</button><button className="button button--primary">Lưu sản phẩm</button></div>
    </form>
  </div>
}

const readLogoFile = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => resolve(String(reader.result))
  reader.onerror = reject
  reader.readAsDataURL(file)
})

function SettingsTab({ settings, updateSettings, resetDemo }: { settings: StoreSettings; updateSettings: (value: StoreSettings) => Promise<void>; resetDemo: () => void }) {
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [previewLogo, setPreviewLogo] = useState(settings.logoStyle)
  const [logoRoundSrc, setLogoRoundSrc] = useState(settings.logoRoundSrc)
  const [logoWideSrc, setLogoWideSrc] = useState(settings.logoWideSrc)

  useEffect(() => {
    setPreviewLogo(settings.logoStyle)
    setLogoRoundSrc(settings.logoRoundSrc)
    setLogoWideSrc(settings.logoWideSrc)
  }, [settings.logoRoundSrc, settings.logoStyle, settings.logoWideSrc])

  const uploadLogo = async (event: ChangeEvent<HTMLInputElement>, target: 'round' | 'wide') => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return window.alert('Vui lòng chọn file ảnh logo.')
    if (file.size > 2 * 1024 * 1024) {
      window.alert('Logo nên dưới 2MB để website tải nhanh và lưu ổn định.')
      event.target.value = ''
      return
    }
    const src = await readLogoFile(file)
    if (target === 'round') { setLogoRoundSrc(src); setPreviewLogo('round') }
    else { setLogoWideSrc(src); setPreviewLogo('wide') }
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const content = { ...settings.content }
    ;(Object.keys(content) as Array<keyof SiteContent>).forEach(key => { content[key] = String(data.get(key) ?? '') })
    setSaving(true)
    setSaved(false)
    setSaveError('')
    try {
      await updateSettings({
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
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Không lưu được cài đặt. Vui lòng đăng nhập lại và thử lại.')
    } finally {
      setSaving(false)
    }
  }

  const formKey = [
    settings.storeName,
    settings.slogan,
    settings.logoStyle,
    settings.phone,
    settings.address,
    settings.email,
    settings.facebook,
    ...Object.values(settings.content),
  ].join('|')

  return <>
    <PageTitle eyebrow="GIAO DIỆN WEBSITE" title="Nội dung & nhận diện" subtitle="Chỉnh logo và toàn bộ nội dung chính đang hiển thị ngoài cửa hàng." />
    <form key={formKey} className="settings-form settings-form--cms" onSubmit={submit}>
      <section className="admin-panel settings-card">
        <div className="settings-card__heading"><span>01</span><div><h2>Logo và thương hiệu</h2><p>Chọn mẫu logo sử dụng xuyên suốt website và trang quản trị.</p></div></div>
        <div className="settings-card__body">
          <div className="logo-manager">
            <div className="logo-manager__preview"><span>Xem trước logo đang dùng</span><Logo variant={previewLogo} name={settings.storeName} slogan={settings.slogan} roundSrc={logoRoundSrc} wideSrc={logoWideSrc} /></div>
            <div className="logo-manager__controls">
              <div className="logo-style-toggle" role="radiogroup" aria-label="Chọn kiểu logo hiển thị">
                <label className={previewLogo === 'round' ? 'active' : ''}><input type="radio" name="logoStyle" value="round" checked={previewLogo === 'round'} onChange={() => setPreviewLogo('round')} /> Dùng logo tròn</label>
                <label className={previewLogo === 'wide' ? 'active' : ''}><input type="radio" name="logoStyle" value="wide" checked={previewLogo === 'wide'} onChange={() => setPreviewLogo('wide')} /> Dùng logo dài</label>
              </div>
              <div className="logo-upload-row"><div><strong>Logo tròn</strong><small>Nên dùng ảnh vuông PNG/WebP.</small></div><span className="logo-upload-button">Chọn ảnh<input className="logo-file-input" type="file" accept="image/*" onChange={event => uploadLogo(event, 'round')} /></span><button type="button" onClick={() => setLogoRoundSrc('/dp-lab-logo.png')}>Mặc định</button></div>
              <div className="logo-upload-row"><div><strong>Logo dài</strong><small>Nên dùng ảnh ngang, nền trong suốt hoặc trắng.</small></div><span className="logo-upload-button">Chọn ảnh<input className="logo-file-input" type="file" accept="image/*" onChange={event => uploadLogo(event, 'wide')} /></span><button type="button" onClick={() => setLogoWideSrc('/dtpt-techs-logo.png')}>Mặc định</button></div>
            </div>
          </div>
          <div className="form-grid settings-fields">
            <label>Tên cửa hàng<input name="storeName" defaultValue={settings.storeName} /></label>
            <label>Khẩu hiệu<input name="slogan" defaultValue={settings.slogan} /></label>
            <label>Số điện thoại<input name="phone" defaultValue={settings.phone} /></label>
            <label>Email<input name="email" defaultValue={settings.email} /></label>
            <label className="form-span">Địa chỉ<textarea name="address" rows={3} defaultValue={settings.address} /></label>
            <label className="form-span">Facebook<input name="facebook" defaultValue={settings.facebook} /></label>
          </div>
        </div>
      </section>

      <ContentSection number="02" title="Thanh đầu trang & menu" description="Hai dòng thông báo trên cùng và tên các mục điều hướng.">
        <ContentInput name="announcementPrimary" label="Thông báo bên trái" value={settings.content.announcementPrimary} />
        <ContentInput name="announcementSecondary" label="Thông báo bên phải" value={settings.content.announcementSecondary} />
        <ContentInput name="navProducts" label="Menu sản phẩm" value={settings.content.navProducts} />
        <ContentInput name="navWhy" label="Menu giới thiệu" value={settings.content.navWhy} />
        <ContentInput name="navContact" label="Menu liên hệ" value={settings.content.navContact} />
      </ContentSection>

      <ContentSection number="03" title="Banner chính" description="Thông điệp đầu tiên khách hàng nhìn thấy khi mở website.">
        <ContentInput name="heroBadge" label="Nhãn nhỏ" value={settings.content.heroBadge} />
        <ContentInput name="heroPrimaryAction" label="Nút hành động" value={settings.content.heroPrimaryAction} />
        <ContentInput name="heroTitle" label="Tiêu đề chính" value={settings.content.heroTitle} />
        <ContentInput name="heroHighlight" label="Dòng tiêu đề nổi bật" value={settings.content.heroHighlight} />
        <ContentInput name="heroDescription" label="Đoạn giới thiệu" value={settings.content.heroDescription} multiline wide />
        <ContentInput name="trustQuality" label="Cam kết 1" value={settings.content.trustQuality} />
        <ContentInput name="trustWarranty" label="Cam kết 2" value={settings.content.trustWarranty} />
        <ContentInput name="trustDelivery" label="Cam kết 3" value={settings.content.trustDelivery} />
      </ContentSection>

      <ContentSection number="04" title="Dải dịch vụ" description="Bốn lợi ích nằm ngay dưới banner chính.">
        {(['1', '2', '3', '4'] as const).map(number => <>
          <ContentInput key={`service${number}Title`} name={`service${number}Title` as keyof SiteContent} label={`Dịch vụ ${number} — tiêu đề`} value={settings.content[`service${number}Title` as keyof SiteContent]} />
          <ContentInput key={`service${number}Description`} name={`service${number}Description` as keyof SiteContent} label={`Dịch vụ ${number} — mô tả`} value={settings.content[`service${number}Description` as keyof SiteContent]} />
        </>)}
      </ContentSection>

      <ContentSection number="05" title="Khu vực sản phẩm" description="Tiêu đề và lời dẫn phía trên danh sách laptop.">
        <ContentInput name="productsEyebrow" label="Nhãn mục" value={settings.content.productsEyebrow} />
        <ContentInput name="productsTitle" label="Tiêu đề" value={settings.content.productsTitle} />
        <ContentInput name="productsDescription" label="Mô tả" value={settings.content.productsDescription} multiline wide />
      </ContentSection>

      <ContentSection number="06" title="Vì sao chọn DTPT Shop" description="Thông điệp thương hiệu và bốn điểm thuyết phục khách hàng.">
        <ContentInput name="whyEyebrow" label="Nhãn mục" value={settings.content.whyEyebrow} />
        <ContentInput name="whyTitle" label="Tiêu đề" value={settings.content.whyTitle} />
        <ContentInput name="whyDescription" label="Đoạn giới thiệu" value={settings.content.whyDescription} multiline wide />
        {(['1', '2', '3', '4'] as const).map(number => <>
          <ContentInput key={`why${number}Title`} name={`why${number}Title` as keyof SiteContent} label={`Lý do ${number} — tiêu đề`} value={settings.content[`why${number}Title` as keyof SiteContent]} />
          <ContentInput key={`why${number}Description`} name={`why${number}Description` as keyof SiteContent} label={`Lý do ${number} — mô tả`} value={settings.content[`why${number}Description` as keyof SiteContent]} multiline />
        </>)}
      </ContentSection>

      <ContentSection number="07" title="Kêu gọi liên hệ & footer" description="Khối gọi điện cuối trang và lời giới thiệu trong footer.">
        <ContentInput name="contactEyebrow" label="Nhãn liên hệ" value={settings.content.contactEyebrow} />
        <ContentInput name="contactTitle" label="Tiêu đề liên hệ" value={settings.content.contactTitle} />
        <ContentInput name="contactSubtitle" label="Dòng phụ liên hệ" value={settings.content.contactSubtitle} />
        <ContentInput name="footerDescription" label="Giới thiệu ở footer" value={settings.content.footerDescription} multiline wide />
      </ContentSection>

      <div className="settings-actions settings-actions--sticky">
        <button type="button" className="button button--light" onClick={() => window.confirm('Khôi phục toàn bộ dữ liệu demo ban đầu?') && resetDemo()}><RefreshCcw />Khôi phục mặc định</button>
        <div>
          <span>{saveError || (saved ? 'Đã lưu vào database. Website sẽ giữ thay đổi sau khi tải lại.' : 'Mọi thay đổi chỉ được xác nhận sau khi backend lưu thành công.')}</span>
          <button disabled={saving} className={`button button--primary ${saved ? 'button--success' : ''}`}>{saving ? 'Đang lưu...' : saved ? 'Đã lưu thay đổi' : 'Lưu toàn bộ thay đổi'}</button>
        </div>
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
