import { validateQuoteRequest } from './quoteValidation.js'
import { prepareQuoteItems, resolveQuoteItem, variantProduct } from './productVariants.js'

export function validateOrderRequest(payload) {
  if (Array.isArray(payload?.items) && !payload.items.length) return { error: 'Vui lòng thêm sản phẩm vào giỏ trước khi đặt đơn.' }
  const result = validateQuoteRequest(payload)
  if (result.error) return result
  if (!result.customer.address) return { error: 'Vui lòng nhập địa chỉ giao hàng.' }
  return result
}

export function prepareOrderItems(products, items) {
  return prepareQuoteItems(products, items).map(item => {
    const { product, variant } = resolveQuoteItem(products, item)
    const selected = variantProduct(product, variant)
    return {
      ...item, productName: product.name, variantModel: selected.model,
      ...(selected.priceMode !== 'contact' && Number.isFinite(selected.price) && selected.price > 0 ? { unitPrice: selected.price } : {}),
    }
  })
}
