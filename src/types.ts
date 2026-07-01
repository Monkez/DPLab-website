export type ProductStatus = 'active' | 'draft' | 'out-of-stock'
export type OrderStatus = 'new' | 'confirmed' | 'shipping' | 'completed' | 'cancelled'

export interface Product {
  id: string
  name: string
  brand: string
  category: 'Văn phòng' | 'Đồ họa' | 'Gaming' | 'Mỏng nhẹ'
  cpu: string
  ram: string
  storage: string
  display: string
  gpu: string
  price: number
  originalPrice?: number
  stock: number
  status: ProductStatus
  badge?: string
  accent: string
}

export interface CartItem { productId: string; quantity: number }

export interface CustomerInfo {
  name: string
  phone: string
  address: string
  note: string
}

export interface Order {
  id: string
  createdAt: string
  customer: CustomerInfo
  items: CartItem[]
  total: number
  status: OrderStatus
}

export interface AdminUser {
  username: string
  displayName: string
  createdAt?: string
}

export interface StoreSettings {
  storeName: string
  slogan: string
  logoStyle: 'round' | 'wide'
  logoRoundSrc: string
  logoWideSrc: string
  phone: string
  address: string
  email: string
  facebook: string
  content: SiteContent
}

export interface SiteContent {
  announcementPrimary: string
  announcementSecondary: string
  navProducts: string
  navWhy: string
  navContact: string
  heroBadge: string
  heroTitle: string
  heroHighlight: string
  heroDescription: string
  heroPrimaryAction: string
  trustQuality: string
  trustWarranty: string
  trustDelivery: string
  service1Title: string
  service1Description: string
  service2Title: string
  service2Description: string
  service3Title: string
  service3Description: string
  service4Title: string
  service4Description: string
  productsEyebrow: string
  productsTitle: string
  productsDescription: string
  whyEyebrow: string
  whyTitle: string
  whyDescription: string
  why1Title: string
  why1Description: string
  why2Title: string
  why2Description: string
  why3Title: string
  why3Description: string
  why4Title: string
  why4Description: string
  contactEyebrow: string
  contactTitle: string
  contactSubtitle: string
  footerDescription: string
}
