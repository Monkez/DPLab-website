import { quoteLineKey, prepareQuoteItems, summarizeProduct } from '../../backend/src/productVariants.js'
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { seedArticles, seedProducts, seedQuotes, seedSettings } from '../data/seed'
import { api } from '../services/api'
import type { Article, CustomerInfo, Product, QuoteItem, QuoteRequest, QuoteStatus, StoreSettings } from '../types'
import { normalizeSettings } from '../utils/settings'

const StoreContext = createContext<StoreValue | null>(null)
const read = <T,>(key: string, fallback: T): T => { try { const value = localStorage.getItem(key); return value ? JSON.parse(value) as T : fallback } catch { return fallback } }

interface StoreValue {
  products: Product[]; articles: Article[]; quotes: QuoteRequest[]; quoteItems: QuoteItem[]; settings: StoreSettings; quoteCount: number
  addToQuote: (id: string, variantId?: string) => void; updateQuoteItem: (id: string, quantity: number, requirement?: string) => void; clearQuote: () => void
  submitQuote: (customer: CustomerInfo) => Promise<QuoteRequest>; saveProduct: (product: Product) => Promise<void>; deleteProduct: (id: string) => Promise<void>
  saveArticle: (article: Article, isNew?: boolean) => Promise<void>; deleteArticle: (id: string) => Promise<void>
  updateQuoteStatus: (id: string, status: QuoteStatus) => Promise<void>; updateSettings: (settings: StoreSettings) => Promise<void>
  refreshData: (admin?: boolean) => Promise<void>
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(seedProducts)
  const [articles, setArticles] = useState<Article[]>(seedArticles)
  const [quotes, setQuotes] = useState<QuoteRequest[]>(seedQuotes)
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>(() => read('dtpt_quote_items', []))
  const [settings, setSettings] = useState<StoreSettings>(seedSettings)

  const refreshData = useCallback(async (admin = Boolean(api.getAdminSession())) => {
    if (!api.enabled) return
    const data = await api.bootstrap(admin)
    setProducts(data.products.length ? data.products : seedProducts)
    setArticles(Array.isArray(data.articles) ? data.articles : seedArticles)
    setQuotes(data.quotes)
    setSettings(normalizeSettings(data.settings))
  }, [])
  useEffect(() => {
    if (api.enabled) void api.bootstrap(Boolean(api.getAdminSession())).then(data => {
      setProducts(data.products.length ? data.products : seedProducts)
      setArticles(Array.isArray(data.articles) ? data.articles : seedArticles)
      setQuotes(data.quotes)
      setSettings(normalizeSettings(data.settings))
    }).catch(console.warn)
  }, [])
  useEffect(() => localStorage.setItem('dtpt_quote_items', JSON.stringify(quoteItems)), [quoteItems])
  const quoteCount = quoteItems.reduce((sum, item) => sum + item.quantity, 0)

  const value = useMemo<StoreValue>(() => ({
    products, articles, quotes, quoteItems, settings, quoteCount, refreshData,
    addToQuote: (id, variantId) => {
      const product = products.find(p => p.id === id)
      if (!product || (product.variants?.length && !product.variants.some(v => v.id === variantId && v.status === 'active'))) return
      const selected = prepareQuoteItems(products, [{ productId: id, variantId, quantity: 1 }])[0]
      setQuoteItems(items => items.some(item => quoteLineKey(item) === quoteLineKey(selected)) ? items.map(item => quoteLineKey(item) === quoteLineKey(selected) ? { ...item, quantity: Math.min(999, item.quantity + 1) } : item) : [...items, selected])
    },
    updateQuoteItem: (key, quantity, requirement) => setQuoteItems(items => quantity <= 0 ? items.filter(item => quoteLineKey(item) !== key) : items.map(item => quoteLineKey(item) === key ? { ...item, quantity, requirement: requirement ?? item.requirement } : item)),
    clearQuote: () => setQuoteItems([]),
    submitQuote: async customer => { const selectedItems = prepareQuoteItems(products, quoteItems); const fallback: QuoteRequest = { id: `RFQ-${Date.now().toString().slice(-8)}`, createdAt: new Date().toISOString(), customer, items: selectedItems, status: 'new' }; const created = api.enabled ? await api.createQuote({ customer, items: selectedItems }) : fallback; setQuotes(items => [created, ...items]); setQuoteItems([]); return created },
    saveProduct: async product => { product = summarizeProduct(product); if (api.enabled) await api.saveProduct(product); setProducts(items => items.some(item => item.id === product.id) ? items.map(item => item.id === product.id ? product : item) : [product, ...items]) },
    deleteProduct: async id => { if (api.enabled) await api.deleteProduct(id); setProducts(items => items.filter(item => item.id !== id)) },
    saveArticle: async (article, isNew = false) => { if (api.enabled) await api.saveArticle(article, isNew); setArticles(items => items.some(item => item.id === article.id) ? items.map(item => item.id === article.id ? article : item) : [article, ...items]) },
    deleteArticle: async id => { if (api.enabled) await api.deleteArticle(id); setArticles(items => items.filter(item => item.id !== id)) },
    updateQuoteStatus: async (id, status) => { if (api.enabled) await api.updateQuoteStatus(id, status); setQuotes(items => items.map(item => item.id === id ? { ...item, status } : item)) },
    updateSettings: async next => { const normalized = normalizeSettings(next); const saved = api.enabled ? await api.updateSettings(normalized) : normalized; setSettings(normalizeSettings(saved)) },
  }), [products, articles, quotes, quoteItems, settings, quoteCount, refreshData])
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStore() { const value = useContext(StoreContext); if (!value) throw new Error('useStore must be inside StoreProvider'); return value }
