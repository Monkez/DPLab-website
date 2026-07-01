import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { seedOrders, seedProducts, seedSettings } from '../data/seed'
import { api } from '../services/api'
import type { CartItem, CustomerInfo, Order, OrderStatus, Product, ProductCategory, ProductCondition, StoreSettings } from '../types'

const CATALOG_VERSION = 'trieubom-237-v6-dtpt-shop'
const CART_VERSION = 'dtpt-shop-cart-v2'

function migrateBrandSettings(settings: StoreSettings): StoreSettings {
  const content = Object.fromEntries(Object.entries(settings.content).map(([key, value]) => [
    key,
    value.replaceAll('DP LAB', 'DTPT SHOP').replaceAll('DP Lab', 'DTPT Shop'),
  ])) as StoreSettings['content']
  return {
    ...settings,
    storeName: 'DTPT Shop',
    email: settings.email === 'hello@dplab.vn' ? 'hello@dtpt.shop' : settings.email,
    facebook: settings.facebook === 'facebook.com/dplab.vn' ? 'facebook.com/dtpt.shop' : settings.facebook,
    content,
  }
}

const readStorage = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) as T : fallback
  } catch {
    return fallback
  }
}

const shouldUseStoredProducts = () => localStorage.getItem('dplab_catalog_version') === CATALOG_VERSION

const readProducts = () => {
  if (!shouldUseStoredProducts()) {
    localStorage.removeItem('dplab_products')
    localStorage.setItem('dplab_catalog_version', CATALOG_VERSION)
    return seedProducts
  }
  const saved = readStorage<Product[]>('dplab_products', seedProducts)
  const onlyDemo = saved.length > 0 && saved.every(product => product.id.startsWith('DEV-'))
  return onlyDemo || saved.length < 20 ? seedProducts : saved
}

const readSettings = (): StoreSettings => {
  const saved = readStorage<Partial<StoreSettings>>('dplab_settings', {})
  return migrateBrandSettings({ ...seedSettings, ...saved, content: { ...seedSettings.content, ...(saved.content ?? {}) } })
}

const readCart = (): CartItem[] => {
  if (localStorage.getItem('dplab_cart_version') !== CART_VERSION) {
    localStorage.removeItem('dplab_cart')
    localStorage.setItem('dplab_cart_version', CART_VERSION)
    return []
  }
  return readStorage<CartItem[]>('dplab_cart', [])
}

const categoryFixes: Record<string, ProductCategory> = {
  'VÄƒn phÃ²ng': 'Văn phòng',
  'Äá»“ há»a': 'Đồ họa',
  'Má»ng nháº¹': 'Mỏng nhẹ',
  'Văn phòng': 'Văn phòng',
  'Đồ họa': 'Đồ họa',
  'Mỏng nhẹ': 'Mỏng nhẹ',
  Gaming: 'Gaming',
}

const conditionFixes: Record<string, ProductCondition> = {
  'Má»›i': 'Mới',
  'ÄÃ£ qua sá»­ dá»¥ng': 'Đã qua sử dụng',
  'Mới': 'Mới',
  'Like new': 'Like new',
  'Đã qua sử dụng': 'Đã qua sử dụng',
}

const knownLines = ['Legion', 'Yoga', 'ThinkBook', 'ThinkPad', 'IdeaPad', 'LOQ', 'Lecoo', 'XPS', 'Latitude', 'Inspiron', 'Vostro', 'Precision', 'Alienware', 'Zenbook', 'Vivobook', 'ROG', 'TUF', 'ProArt', 'ExpertBook', 'Aspire', 'Swift', 'Nitro', 'Predator', 'TravelMate', 'Pavilion', 'Envy', 'Spectre', 'EliteBook', 'ProBook', 'Omen', 'MacBook', 'Surface', 'Gram', 'Katana']

function inferLine(product: Product) {
  if (product.line) return product.line
  const name = product.name.toLowerCase()
  return knownLines.find(line => name.includes(line.toLowerCase())) || undefined
}

function normalizeProduct(product: Product): Product {
  const cleanImages = (product.detailImages ?? []).filter(src => !/logo|favicon|cropped|icon|4-2-1/i.test(src.split('/').pop() || ''))
  return {
    ...product,
    brand: product.brand === 'ASUS' ? 'Asus' : product.brand,
    category: categoryFixes[String(product.category)] ?? product.category,
    line: inferLine(product),
    condition: conditionFixes[String(product.condition)] ?? product.condition ?? 'Like new',
    detailImages: cleanImages,
  }
}

const normalizeProducts = (items: Product[]) => items.map(normalizeProduct)

