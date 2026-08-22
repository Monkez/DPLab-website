import { FileText, FolderTree, LayoutDashboard, LogOut, Package, Palette, Users } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { api } from '../services/api'
import { useStore } from '../store/StoreContext'
import type { QuoteStatus } from '../types'
import { CategoriesPanel, ContentPanel, DisplayPanel, BrandingPanel } from './admin/SettingsPanels'
import { ProductsPanel } from './admin/ProductsPanel'

type AdminTab = 'quotes' | 'products' | 'categories' | 'branding' | 'content' | 'display'
const titles: Record<AdminTab, string> = { quotes: 'Yêu cầu báo giá', products: 'Danh mục sản phẩm', categories: 'Ngành hàng & phân loại', branding: 'Thương hiệu & liên hệ', content: 'Nội dung website', display: 'Giao diện & hiển thị' }

export function AdminPage({ navigate }: { navigate: (path: string) => void }) {
  const store = useStore(); const [session, setSession] = useState(api.getAdminSession()); const [tab, setTab] = useState<AdminTab>('quotes'); const [error, setError] = useState('')
  const login = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setError(''); const data = new FormData(event.currentTarget); try { const next = await api.loginAdmin(String(data.get('username')), String(data.get('password'))); setSession(next); location.reload() } catch (reason) { setError(reason instanceof Error ? reason.message : 'Đăng nhập thất bại') } }
  if (!session) return <main className="admin-login"><form onSubmit={login}><img src={store.settings.logoWideSrc} alt={store.settings.storeName} /><h1>Quản trị hệ thống</h1><p>Đăng nhập để quản lý catalogue và toàn bộ nội dung website.</p><label>Tên đăng nhập<input name="username" autoComplete="username" required /></label><label>Mật khẩu<input name="password" type="password" autoComplete="current-password" required /></label>{error && <p className="form-error">{error}</p>}<button className="primary-button">Đăng nhập</button><button type="button" className="text-button" onClick={() => navigate('/')}>Về trang chủ</button></form></main>
  const nav: Array<[AdminTab, typeof Users, string]> = [['quotes', Users, 'Yêu cầu báo giá'], ['products', Package, 'Sản phẩm'], ['categories', FolderTree, 'Phân loại'], ['branding', Palette, 'Thương hiệu'], ['content', FileText, 'Nội dung'], ['display', LayoutDashboard, 'Giao diện']]
  return <main className="admin"><aside><img src={store.settings.logoWideSrc} alt={store.settings.storeName} /><span className="admin-user">{session.user.displayName}</span>{nav.map(([id, Icon, label]) => <button key={id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)}><Icon />{label}</button>)}<button onClick={() => { api.logoutAdmin(); setSession(null) }}><LogOut />Đăng xuất</button></aside><section><div className="admin-title"><div><span className="eyebrow">DTPT CONTROL CENTER</span><h1>{titles[tab]}</h1></div><button className="secondary-button" onClick={() => navigate('/')}>Xem website</button></div>{tab === 'quotes' && <QuotesPanel />}{tab === 'products' && <ProductsPanel />}{tab === 'categories' && <CategoriesPanel />}{tab === 'branding' && <BrandingPanel />}{tab === 'content' && <ContentPanel />}{tab === 'display' && <DisplayPanel />}</section></main>
}

function QuotesPanel() {
  const { quotes, updateQuoteStatus } = useStore(); const statuses: QuoteStatus[] = ['new', 'reviewing', 'quoted', 'won', 'closed']
  if (!quotes.length) return <div className="empty-results"><h2>Chưa có yêu cầu mới</h2><p>Các RFQ gửi từ website sẽ xuất hiện tại đây.</p></div>
  return <div className="admin-table">{quotes.map(quote => <article key={quote.id}><div><strong>{quote.customer.company}</strong><span>{quote.customer.name} · {quote.customer.phone}</span><small>{quote.id} · {new Date(quote.createdAt).toLocaleString('vi-VN')}</small></div><div><b>{quote.items.length} sản phẩm</b><p>{quote.customer.note}</p></div><select aria-label={`Trạng thái ${quote.id}`} value={quote.status} onChange={event => updateQuoteStatus(quote.id, event.target.value as QuoteStatus)}>{statuses.map(status => <option key={status}>{status}</option>)}</select></article>)}</div>
}
