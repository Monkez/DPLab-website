import { ArrowLeft, BarChart3, Bell, Boxes, ChevronDown, CircleDollarSign, ClipboardList, Edit3, Eye, LayoutDashboard, Menu, MoreHorizontal, Package, Plus, RefreshCcw, Search, Settings, ShoppingBag, Trash2, TrendingUp, Users, X } from 'lucide-react'
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Logo } from '../components/Logo'
import { ProductArt } from '../components/ProductArt'
import { useStore } from '../store/StoreContext'
import type { OrderStatus, Product, ProductStatus, SiteContent, StoreSettings } from '../types'

type AdminTab = 'dashboard' | 'products' | 'orders' | 'settings'
const money = (value: number) => new Intl.NumberFormat('vi-VN').format(value) + '₫'
const orderLabels: Record<OrderStatus, string> = { new: 'Đơn mới', confirmed: 'Đã xác nhận', shipping: 'Đang giao', completed: 'Hoàn thành', cancelled: 'Đã hủy' }

export function AdminPage({ navigate }: { navigate: (path: string) => void }) {
  const { products, orders, settings, updateOrderStatus, saveProduct, deleteProduct, updateSettings, resetDemo } = useStore()
  const [tab, setTab] = useState<AdminTab>('dashboard')
  const [sidebar, setSidebar] = useState(false)
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState<Product | null | 'new'>(null)
  const visibleProducts = products.filter(product => `${product.name} ${product.id} ${product.brand}`.toLowerCase().includes(query.toLowerCase()))
  const revenue = orders.filter(o => o.status !== 'cancelled').reduce((sum, order) => sum + order.total, 0)
  const newOrders = orders.filter(order => order.status === 'new').length

  const go = (next: AdminTab) => { setTab(next); setSidebar(false) }
  return <div className="admin">
    <aside className={`admin-sidebar ${sidebar ? 'admin-sidebar--open' : ''}`}><div className="admin-sidebar__head"><Logo inverse variant={settings.logoStyle} name={settings.storeName} slogan={settings.slogan} roundSrc={settings.logoRoundSrc} wideSrc={settings.logoWideSrc} /><button className="admin-sidebar__close" onClick={() => setSidebar(false)}><X /></button></div><nav>
      <button className={tab === 'dashboard' ? 'active' : ''} onClick={() => go('dashboard')}><LayoutDashboard />Tổng quan</button>
      <button className={tab === 'products' ? 'active' : ''} onClick={() => go('products')}><Boxes />Sản phẩm</button>
      <button className={tab === 'orders' ? 'active' : ''} onClick={() => go('orders')}><ClipboardList />Đơn hàng{newOrders > 0 && <span>{newOrders}</span>}</button>
      <button><Users />Khách hàng<small>Sớm</small></button><button><BarChart3 />Báo cáo<small>Sớm</small></button>
      <p>HỆ THỐNG</p><button className={tab === 'settings' ? 'active' : ''} onClick={() => go('settings')}><Settings />Cài đặt</button>
    </nav><div className="admin-user"><span>ĐP</span><div><strong>Đỗ Hưng Đông</strong><small>Quản trị viên</small></div><MoreHorizontal /></div></aside>
    {sidebar && <button className="admin-mobile-backdrop" onClick={() => setSidebar(false)} aria-label="Đóng menu" />}
    <div className="admin-main"><header className="admin-topbar"><button className="admin-menu" onClick={() => setSidebar(true)}><Menu /></button><label><Search /><input placeholder="Tìm kiếm nhanh..." /></label><div><button className="icon-button"><Bell />{newOrders > 0 && <span />}</button><button className="button button--light" onClick={() => navigate('/')}><Eye />Xem cửa hàng</button></div></header>
      <div className="admin-content">
        {tab === 'dashboard' && <DashboardTab products={products} orders={orders} revenue={revenue} newOrders={newOrders} onOrders={() => go('orders')} />}
        {tab === 'products' && <><PageTitle eyebrow="KHO HÀNG" title="Quản lý sản phẩm" subtitle={`${products.length} sản phẩm trong danh mục`}><button className="button button--primary" onClick={() => setEditing('new')}><Plus />Thêm sản phẩm</button></PageTitle><div className="admin-panel"><div className="table-tools"><label><Search /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Tìm tên, mã, thương hiệu..." /></label><button><ChevronDown />Tất cả trạng thái</button></div><div className="table-wrap"><table><thead><tr><th>Sản phẩm</th><th>Phân loại</th><th>Giá bán</th><th>Tồn kho</th><th>Trạng thái</th><th /></tr></thead><tbody>{visibleProducts.map(product => <tr key={product.id}><td><div className="table-product"><ProductArt product={product} /><span><strong>{product.name}</strong><small>{product.id} · {product.cpu}</small></span></div></td><td>{product.brand}<small className="cell-sub">{product.category}</small></td><td><strong>{money(product.price)}</strong></td><td>{product.stock} máy</td><td><span className={`status-pill status-pill--${product.status}`}>{product.status === 'active' ? 'Đang bán' : product.status === 'draft' ? 'Bản nháp' : 'Hết hàng'}</span></td><td><div className="row-actions"><button onClick={() => setEditing(product)} aria-label={`Sửa ${product.name}`}><Edit3 /></button><button onClick={() => window.confirm(`Xóa ${product.name}?`) && deleteProduct(product.id)} aria-label={`Xóa ${product.name}`}><Trash2 /></button></div></td></tr>)}</tbody></table></div></div></>}
        {tab === 'orders' && <><PageTitle eyebrow="BÁN HÀNG" title="Đơn hàng" subtitle={`${newOrders} đơn mới đang chờ xử lý`} /><div className="admin-panel"><div className="table-wrap"><table><thead><tr><th>Mã đơn</th><th>Khách hàng</th><th>Sản phẩm</th><th>Tổng tiền</th><th>Ngày đặt</th><th>Trạng thái</th></tr></thead><tbody>{orders.map(order => <tr key={order.id}><td><strong>#{order.id}</strong></td><td><strong>{order.customer.name}</strong><small className="cell-sub">{order.customer.phone}</small></td><td>{order.items.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm<small className="cell-sub">{order.customer.address}</small></td><td><strong>{money(order.total)}</strong></td><td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td><td><select className={`order-select order-select--${order.status}`} value={order.status} onChange={event => updateOrderStatus(order.id, event.target.value as OrderStatus)}>{Object.entries(orderLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></td></tr>)}</tbody></table></div></div></>}
        {tab === 'settings' && <SettingsTab settings={settings} updateSettings={updateSettings} resetDemo={resetDemo} />}
      </div>
    </div>
    {editing && <ProductModal product={editing === 'new' ? null : editing} onClose={() => setEditing(null)} onSave={product => { saveProduct(product); setEditing(null) }} />}
  </div>
}

function PageTitle({ eyebrow, title, subtitle, children }: { eyebrow: string; title: string; subtitle: string; children?: React.ReactNode }) {
  return <div className="admin-title"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{subtitle}</p></div>{children}</div>
}

function DashboardTab({ products, orders, revenue, newOrders, onOrders }: { products: Product[]; orders: ReturnType<typeof useStore>['orders']; revenue: number; newOrders: number; onOrders: () => void }) {
  const latest = orders.slice(0, 5)
  return <><PageTitle eyebrow="HÔM NAY, 01 THÁNG 07" title="Chào buổi tối, Đông!" subtitle="Đây là tình hình cửa hàng của bạn hôm nay." />
    <div className="metric-grid"><article><span className="metric-icon metric-icon--green"><CircleDollarSign /></span><small>Doanh thu ghi nhận</small><strong>{money(revenue)}</strong><p><TrendingUp />12,5% <span>so với kỳ trước</span></p></article><article><span className="metric-icon metric-icon--orange"><ShoppingBag /></span><small>Đơn hàng mới</small><strong>{newOrders}</strong><p><TrendingUp />2 đơn <span>cần xác nhận</span></p></article><article><span className="metric-icon metric-icon--blue"><Package /></span><small>Sản phẩm đang bán</small><strong>{products.filter(p => p.status === 'active').length}</strong><p>{products.reduce((sum, p) => sum + p.stock, 0)} <span>máy trong kho</span></p></article><article><span className="metric-icon metric-icon--purple"><Users /></span><small>Khách hàng</small><strong>{orders.length}</strong><p><TrendingUp />8,2% <span>tăng trưởng</span></p></article></div>
    <div className="dashboard-grid"><section className="admin-panel chart-panel"><div className="panel-heading"><div><h2>Doanh thu</h2><p>Hiệu quả 7 ngày gần nhất</p></div><button>7 ngày <ChevronDown /></button></div><div className="fake-chart"><div className="chart-labels"><span>30tr</span><span>20tr</span><span>10tr</span><span>0</span></div><div className="chart-bars">{[42, 62, 48, 76, 58, 84, 70].map((height, index) => <div key={index}><span style={{ height: `${height}%` }} /><small>{['T2','T3','T4','T5','T6','T7','CN'][index]}</small></div>)}</div></div></section><section className="admin-panel inventory-panel"><div className="panel-heading"><div><h2>Tình trạng kho</h2><p>Cập nhật theo danh mục</p></div></div>{['Văn phòng','Mỏng nhẹ','Đồ họa','Gaming'].map(category => { const stock = products.filter(p => p.category === category).reduce((sum, p) => sum + p.stock, 0); return <div className="stock-row" key={category}><span>{category}</span><div><i style={{ width: `${Math.min(stock * 5, 100)}%` }} /></div><strong>{stock}</strong></div> })}</section></div>
    <section className="admin-panel"><div className="panel-heading panel-heading--padded"><div><h2>Đơn hàng gần đây</h2><p>Cập nhật ngay khi khách đặt hàng</p></div><button className="text-button" onClick={onOrders}>Xem tất cả <ArrowLeft className="rotate-180" /></button></div><div className="table-wrap"><table><thead><tr><th>Mã đơn</th><th>Khách hàng</th><th>Giá trị</th><th>Trạng thái</th><th>Thời gian</th></tr></thead><tbody>{latest.map(order => <tr key={order.id}><td><strong>#{order.id}</strong></td><td>{order.customer.name}<small className="cell-sub">{order.customer.phone}</small></td><td><strong>{money(order.total)}</strong></td><td><span className={`order-badge order-badge--${order.status}`}>{orderLabels[order.status]}</span></td><td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td></tr>)}</tbody></table></div></section>
  </>
}

function ProductModal({ product, onClose, onSave }: { product: Product | null; onClose: () => void; onSave: (product: Product) => void }) {
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const data = new FormData(event.currentTarget); onSave({ id: String(data.get('id')), name: String(data.get('name')), brand: String(data.get('brand')), category: String(data.get('category')) as Product['category'], cpu: String(data.get('cpu')), ram: String(data.get('ram')), storage: String(data.get('storage')), display: String(data.get('display')), gpu: String(data.get('gpu')), price: Number(data.get('price')), originalPrice: Number(data.get('originalPrice')) || undefined, stock: Number(data.get('stock')), status: String(data.get('status')) as ProductStatus, badge: String(data.get('badge')) || undefined, accent: product?.accent ?? '#7c98a8' }) }
  // The default ID is generated only while the add-product modal is mounted.
  // eslint-disable-next-line react-hooks/purity
  return <div className="modal-shell"><button className="modal-backdrop" onClick={onClose} aria-label="Đóng" /><form className="product-modal" onSubmit={submit}><div className="modal-title"><div><p className="eyebrow">SẢN PHẨM</p><h2>{product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2></div><button type="button" className="icon-button" onClick={onClose}><X /></button></div><div className="form-grid"><label>Mã sản phẩm<input name="id" required defaultValue={product?.id ?? `DP-${Date.now().toString().slice(-5)}`} readOnly={!!product} /></label><label>Tên sản phẩm<input name="name" required defaultValue={product?.name} /></label><label>Thương hiệu<input name="brand" required defaultValue={product?.brand} /></label><label>Phân loại<select name="category" defaultValue={product?.category ?? 'Văn phòng'}><option>Văn phòng</option><option>Mỏng nhẹ</option><option>Đồ họa</option><option>Gaming</option></select></label><label>CPU<input name="cpu" required defaultValue={product?.cpu} /></label><label>RAM<input name="ram" required defaultValue={product?.ram} /></label><label>Ổ cứng<input name="storage" required defaultValue={product?.storage} /></label><label>Màn hình<input name="display" required defaultValue={product?.display} /></label><label>GPU<input name="gpu" required defaultValue={product?.gpu} /></label><label>Nhãn nổi bật<input name="badge" defaultValue={product?.badge} placeholder="Bán chạy" /></label><label>Giá bán<input name="price" type="number" min="0" required defaultValue={product?.price} /></label><label>Giá niêm yết<input name="originalPrice" type="number" min="0" defaultValue={product?.originalPrice} /></label><label>Tồn kho<input name="stock" type="number" min="0" required defaultValue={product?.stock ?? 1} /></label><label>Trạng thái<select name="status" defaultValue={product?.status ?? 'active'}><option value="active">Đang bán</option><option value="draft">Bản nháp</option><option value="out-of-stock">Hết hàng</option></select></label></div><div className="modal-actions"><button type="button" className="button button--light" onClick={onClose}>Hủy</button><button className="button button--primary">Lưu sản phẩm</button></div></form></div>
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
      window.alert('Vui lòng chọn file ảnh logo.')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      window.alert('Logo nên dưới 2MB để website tải nhanh và lưu ổn định.')
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
    <PageTitle eyebrow="GIAO DIỆN WEBSITE" title="Nội dung & nhận diện" subtitle="Chỉnh logo và toàn bộ nội dung chính đang hiển thị ngoài cửa hàng." />
    <form className="settings-form settings-form--cms" onSubmit={submit}>
      <section className="admin-panel settings-card">
        <div className="settings-card__heading"><span>01</span><div><h2>Logo và thương hiệu</h2><p>Chọn mẫu logo sử dụng xuyên suốt website và trang quản trị.</p></div></div>
        <div className="settings-card__body">
          <div className="logo-manager">
            <div className="logo-manager__preview">
              <span>Xem trước logo đang dùng</span>
              <Logo variant={previewLogo} name={settings.storeName} slogan={settings.slogan} roundSrc={logoRoundSrc} wideSrc={logoWideSrc} />
            </div>
            <div className="logo-manager__controls">
              <div className="logo-style-toggle" role="radiogroup" aria-label="Chọn kiểu logo hiển thị">
                <label className={previewLogo === 'round' ? 'active' : ''}><input type="radio" name="logoStyle" value="round" checked={previewLogo === 'round'} onChange={() => setPreviewLogo('round')} /> Dùng logo tròn</label>
                <label className={previewLogo === 'wide' ? 'active' : ''}><input type="radio" name="logoStyle" value="wide" checked={previewLogo === 'wide'} onChange={() => setPreviewLogo('wide')} /> Dùng logo dài</label>
              </div>
              <div className="logo-upload-row">
                <div><strong>Logo tròn</strong><small>Nên dùng ảnh vuông PNG/WebP.</small></div>
                <span className="logo-upload-button">Chọn ảnh<input className="logo-file-input" type="file" accept="image/*" onChange={event => uploadLogo(event, 'round')} /></span>
                <button type="button" onClick={() => setLogoRoundSrc('/dp-lab-logo.png')}>Mặc định</button>
              </div>
              <div className="logo-upload-row">
                <div><strong>Logo dài</strong><small>Nên dùng ảnh ngang, nền trong suốt hoặc trắng.</small></div>
                <span className="logo-upload-button">Chọn ảnh<input className="logo-file-input" type="file" accept="image/*" onChange={event => uploadLogo(event, 'wide')} /></span>
                <button type="button" onClick={() => setLogoWideSrc('/dtpt-techs-logo.png')}>Mặc định</button>
              </div>
            </div>
          </div>
          <div className="form-grid settings-fields"><label>Tên cửa hàng<input name="storeName" defaultValue={settings.storeName} /></label><label>Khẩu hiệu<input name="slogan" defaultValue={settings.slogan} /></label><label>Số điện thoại<input name="phone" defaultValue={settings.phone} /></label><label>Email<input name="email" defaultValue={settings.email} /></label><label className="form-span">Địa chỉ<textarea name="address" rows={3} defaultValue={settings.address} /></label><label className="form-span">Facebook<input name="facebook" defaultValue={settings.facebook} /></label></div>
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
        <ContentInput name="service1Title" label="Dịch vụ 1 — tiêu đề" value={settings.content.service1Title} /><ContentInput name="service1Description" label="Dịch vụ 1 — mô tả" value={settings.content.service1Description} />
        <ContentInput name="service2Title" label="Dịch vụ 2 — tiêu đề" value={settings.content.service2Title} /><ContentInput name="service2Description" label="Dịch vụ 2 — mô tả" value={settings.content.service2Description} />
        <ContentInput name="service3Title" label="Dịch vụ 3 — tiêu đề" value={settings.content.service3Title} /><ContentInput name="service3Description" label="Dịch vụ 3 — mô tả" value={settings.content.service3Description} />
        <ContentInput name="service4Title" label="Dịch vụ 4 — tiêu đề" value={settings.content.service4Title} /><ContentInput name="service4Description" label="Dịch vụ 4 — mô tả" value={settings.content.service4Description} />
      </ContentSection>

      <ContentSection number="05" title="Khu vực sản phẩm" description="Tiêu đề và lời dẫn phía trên danh sách laptop.">
        <ContentInput name="productsEyebrow" label="Nhãn mục" value={settings.content.productsEyebrow} />
        <ContentInput name="productsTitle" label="Tiêu đề" value={settings.content.productsTitle} />
        <ContentInput name="productsDescription" label="Mô tả" value={settings.content.productsDescription} multiline wide />
      </ContentSection>

      <ContentSection number="06" title="Vì sao chọn DP Lab" description="Thông điệp thương hiệu và bốn điểm thuyết phục khách hàng.">
        <ContentInput name="whyEyebrow" label="Nhãn mục" value={settings.content.whyEyebrow} /><ContentInput name="whyTitle" label="Tiêu đề" value={settings.content.whyTitle} />
        <ContentInput name="whyDescription" label="Đoạn giới thiệu" value={settings.content.whyDescription} multiline wide />
        <ContentInput name="why1Title" label="Lý do 1 — tiêu đề" value={settings.content.why1Title} /><ContentInput name="why1Description" label="Lý do 1 — mô tả" value={settings.content.why1Description} multiline />
        <ContentInput name="why2Title" label="Lý do 2 — tiêu đề" value={settings.content.why2Title} /><ContentInput name="why2Description" label="Lý do 2 — mô tả" value={settings.content.why2Description} multiline />
        <ContentInput name="why3Title" label="Lý do 3 — tiêu đề" value={settings.content.why3Title} /><ContentInput name="why3Description" label="Lý do 3 — mô tả" value={settings.content.why3Description} multiline />
        <ContentInput name="why4Title" label="Lý do 4 — tiêu đề" value={settings.content.why4Title} /><ContentInput name="why4Description" label="Lý do 4 — mô tả" value={settings.content.why4Description} multiline />
      </ContentSection>

      <ContentSection number="07" title="Kêu gọi liên hệ & footer" description="Khối gọi điện cuối trang và lời giới thiệu trong footer.">
        <ContentInput name="contactEyebrow" label="Nhãn liên hệ" value={settings.content.contactEyebrow} />
        <ContentInput name="contactTitle" label="Tiêu đề liên hệ" value={settings.content.contactTitle} />
        <ContentInput name="contactSubtitle" label="Dòng phụ liên hệ" value={settings.content.contactSubtitle} />
        <ContentInput name="footerDescription" label="Giới thiệu ở footer" value={settings.content.footerDescription} multiline wide />
      </ContentSection>

      <div className="settings-actions settings-actions--sticky"><button type="button" className="button button--light" onClick={() => window.confirm('Khôi phục toàn bộ dữ liệu demo ban đầu?') && resetDemo()}><RefreshCcw />Khôi phục mặc định</button><div><span>Mọi thay đổi sẽ áp dụng ngay ngoài website.</span><button className={`button button--primary ${saved ? 'button--success' : ''}`}>{saved ? 'Đã lưu thay đổi' : 'Lưu toàn bộ thay đổi'}</button></div></div>
    </form>
  </>
}

function ContentSection({ number, title, description, children }: { number: string; title: string; description: string; children: React.ReactNode }) {
  return <section className="admin-panel settings-card"><div className="settings-card__heading"><span>{number}</span><div><h2>{title}</h2><p>{description}</p></div></div><div className="settings-card__body settings-content-grid">{children}</div></section>
}

function ContentInput({ name, label, value, multiline = false, wide = false }: { name: keyof SiteContent; label: string; value: string; multiline?: boolean; wide?: boolean }) {
  return <label className={wide ? 'form-span' : ''}>{label}{multiline ? <textarea name={name} rows={3} defaultValue={value} /> : <input name={name} defaultValue={value} />}</label>
}
