import type { Product } from '../types'

export const formatPrice = (product: Product) => product.priceMode === 'contact' || !product.price
  ? 'Liên hệ báo giá'
  : `${product.priceMode === 'from' ? 'Từ ' : ''}${product.price.toLocaleString('vi-VN')} ₫`
