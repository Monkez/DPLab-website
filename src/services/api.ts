import type { Order, Product, StoreSettings } from '../types'

const rawApiUrl = import.meta.env.VITE_API_URL as string | undefined
const API_URL = rawApiUrl?.replace(/\/$/, '')

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  if (!API_URL) throw new Error('VITE_API_URL is not configured')
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options?.headers ?? {}) },
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
  bootstrap: () => request<{ products: Product[]; orders: Order[]; settings: StoreSettings }>('/api/bootstrap'),
  saveProduct: (product: Product) => request<Product>(`/api/products/${encodeURIComponent(product.id)}`, { method: 'PUT', body: JSON.stringify(product) }),
  deleteProduct: (id: string) => request<void>(`/api/products/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  createOrder: (order: Order) => request<Order>('/api/orders', { method: 'POST', body: JSON.stringify(order) }),
  updateOrderStatus: (id: string, status: Order['status']) => request<Order>(`/api/orders/${encodeURIComponent(id)}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  updateSettings: (settings: StoreSettings) => request<StoreSettings>('/api/settings', { method: 'PUT', body: JSON.stringify(settings) }),
  resetDemo: () => request<{ products: Product[]; orders: Order[]; settings: StoreSettings }>('/api/reset-demo', { method: 'POST' }),
}
