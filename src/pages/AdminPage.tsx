import { quoteLineKey, quoteItemLabel } from '../../backend/src/productVariants.js'
import { BarChart3, FileText, FolderTree, LayoutDashboard, LogOut, Newspaper, Package, Palette, UserCog, Users } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { api } from '../services/api'
import { useStore } from '../store/StoreContext'
import type { AdminPermission, QuoteStatus } from '../types'
import { formatDateTime } from '../utils/dateFormat'
import { formatMoney } from '../utils/cart'
import { AccountsPanel } from './admin/AccountsPanel'
import { AnalyticsPanel } from './admin/AnalyticsPanel'
import { ArticlesPanel } from './admin/ArticlesPanel'
import { ProductsPanel } from './admin/ProductsPanel'
import { BrandingPanel, CategoriesPanel, ContentPanel, DisplayPanel } from './admin/SettingsPanels'

type AdminTab = 'analytics' | 'quotes' | 'products' | 'articles' | 'categories' | 'branding' | 'content' | 'display' | 'accounts'
const titles: Record<AdminTab, string> = {
  analytics: 'Lưu lượng truy cập', quotes: 'Báo giá & đơn hàng', products: 'Danh mục sản phẩm', articles: 'Tin tức & bài viết', categories: 'Ngành hàng & phân loại', branding: 'Thương hiệu & liên hệ', content: 'Nội dung website', display: 'Giao diện & hiển thị', accounts: 'Tài khoản & phân quyền',
}

export function AdminPage({ navigate }: { navigate: (path: string) => void }) {
  const store = useStore(); const [session, setSession] = useState(api.getAdminSession()); const [tab, setTab] = useState<AdminTab>('analytics'); const [error, setError] = useState('')
  const loginPending = useRef(false); const [loggingIn, setLoggingIn] = useState(false)
  const sessionToken = session?.token
  useEffect(() => {
    let cancelled = false
    if (sessionToken) api.getAdminProfile().then(user => {
      if (cancelled || api.getAdminSession()?.token !== sessionToken) return
      const next = { token: sessionToken, user }; api.saveAdminSession(next); setSession(next)
    }).catch(reason => {
      if (cancelled) return
      if (!api.getAdminSession()) setSession(null); else setError(reason instanceof Error ? reason.message : 'Không xác minh được phiên đăng nhập')
    })
    return () => { cancelled = true }
  }, [sessionToken])
  const logout = () => { api.logoutAdmin(); setSession(null); setError('') }
  const login = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); if (loginPending.current) return; loginPending.current = true; setLoggingIn(true); setError(''); const data = new FormData(event.currentTarget); try { const next = await api.loginAdmin(String(data.get('username')), String(data.get('password'))); await store.refreshData(true); setSession(next) } catch (reason) { setError(reason instanceof Error ? reason.message : 'Đăng nhập thất bại') } finally { loginPending.current = false; setLoggingIn(false) } }
  const submitOnEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter' || event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229) return
    event.preventDefault()
    if (!event.repeat && !loginPending.current) event.currentTarget.form?.requestSubmit()
  }
  if (!session) return <main className="admin-login"><form onSubmit={login} aria-busy={loggingIn}><img src={store.settings.logoWideSrc} alt={store.settings.storeName} /><h1>Quản trị hệ thống</h1><p>Đăng nhập để quản lý catalogue và toàn bộ nội dung website.</p><label>Tên đăng nhập<input name="username" autoComplete="username" onKeyDown={submitOnEnter} enterKeyHint="go" required /></label><label>Mật khẩu<input name="password" type="password" autoComplete="current-password" onKeyDown={submitOnEnter} enterKeyHint="go" required /></label>{error && <p className="form-error">{error}</p>}<button type="submit" className="primary-button" disabled={loggingIn}>{loggingIn ? 'Đang đăng nhập…' : 'Đăng nhập'}</button><button type="button" className="text-button" onClick={() => navigate('/')}>Về trang chủ</button></form></main>
  const has = (permission: AdminPermission) => session.user.isRoot || session.user.role === 'owner' || session.user.permissions.includes(permission)
  const nav: Array<[AdminTab, typeof Users, string, AdminPermission]> = [
    ['analytics', BarChart3, 'Lưu lượng', 'analytics.view'], ['quotes', Users, 'Báo giá & đơn hàng', 'quotes.view'], ['products', Package, 'Sản phẩm', 'products.manage'], ['articles', Newspaper, 'Tin tức', 'articles.manage'], ['categories', FolderTree, 'Phân loại', 'categories.manage'], ['branding', Palette, 'Thương hiệu', 'branding.manage'], ['content', FileText, 'Nội dung', 'content.manage'], ['display', LayoutDashboard, 'Giao diện', 'display.manage'], ['accounts', UserCog, 'Tài khoản', 'users.manage'],
  ]
  const allowedNav = nav.filter(([, , , permission]) => has(permission)); const activeTab = allowedNav.some(([id]) => id === tab) ? tab : allowedNav[0]?.[0]
  if (!activeTab) return <main className="admin-login"><div className="admin-no-access"><h1>Chưa được cấp quyền</h1><p>Tài khoản đang hoạt động nhưng chưa có quyền truy cập khu vực quản trị.</p><button className="primary-button" onClick={logout}>Đăng xuất</button></div></main>
  return <main className="admin"><aside><img src={store.settings.logoWideSrc} alt={store.settings.storeName} /><span className="admin-user"><b>{session.user.displayName}</b><small>@{session.user.username}</small></span>{allowedNav.map(([id, Icon, label]) => <button key={id} className={activeTab === id ? 'active' : ''} onClick={() => setTab(id)}><Icon />{label}</button>)}<button onClick={logout}><LogOut />Đăng xuất</button></aside><section><div className="admin-title"><div><span className="eyebrow">DTPT CONTROL CENTER</span><h1>{titles[activeTab]}</h1></div><div className="admin-session-actions"><button className="secondary-button" onClick={() => navigate('/')}>Xem website</button><button className="admin-logout-button" onClick={logout}><LogOut size={18} />Đăng xuất</button></div></div>{activeTab === 'analytics' && <AnalyticsPanel canClear={session.user.isRoot || session.user.role === 'owner'} />}{activeTab === 'quotes' && <QuotesPanel canManage={has('quotes.manage')} />}{activeTab === 'products' && <ProductsPanel />}{activeTab === 'articles' && <ArticlesPanel />}{activeTab === 'categories' && <CategoriesPanel />}{activeTab === 'branding' && <BrandingPanel />}{activeTab === 'content' && <ContentPanel />}{activeTab === 'display' && <DisplayPanel />}{activeTab === 'accounts' && <AccountsPanel currentUser={session.user} />}</section></main>
}

