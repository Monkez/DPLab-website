import type { Product, StoreSettings } from '../types'

export function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function productPath(product: Product) {
  return `/san-pham/${slugify(`${product.name}-${product.id}`)}`
}

export function productSeoTitle(product: Product, settings: StoreSettings) {
  return product.seoTitle || `${product.name} giá tốt tại ${settings.storeName}`
}

export function productSeoDescription(product: Product) {
  return product.seoDescription || product.salesSummary || `${product.name} cấu hình ${product.cpu}, ${product.ram}, ${product.storage}. Xem giá, tình trạng và tư vấn đặt hàng tại DP Lab.`
}
