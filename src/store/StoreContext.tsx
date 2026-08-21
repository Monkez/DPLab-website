import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { seedProducts, seedQuotes, seedSettings } from '../data/seed'
import { api } from '../services/api'
import type { CustomerInfo, Product, QuoteItem, QuoteRequest, QuoteStatus, StoreSettings } from '../types'

const StoreContext = createContext<StoreValue | null>(null)
const read = <T,>(key: string, fallback: T): T => { try { const value = localStorage.getItem(key); return value ? JSON.parse(value) as T : fallback } catch { return fallback } }

interface StoreValue {
  products: Product[]; quotes: QuoteRequest[]; quoteItems: QuoteItem[]; settings: StoreSettings; quoteCount: number
  addToQuote: (id: string) => void; updateQuoteItem: (id: string, quantity: number, requirement?: string) => void; clearQuote: () => void
  submitQuote: (customer: CustomerInfo) => Promise<QuoteRequest>; saveProduct: (product: Product) => Promise<void>; deleteProduct: (id: string) => Promise<void>
  updateQuoteStatus: (id: string, status: QuoteStatus) => Promise<void>; updateSettings: (settings: StoreSettings) => Promise<void>
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(seedProducts)
  const [quotes, setQuotes] = useState<QuoteRequest[]>(seedQuotes)
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>(() => read('dtpt_quote_items', []))
  const [settings, setSettings] = useState<StoreSettings>(seedSettings)

  useEffect(() => { if (api.enabled) api.bootstrap(Boolean(api.getAdminSession())).then(data => { setProducts(data.products.length ? data.products : seedProducts); setQuotes(data.quotes); setSettings({ ...seedSettings, ...data.settings, content: { ...seedSettings.content, ...data.settings.content } }) }).catch(console.warn) }, [])
  useEffect(() => localStorage.setItem('dtpt_quote_items', JSON.stringify(quoteItems)), [quoteItems])
  const quoteCount = quoteItems.reduce((sum, item) => sum + item.quantity, 0)

  const value = useMemo<StoreValue>(() => ({
    products, quotes, quoteItems, settings, quoteCount,
    addToQuote: id => setQuoteItems(items => items.some(item => item.productId === id) ? items.map(item => item.productId === id ? { ...item, quantity: item.quantity + 1 } : item) : [...items, { productId: id, quantity: 1 }]),
    updateQuoteItem: (id, quantity, requirement) => setQuoteItems(items => quantity <= 0 ? items.filter(item => item.productId !== id) : items.map(item => item.productId === id ? { ...item, quantity, requirement } : item)),
    clearQuote: () => setQuoteItems([]),
    submitQuote: async customer => { const fallback: QuoteRequest = { id: `RFQ-${Date.now().toString().slice(-8)}`, createdAt: new Date().toISOString(), customer, items: quoteItems, status: 'new' }; const created = api.enabled ? await api.createQuote({ customer, items: quoteItems }) : fallback; setQuotes(items => [created, ...items]); setQuoteItems([]); return created },
    saveProduct: async product => { if (api.enabled) await api.saveProduct(product); setProducts(items => items.some(item => item.id === product.id) ? items.map(item => item.id === product.id ? product : item) : [product, ...items]) },
    deleteProduct: async id => { if (api.enabled) await api.deleteProduct(id); setProducts(items => items.filter(item => item.id !== id)) },
    updateQuoteStatus: async (id, status) => { if (api.enabled) await api.updateQuoteStatus(id, status); setQuotes(items => items.map(item => item.id === id ? { ...item, status } : item)) },
    updateSettings: async next => { const saved = api.enabled ? await api.updateSettings(next) : next; setSettings(saved) },
  }), [products, quotes, quoteItems, settings, quoteCount])
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStore() { const value = useContext(StoreContext); if (!value) throw new Error('useStore must be inside StoreProvider'); return value }