function QuotesPanel({ canManage }: { canManage: boolean }) {
  const { quotes, products, updateQuoteStatus } = useStore(); const statuses: QuoteStatus[] = ['new', 'reviewing', 'quoted', 'won', 'closed']
  if (!quotes.length) return <div className="empty-results"><h2>Chưa có yêu cầu mới</h2><p>Yêu cầu báo giá và đơn hàng gửi từ website sẽ xuất hiện tại đây.</p></div>
  return <div className="admin-table">{quotes.map(quote => <article key={quote.id}><div><strong>{quote.requestType === 'order' ? 'Đơn hàng' : 'Yêu cầu báo giá'}</strong>{quote.customer.company && <b>{quote.customer.company}</b>}<span>{quote.customer.name} · {quote.customer.phone}</span>{quote.customer.email && <span>{quote.customer.email}</span>}{quote.customer.address && <p><b>Địa chỉ giao hàng:</b> {quote.customer.address}</p>}<small>{quote.id} · {formatDateTime(quote.createdAt)}</small></div><div><b>{quote.items.length} cấu hình</b><ul>{quote.items.map((item, index) => <li key={quoteLineKey(item) + index}>{item.productName || products.find(p => p.id === item.productId)?.name || item.productId} — {quoteItemLabel(products, item)} × {item.quantity}{quote.requestType === 'order' && <small> · {item.unitPrice === undefined ? 'Cần xác nhận giá' : formatMoney(item.unitPrice) + ' / sản phẩm'}</small>}</li>)}</ul><p>{quote.customer.note}</p>{quote.requestType === 'order' && <p>Giá chưa bao gồm phí ship. Liên hệ khách để xác nhận giá, phí giao hàng và lịch giao.</p>}</div><select aria-label={`Trạng thái ${quote.id}`} value={quote.status} disabled={!canManage} onChange={event => updateQuoteStatus(quote.id, event.target.value as QuoteStatus)}>{statuses.map(status => <option key={status}>{status}</option>)}</select></article>)}</div>
}