function preferImportedCatalog(products: Product[]) {
  const normalized = normalizeProducts(products)
  const onlyDemo = normalized.length > 0 && normalized.every(product => product.id.startsWith('DEV-'))
  return onlyDemo || normalized.length < 20 ? seedProducts : normalized
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
  const [products, setProducts] = useState<Product[]>(() => normalizeProducts(readProducts()))
  const [orders, setOrders] = useState<Order[]>(() => readStorage('dplab_orders', seedOrders))
  const [cart, setCart] = useState<CartItem[]>(readCart)
  const [settings, setSettings] = useState<StoreSettings>(readSettings)

  useEffect(() => {
    if (!api.enabled) return
    api.bootstrap()
      .then(data => {
        setProducts(preferImportedCatalog(data.products))
        setOrders(data.orders)
        setSettings(migrateBrandSettings({ ...seedSettings, ...data.settings, content: { ...seedSettings.content, ...data.settings.content } }))
      })
      .catch(error => console.warn('Không tải được dữ liệu backend, dùng dữ liệu local.', error))
  }, [])

  useEffect(() => localStorage.setItem('dplab_products', JSON.stringify(products)), [products])
  useEffect(() => localStorage.setItem('dplab_catalog_version', CATALOG_VERSION), [])
  useEffect(() => localStorage.setItem('dplab_orders', JSON.stringify(orders)), [orders])
  const validCart = useMemo(() => cart.filter(item => item.quantity > 0 && products.some(product => product.id === item.productId)), [cart, products])

  useEffect(() => localStorage.setItem('dplab_cart', JSON.stringify(validCart)), [validCart])
  useEffect(() => localStorage.setItem('dplab_cart_version', CART_VERSION), [])
  useEffect(() => localStorage.setItem('dplab_settings', JSON.stringify(settings)), [settings])

  const cartCount = validCart.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = validCart.reduce((sum, item) => sum + (products.find(product => product.id === item.productId)?.price ?? 0) * item.quantity, 0)

  const value = useMemo<StoreContextValue>(() => ({
    products, orders, cart: validCart, settings, cartCount, cartTotal,
    addToCart: productId => setCart(current => {
      const found = current.find(item => item.productId === productId)
      return found ? current.map(item => item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { productId, quantity: 1 }]
    }),
    updateCartQuantity: (productId, quantity) => setCart(current => quantity <= 0 ? current.filter(item => item.productId !== productId) : current.map(item => item.productId === productId ? { ...item, quantity } : item)),
    clearCart: () => setCart([]),
    createOrder: customer => {
      const order: Order = { id: `DTPT-${Date.now().toString().slice(-8)}`, createdAt: new Date().toISOString(), customer, items: validCart, total: cartTotal, status: 'new' }
      setOrders(current => [order, ...current])
      setCart([])
      if (api.enabled) api.createOrder(order).catch(error => console.warn('Không lưu được đơn hàng lên backend.', error))
      return order
    },
    saveProduct: product => {
      const normalized = normalizeProduct(product)
      setProducts(current => current.some(item => item.id === normalized.id) ? current.map(item => item.id === normalized.id ? normalized : item) : [normalized, ...current])
      if (api.enabled) api.saveProduct(normalized).catch(error => console.warn('Không lưu được sản phẩm lên backend.', error))
    },
    deleteProduct: id => {
      setProducts(current => current.filter(item => item.id !== id))
      if (api.enabled) api.deleteProduct(id).catch(error => console.warn('Không xóa được sản phẩm trên backend.', error))
    },
    updateOrderStatus: (id, status) => {
      setOrders(current => current.map(order => order.id === id ? { ...order, status } : order))
      if (api.enabled) api.updateOrderStatus(id, status).catch(error => console.warn('Không cập nhật được đơn hàng trên backend.', error))
    },
    updateSettings: nextSettings => {
      setSettings(nextSettings)
      if (api.enabled) api.updateSettings(nextSettings).catch(error => console.warn('Không lưu được cài đặt lên backend.', error))
    },
    resetDemo: () => {
      setProducts(seedProducts)
      setOrders(seedOrders)
      setCart([])
      setSettings(seedSettings)
      localStorage.setItem('dplab_catalog_version', CATALOG_VERSION)
      if (api.enabled) {
        api.resetDemo()
          .then(data => { setProducts(preferImportedCatalog(data.products)); setOrders(data.orders); setSettings(data.settings) })
          .catch(error => console.warn('Không khôi phục được dữ liệu backend.', error))
      }
    },
  }), [products, orders, validCart, settings, cartCount, cartTotal])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStore() {
  const context = useContext(StoreContext)
  if (!context) throw new Error('useStore must be used inside StoreProvider')
  return context
}
