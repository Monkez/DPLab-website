import type { Product } from '../types'

export const normalizeSearch = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
export function matchesProduct(product: Product, query: string) {
  const text = normalizeSearch([product.name, product.model, product.brand, product.category, product.subcategory, product.summary, ...product.applications, ...(product.tags || []), ...(product.variants || []).filter(v => v.status === "active").flatMap(v => [v.model || "", ...Object.values(v.options)])].join(' '))
  return normalizeSearch(query).split(/\s+/).every(word => text.includes(word))
}

// Seed defaults establish the entry assortment; subsequent CMS edits remain authoritative.
export function entryProducts(products: Product[]) {
  return products.filter(product => product.status === 'active' && product.featured).sort((a, b) => (a.sortOrder ?? 9999) - (b.sortOrder ?? 9999)).slice(0, 8)
}
