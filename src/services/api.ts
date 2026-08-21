import type { AdminUser, AnalyticsDevice, AnalyticsEvent, Product, QuoteRequest, StoreSettings } from '../types'

const API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '')
const ADMIN_SESSION_KEY = 'dtpt_industrial_admin_session'
const createId = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`

export interface AdminSession { token: string; user: AdminUser }
function getAdminSession(): AdminSession | null {
  try { const raw = localStorage.getItem(ADMIN_SESSION_KEY); return raw ? JSON.parse(raw) as AdminSession : null } catch { return null }
}
function saveAdminSession(session: AdminSession | null) {
  if (session) localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session)); else localStorage.removeItem(ADMIN_SESSION_KEY)
}
async function request<T>(path: string, options?: RequestInit & { admin?: boolean }): Promise<T> {
  if (!API_URL) throw new Error('VITE_API_URL is not configured')
  const session = getAdminSession()
  const response = await fetch(`${API_URL}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(options?.admin && session?.token ? { Authorization: `Bearer ${session.token}` } : {}), ...(options?.headers ?? {}) } })
  if (!response.ok) {
    if (response.status === 401 && options?.admin) saveAdminSession(null)
    const body = await response.json().catch(() => null) as { message?: string } | null
    throw new Error(body?.message || `API request failed: ${response.status}`)
  }
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}
function device(): AnalyticsDevice { return innerWidth < 768 ? 'mobile' : innerWidth < 1100 ? 'tablet' : 'desktop' }

export const api = {
  enabled: Boolean(API_URL), getAdminSession, saveAdminSession, logoutAdmin: () => saveAdminSession(null),
  loginAdmin: async (username: string, password: string) => { const session = await request<AdminSession>('/api/admin/login', { method: 'POST', body: JSON.stringify({ username, password }) }); saveAdminSession(session); return session },
  bootstrap: (admin = false) => request<{ products: Product[]; quotes: QuoteRequest[]; settings: StoreSettings }>('/api/bootstrap', admin ? { admin: true } : undefined),
  createQuote: (payload: Pick<QuoteRequest, 'customer' | 'items'>) => request<QuoteRequest>('/api/quotes', { method: 'POST', body: JSON.stringify(payload) }),
  saveProduct: (product: Product) => request<Product>(`/api/products/${encodeURIComponent(product.id)}`, { method: 'PUT', admin: true, body: JSON.stringify(product) }),
  deleteProduct: (id: string) => request<void>(`/api/products/${encodeURIComponent(id)}`, { method: 'DELETE', admin: true }),
  updateQuoteStatus: (id: string, status: QuoteRequest['status']) => request<QuoteRequest>(`/api/quotes/${encodeURIComponent(id)}/status`, { method: 'PATCH', admin: true, body: JSON.stringify({ status }) }),
  updateSettings: (settings: StoreSettings) => request<StoreSettings>('/api/settings', { method: 'PUT', admin: true, body: JSON.stringify(settings) }),
  trackPageView: async (path: string, productId?: string) => {
    if (!API_URL) return
    const visitorId = localStorage.getItem('dtpt_visitor') || createId(); localStorage.setItem('dtpt_visitor', visitorId)
    const sessionId = sessionStorage.getItem('dtpt_session') || createId(); sessionStorage.setItem('dtpt_session', sessionId)
    const event: AnalyticsEvent = { eventId: createId(), visitorId, sessionId, eventType: 'page_view', path, productId, referrer: document.referrer || 'Trực tiếp', device: device(), createdAt: new Date().toISOString() }
    await request<void>('/api/analytics/events', { method: 'POST', body: JSON.stringify(event), keepalive: true })
  },
}
