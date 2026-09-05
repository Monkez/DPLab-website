export type ProductStatus = "active" | "draft";
export type QuoteStatus = "new" | "reviewing" | "quoted" | "won" | "closed";
export type PriceMode = "fixed" | "from" | "range" | "contact";
export type ArticleStatus = "published" | "draft";

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  author: string;
  status: ArticleStatus;
  featured: boolean;
  publishedAt: string;
  updatedAt: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  model: string;
  brand: string;
  origin: string;
  category: string;
  subcategory: string;
  price?: number;
  priceMax?: number;
  priceMode: PriceMode;
  leadTime: string;
  warranty: string;
  status: ProductStatus;
  badge?: string;
  featured?: boolean;
  tags?: string[];
  sortOrder?: number;
  accent: string;
  summary: string;
  highlights: string[];
  applications: string[];
  specifications: ProductSpecification[];
  images?: string[];
  datasheetUrl?: string;
  manufacturerUrl?: string;
  imageSourceUrl?: string;
  priceSourceLabel?: string;
  priceSourceUrl?: string;
  priceSourceValue?: string;
  priceUpdatedAt?: string;
  priceNote?: string;
  videoUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface IndustrialCategory {
  id: string;
  name: string;
  shortName: string;
  description: string;
  subcategories: string[];
  visible: boolean;
  sortOrder: number;
}

export interface SiteVisibility {
  announcement: boolean;
  hero: boolean;
  categories: boolean;
  featuredProducts: boolean;
  capabilities: boolean;
  contact: boolean;
  footer: boolean;
  floatingContact: boolean;
  search: boolean;
}

export interface SiteAppearance {
  primaryColor: string;
  secondaryColor: string;
  productsPerRow: 3 | 4;
  cardStyle: "comfortable" | "compact";
}

export interface QuoteItem {
  productId: string;
  quantity: number;
  requirement?: string;
}

export interface CustomerInfo {
  name: string;
  company: string;
  phone: string;
  email: string;
  note: string;
}

export interface QuoteRequest {
  id: string;
  createdAt: string;
  customer: CustomerInfo;
  items: QuoteItem[];
  status: QuoteStatus;
}

export interface AdminUser {
  username: string;
  displayName: string;
  role: AdminRole;
  permissions: AdminPermission[];
  active: boolean;
  isRoot: boolean;
  createdAt?: string;
}
export type AdminRole = "owner" | "administrator" | "catalog_editor" | "content_editor" | "sales" | "viewer" | "custom";
export type AdminPermission =
  | "quotes.view" | "quotes.manage" | "products.manage" | "categories.manage"
  | "branding.manage" | "content.manage" | "articles.manage" | "display.manage" | "analytics.view"
  | "users.manage" | "system.reset";
export type AnalyticsDevice = "desktop" | "tablet" | "mobile";
export interface AnalyticsEvent {
  eventId: string;
  visitorId: string;
  sessionId: string;
  eventType: "page_view";
  path: string;
  productId?: string;
  referrer?: string;
  device: AnalyticsDevice;
  createdAt: string;
}

export interface StoreSettings {
  storeName: string;
  slogan: string;
  logoStyle: "round" | "wide";
  logoRoundSrc: string;
  logoWideSrc: string;
  faviconSrc: string;
  phone: string;
  address: string;
  email: string;
  facebook: string;
  categories: IndustrialCategory[];
  visibility: SiteVisibility;
  appearance: SiteAppearance;
  content: SiteContent;
}

export interface SiteContent {
  announcementPrimary: string;
  announcementSecondary: string;
  navProducts: string;
  navSolutions: string;
  navWhy: string;
  navContact: string;
  heroBadge: string;
  heroTitle: string;
  heroHighlight: string;
  heroDescription: string;
  heroPrimaryAction: string;
  heroSecondaryAction: string;
  trustQuality: string;
  trustPrice: string;
  trustSupport: string;
  service1Title: string;
  service1Description: string;
  service2Title: string;
  service2Description: string;
  service3Title: string;
  service3Description: string;
  service4Title: string;
  service4Description: string;
  productsEyebrow: string;
  productsTitle: string;
  productsDescription: string;
  whyEyebrow: string;
  whyTitle: string;
  whyDescription: string;
  why1Title: string;
  why1Description: string;
  why2Title: string;
  why2Description: string;
  why3Title: string;
  why3Description: string;
  why4Title: string;
  why4Description: string;
  contactEyebrow: string;
  contactTitle: string;
  contactSubtitle: string;
  footerDescription: string;
}
