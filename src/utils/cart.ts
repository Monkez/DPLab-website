import { quoteItemLabel, resolveQuoteItem, variantProduct } from '../../backend/src/productVariants.js'
import type { Product, QuoteItem } from '../types'

export function cartDetails(products: Product[], items: QuoteItem[]) {
  const lines = items.map(item => {
    const { product, variant, variantId } = resolveQuoteItem(products, item)
    const available = Boolean(product?.status === 'active' && (product.variants?.length ? variant?.status === 'active' : !variantId))
    const selected = product ? variantProduct(product, variant) : undefined
    const unitPrice = available && selected?.priceMode !== 'contact' && Number.isFinite(selected?.price) && Number(selected?.price) > 0 ? selected?.price : undefined
    return { item, product, label: quoteItemLabel(products, item), available, unitPrice }
  })
  return {
    lines,
    subtotal: lines.reduce((total, line) => total + (line.unitPrice ?? 0) * line.item.quantity, 0),
    pendingPrices: lines.some(line => line.unitPrice === undefined),
    unavailable: lines.some(line => !line.available),
  }
}

export const formatMoney = (value: number) => `${value.toLocaleString('vi-VN')} ₫`
