import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { seedOrders, seedProducts, seedSettings } from '../data/seed'
import type { CartItem, CustomerInfo, Order, OrderStatus, Product, StoreSettings } from '../types'

const readStorage = <T,>(key: string, fallback: T): T => {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback }
  catch { return fallback }
}

const readSettings = (): StoreSettings => {
  const saved = readStorage<Partial<StoreSettings>>('dplab_settings', {})
  return { ...seedSettings, ...saved, content: { ...seedSettings.content, ...(saved.content ?? {}) } }
}

interface StoreContextValue {
  products: Product[]
  orders: Order[]
  cart: CartItem[]
  settings: StoreSettings
  cartCount: number
  cartTotal: number
  addToCart: (productId: string) => void
  updateCartQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  createOrder: (customer: CustomerInfo) => Order
  saveProduct: (product: Product) => void
  deleteProduct: (id: string) => void
  updateOrderStatus: (id: string, status: OrderStatus) => void
  updateSettings: (settings: StoreSettings) => void
  resetDemo: () => void
}

const StoreContext = createContext<StoreContextValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => readStorage('dplab_products', seedProducts))
  const [orders, setOrders] = useState<Order[]>(() => readStorage('dplab_orders', seedOrders))
  const [cart, setCart] = useState<CartItem[]>(() => readStorage('dplab_cart', []))
  const [settings, setSettings] = useState<StoreSettings>(readSettings)

  useEffect(() => localStorage.setItem('dplab_products', JSON.stringify(products)), [products])
  useEffect(() => localStorage.setItem('dplab_orders', JSON.stringify(orders)), [orders])
  useEffect(() => localStorage.setItem('dplab_cart', JSON.stringify(cart)), [cart])
  useEffect(() => localStorage.setItem('dplab_settings', JSON.stringify(settings)), [settings])

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cart.reduce((sum, item) => sum + (products.find(p => p.id === item.productId)?.price ?? 0) * item.quantity, 0)

  const value = useMemo<StoreContextValue>(() => ({
    products, orders, cart, settings, cartCount, cartTotal,
    addToCart: productId => setCart(current => {
      const found = current.find(item => item.productId === productId)
      return found ? current.map(item => item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { productId, quantity: 1 }]
    }),
    updateCartQuantity: (productId, quantity) => setCart(current => quantity <= 0 ? current.filter(item => item.productId !== productId) : current.map(item => item.productId === productId ? { ...item, quantity } : item)),
    clearCart: () => setCart([]),
    createOrder: customer => {
      const order: Order = { id: `DP-${Date.now().toString().slice(-8)}`, createdAt: new Date().toISOString(), customer, items: cart, total: cartTotal, status: 'new' }
      setOrders(current => [order, ...current]); setCart([]); return order
    },
    saveProduct: product => setProducts(current => current.some(item => item.id === product.id) ? current.map(item => item.id === product.id ? product : item) : [product, ...current]),
    deleteProduct: id => setProducts(current => current.filter(item => item.id !== id)),
    updateOrderStatus: (id, status) => setOrders(current => current.map(order => order.id === id ? { ...order, status } : order)),
    updateSettings: setSettings,
    resetDemo: () => { setProducts(seedProducts); setOrders(seedOrders); setCart([]); setSettings(seedSettings) },
  }), [products, orders, cart, settings, cartCount, cartTotal])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStore() {
  const context = useContext(StoreContext)
  if (!context) throw new Error('useStore must be used inside StoreProvider')
  return context
}
