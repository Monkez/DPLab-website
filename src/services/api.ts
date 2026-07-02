import type { AdminUser, AnalyticsDevice, AnalyticsEvent, Order, Product, StoreSettings } from '../types'

const rawApiUrl = import.meta.env.VITE_API_URL as string | undefined
const API_URL = rawApiUrl?.replace(/\/$/, '')

const ADMIN_SESSION_KEY = 'dplab_admin_session'
const ANALYTICS_VISITOR_KEY = 'dtpt_analytics_visitor'
const ANALYTICS_SESSION_KEY = 'dtpt_analytics_session'
const ANALYTICS_LOCAL_KEY = 'dtpt_analytics_events'

const createId = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`

function getAnalyticsIdentity() {
  let visitorId = localStorage.getItem(ANALYTICS_VISITOR_KEY)
  if (!visitorId) {
    visitorId = createId()
    localStorage.setItem(ANALYTICS_VISITOR_KEY, visitorId)
  }
  let sessionId = sessionStorage.getItem(ANALYTICS_SESSION_KEY)
  if (!sessionId) {
    sessionId = createId()
    sessionStorage.setItem(ANALYTICS_SESSION_KEY, sessionId)
  }
  return { visitorId, sessionId }
}

function detectDevice(): AnalyticsDevice {
  if (window.innerWidth < 768) return 'mobile'
  if (window.innerWidth < 1100) return 'tablet'
  return 'desktop'
}

function saveLocalAnalyticsEvent(event: AnalyticsEvent) {
  try {
    const stored = JSON.parse(localStorage.getItem(ANALYTICS_LOCAL_KEY) || '[]') as AnalyticsEvent[]
    localStorage.setItem(ANALYTICS_LOCAL_KEY, JSON.stringify([...stored.slice(-1999), event]))
  } catch {
    localStorage.setItem(ANALYTICS_LOCAL_KEY, JSON.stringify([event]))
  }
}

function getLocalAnalyticsEvents(days: number) {
  const threshold = Date.now() - days * 2 * 86400000
  try {
    return (JSON.parse(localStorage.getItem(ANALYTICS_LOCAL_KEY) || '[]') as AnalyticsEvent[])
      .filter(event => new Date(event.createdAt).getTime() >= threshold)
  } catch {
    return []
  }
}

export interface AdminSession {
  token: string
  user: AdminUser
}

function getAdminSession(): AdminSession | null {
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY)
    return raw ? JSON.parse(raw) as AdminSession : null
  } catch {
    return null
  }
}

function saveAdminSession(session: AdminSession | null) {
  if (session) localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session))
  else localStorage.removeItem(ADMIN_SESSION_KEY)
}

async function request<T>(path: string, options?: RequestInit & { admin?: boolean }): Promise<T> {
  if (!API_URL) throw new Error('VITE_API_URL is not configured')
  const session = getAdminSession()
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.admin && session?.token ? { Authorization: `Bearer ${session.token}` } : {}),
      ...(options?.headers ?? {}),
    },
  })
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { message?: string } | null
    throw new Error(body?.message || `API request failed: ${response.status}`)
  }
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export const api = {
  enabled: Boolean(API_URL),
  getAdminSession,
  saveAdminSession,
  logoutAdmin: () => saveAdminSession(null),
  loginAdmin: async (username: string, password: string) => {
    const session = await request<AdminSession>('/api/admin/login', { method: 'POST', body: JSON.stringify({ username, password }) })
    saveAdminSession(session)
    return session
  },
  listAdminUsers: () => request<AdminUser[]>('/api/admin/users', { admin: true }),
  createAdminUser: (user: { username: string; password: string; displayName: string }) => request<AdminUser>('/api/admin/users', { method: 'POST', admin: true, body: JSON.stringify(user) }),
  deleteAdminUser: (username: string) => request<void>(`/api/admin/users/${encodeURIComponent(username)}`, { method: 'DELETE', admin: true }),
  trackPageView: async (path: string, productId?: string) => {
    const identity = getAnalyticsIdentity()
    const event: AnalyticsEvent = {
      eventId: createId(),
      ...identity,
      eventType: 'page_view',
      path,
      productId,
      referrer: document.referrer ? new URL(document.referrer).hostname : 'Trực tiếp',
      device: detectDevice(),
      createdAt: new Date().toISOString(),
    }
    saveLocalAnalyticsEvent(event)
    if (API_URL) await request<void>('/api/analytics/events', { method: 'POST', body: JSON.stringify(event), keepalive: true })
  },
  getAnalyticsEvents: (days: number) => API_URL
    ? request<AnalyticsEvent[]>(`/api/admin/analytics?days=${days}`, { admin: true })
    : Promise.resolve(getLocalAnalyticsEvents(days)),
  bootstrap: () => request<{ products: Product[]; orders: Order[]; settings: StoreSettings }>('/api/bootstrap', { admin: true }),
  saveProduct: (product: Product) => request<Product>(`/api/products/${encodeURIComponent(product.id)}`, { method: 'PUT', admin: true, body: JSON.stringify(product) }),
  deleteProduct: (id: string) => request<void>(`/api/products/${encodeURIComponent(id)}`, { method: 'DELETE', admin: true }),
  createOrder: (order: Order) => request<Order>('/api/orders', { method: 'POST', body: JSON.stringify(order) }),
  updateOrderStatus: (id: string, status: Order['status']) => request<Order>(`/api/orders/${encodeURIComponent(id)}/status`, { method: 'PATCH', admin: true, body: JSON.stringify({ status }) }),
  updateSettings: (settings: StoreSettings) => request<StoreSettings>('/api/settings', { method: 'PUT', admin: true, body: JSON.stringify(settings) }),
  resetDemo: () => request<{ products: Product[]; orders: Order[]; settings: StoreSettings }>('/api/reset-demo', { method: 'POST', admin: true }),
}
