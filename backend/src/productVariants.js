export const variantLabel = variant => Object.entries(variant?.options || {}).map(([name, value]) => name + ': ' + value).join(' · ')
export const quoteLineKey = item => JSON.stringify([item.productId, item.variantId || ''])
export function summarizeProduct(product) {
  if (!product.variants?.length) return product
  const active = product.variants.filter(v => v.status === 'active')
  const prices = active.filter(v => v.priceMode !== 'contact' && v.price > 0).map(v => v.price)
  return { ...product, price: prices.length ? Math.min(...prices) : undefined, priceMax: prices.length ? Math.max(...prices) : undefined, priceMode: prices.length ? 'from' : 'contact' }
}
export function variantProduct(product, variant) {
  if (!variant) return product
  return { ...product, ...Object.fromEntries(Object.entries(variant).filter(([, value]) => value !== undefined)), id: product.id, slug: product.slug, name: product.name, model: variant.model || product.model, priceNote: variant.priceNote ?? (variant.priceMode === 'contact' ? 'Liên hệ để nhận giá và xác nhận thời gian giao cho cấu hình này.' : product.priceNote), variants: undefined, price: variant.priceMode === 'contact' ? undefined : variant.price, priceMax: undefined }
}
export function validateVariants(product) {
  if (product.variants === undefined) return ''
  if (!Array.isArray(product.variants) || product.variants.length > 100) return 'Tối đa 100 cấu hình cho một sản phẩm.'
  const ids = new Set(), combinations = new Set()
  let names
  for (const v of product.variants) {
    if (!v || typeof v.id !== 'string' || !v.id.trim() || v.id.length > 100 || ids.has(v.id)) return 'Mã cấu hình bị trùng hoặc để trống.'
    ids.add(v.id)
    if (!v.options || typeof v.options !== 'object' || Array.isArray(v.options)) return 'Mỗi cấu hình cần có tùy chọn.'
    const keys = Object.keys(v.options).sort()
    if (!keys.length || keys.length > 6 || keys.some(k => !k.trim() || k.length > 60 || typeof v.options[k] !== 'string' || !v.options[k].trim() || v.options[k].length > 100)) return 'Nhập tên và giá trị cho 1–6 loại tùy chọn.'
    if (names && JSON.stringify(keys) !== names) return 'Các cấu hình phải dùng cùng tên tùy chọn (ví dụ RAM, Màu sắc).'
    names = JSON.stringify(keys)
    const combination = JSON.stringify(keys.map(k => [k.trim().toLowerCase(), v.options[k].trim().toLowerCase()]))
    if (combinations.has(combination)) return 'Hai cấu hình có cùng bộ tùy chọn. Vui lòng gộp hoặc đổi giá trị.'
    combinations.add(combination)
    if (!['active', 'draft'].includes(v.status) || !['fixed', 'contact'].includes(v.priceMode)) return 'Trạng thái hoặc kiểu giá cấu hình không hợp lệ.'
    if (v.priceMode === 'fixed' && (!Number.isFinite(v.price) || v.price <= 0)) return 'Giá cấu hình phải lớn hơn 0, hoặc chọn Liên hệ.'
  }
  if (product.status === 'active' && product.variants.length && !product.variants.some(v => v.status === 'active')) return 'Sản phẩm hiển thị cần ít nhất một cấu hình đang bán.'
  return ''
}
export function resolveQuoteItem(products, item) {
  let product = products.find(p => p.id === item.productId)
  let variantId = item.variantId
  if (product?.redirectTo) { variantId ||= product.id; product = products.find(p => p.id === product.redirectTo) }
  // Before grouping, existing baskets and RFQs used the base configuration's product ID.
  if (product?.variants?.length && !variantId) variantId = product.variants.find(v => v.id === item.productId)?.id
  const variant = product?.variants?.find(v => v.id === variantId)
  return { product, variant, variantId }
}
export function quoteItemLabel(products, item) {
  if (item.variantLabel) return item.variantLabel
  const { product, variant } = resolveQuoteItem(products, item)
  return variant ? variantLabel(variant) : product?.model || item.productId
}
export function prepareQuoteItems(products, items) {
  return items.map(item => {
    const { product, variant, variantId } = resolveQuoteItem(products, item)
    if (!product || product.status !== 'active' || (product.variants?.length ? !variant || variant.status !== 'active' : Boolean(variantId))) throw new Error('Cấu hình đã thay đổi hoặc ngừng bán. Vui lòng chọn lại sản phẩm.')
    return { productId: product.id, quantity: item.quantity, requirement: String(item.requirement || '').slice(0, 1000), ...(variant ? { variantId: variant.id, variantLabel: variantLabel(variant), variantModel: variant.model || product.model } : {}) }
  })
}
