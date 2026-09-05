import { FileText, FolderTree, LayoutDashboard, LogOut, Package, Palette, UserCog, Users } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { api } from '../services/api'
import { useStore } from '../store/StoreContext'
import type { QuoteStatus } from '../types'
import { CategoriesPanel, ContentPanel, DisplayPanel, BrandingPanel } from './admin/SettingsPanels'
import { ProductsPanel } from './admin/ProductsPanel'
import { AccountsPanel } from './admin/AccountsPanel'
import type { AdminPermission } from '../types'

type AdminTab = 'quotes' | 'products' | 'categories' | 'branding' | 'content' | 'display' | 'accounts'
const titles: Record<AdminTab, string> = { quotes: 'Yêu cầu báo giá', products: 'Danh mục sản phẩm', categories: 'Ngành hàng & phân loại', branding: 'Thương hiệu & liên hệ', content: 'Nội dung website', display: 'Giao diện & hiển thị', accounts: 'Tài khoản & phân quyền' }

export function AdminPage({ navigate }: { navigate: (path: string) => void }) {
  const store = useStore(); const [session, setSession] = useState(api.getAdminSession()); const [tab, setTab] = useState<AdminTab>('quotes'); const [error, setError] = useState('')
  const sessionToken = session?.token
  useEffect(() => { if (sessionToken) api.getAdminProfile().then(user => { const next = { token: sessionToken, user }; api.saveAdminSession(next); setSession(next) }).catch(() => { api.logoutAdmin(); setSession(null) }) }, [sessionToken])
  const login = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setError(''); const data = new FormData(event.currentTarget); try { const next = await api.loginAdmin(String(data.get('username')), String(data.get('password'))); setSession(next); location.reload() } catch (reason) { setError(reason instanceof Error ? reason.message : 'Đăng nhập thất bại') } }
  if (!session) return <main className="admin-login"><form onSubmit={login}><img src={store.settings.logoWideSrc} alt={store.settings.storeName} /><h1>Quản trị hệ thống</h1><p>Đăng nhập để quản lý catalogue và toàn bộ nội dung website.</p><label>Tên đăng nhập<input name="username" autoComplete="username" required /></label><label>Mật khẩu<input name="password" type="password" autoComplete="current-password" required /></label>{error && <p className="form-error">{error}</p>}<button className="primary-button">Đăng nhập</button><button type="button" className="text-button" onClick={() => navigate('/')}>Về trang chủ</button></form></main>
  const has = (permission: AdminPermission) => session.user.isRoot || session.user.role === 'owner' || session.user.permissions.includes(permission)
  const nav: Array<[AdminTab, typeof Users, string, AdminPermission]> = [['quotes', Users, 'Yêu cầu báo giá', 'quotes.view'], ['products', Package, 'Sản phẩm', 'products.manage'], ['categories', FolderTree, 'Phân loại', 'categories.manage'], ['branding', Palette, 'Thương hiệu', 'branding.manage'], ['content', FileText, 'Nội dung', 'content.manage'], ['display', LayoutDashboard, 'Giao diện', 'display.manage'], ['accounts', UserCog, 'Tài khoản', 'users.manage']]
  const allowedNav = nav.filter(([, , , permission]) => has(permission)); const activeTab = allowedNav.some(([id]) => id === tab) ? tab : allowedNav[0]?.[0]
  if (!activeTab) return <main className="admin-login"><div className="admin-no-access"><h1>Chưa được cấp quyền</h1><p>Tài khoản đang hoạt động nhưng chưa có quyền truy cập khu vực quản trị.</p><button className="primary-button" onClick={() => { api.logoutAdmin(); setSession(null) }}>Đăng xuất</button></div></main>
  return <main className="admin"><aside><img src={store.settings.logoWideSrc} alt={store.settings.storeName} /><span className="admin-user"><b>{session.user.displayName}</b><small>@{session.user.username}</small></span>{allowedNav.map(([id, Icon, label]) => <button key={id} className={activeTab === id ? 'active' : ''} onClick={() => setTab(id)}><Icon />{label}</button>)}<button onClick={() => { api.logoutAdmin(); setSession(null) }}><LogOut />Đăng xuất</button></aside><section><div className="admin-title"><div><span className="eyebrow">DTPT CONTROL CENTER</span><h1>{titles[activeTab]}</h1></div><button className="secondary-button" onClick={() => navigate('/')}>Xem website</button></div>{activeTab === 'quotes' && <QuotesPanel canManage={has('quotes.manage')} />}{activeTab === 'products' && <ProductsPanel />}{activeTab === 'categories' && <CategoriesPanel />}{activeTab === 'branding' && <BrandingPanel />}{activeTab === 'content' && <ContentPanel />}{activeTab === 'display' && <DisplayPanel />}{activeTab === 'accounts' && <AccountsPanel currentUser={session.user} />}</section></main>
}

function QuotesPanel({ canManage }: { canManage: boolean }) {
  const { quotes, updateQuoteStatus } = useStore(); const statuses: QuoteStatus[] = ['new', 'reviewing', 'quoted', 'won', 'closed']
  if (!quotes.length) return <div className="empty-results"><h2>Chưa có yêu cầu mới</h2><p>Các RFQ gửi từ website sẽ xuất hiện tại đây.</p></div>
  return <div className="admin-table">{quotes.map(quote => <article key={quote.id}><div><strong>{quote.customer.company}</strong><span>{quote.customer.name} · {quote.customer.phone}</span><small>{quote.id} · {new Date(quote.createdAt).toLocaleString('vi-VN')}</small></div><div><b>{quote.items.length} sản phẩm</b><p>{quote.customer.note}</p></div><select aria-label={`Trạng thái ${quote.id}`} value={quote.status} disabled={!canManage} onChange={event => updateQuoteStatus(quote.id, event.target.value as QuoteStatus)}>{statuses.map(status => <option key={status}>{status}</option>)}</select></article>)}</div>
}
