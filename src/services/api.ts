import type { AdminUser, Order, Product, StoreSettings } from '../types'

const rawApiUrl = import.meta.env.VITE_API_URL as string | undefined
const API_URL = rawApiUrl?.replace(/\/$/, '')

const ADMIN_SESSION_KEY = 'dplab_admin_session'

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
  bootstrap: () => request<{ products: Product[]; orders: Order[]; settings: StoreSettings }>('/api/bootstrap', { admin: true }),
  saveProduct: (product: Product) => request<Product>(`/api/products/${encodeURIComponent(product.id)}`, { method: 'PUT', admin: true, body: JSON.stringify(product) }),
  deleteProduct: (id: string) => request<void>(`/api/products/${encodeURIComponent(id)}`, { method: 'DELETE', admin: true }),
  createOrder: (order: Order) => request<Order>('/api/orders', { method: 'POST', body: JSON.stringify(order) }),
  updateOrderStatus: (id: string, status: Order['status']) => request<Order>(`/api/orders/${encodeURIComponent(id)}/status`, { method: 'PATCH', admin: true, body: JSON.stringify({ status }) }),
  updateSettings: (settings: StoreSettings) => request<StoreSettings>('/api/settings', { method: 'PUT', admin: true, body: JSON.stringify(settings) }),
  resetDemo: () => request<{ products: Product[]; orders: Order[]; settings: StoreSettings }>('/api/reset-demo', { method: 'POST', admin: true }),
}
