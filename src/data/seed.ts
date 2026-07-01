import type { Order, Product, StoreSettings } from '../types'
import { importedLaptopProducts } from './importedLaptopProducts'

const baseProducts: Product[] = [
  { id: 'DEV-037', name: 'Dell Vostro 3400', brand: 'Dell', line: 'Vostro', category: 'Văn phòng', cpu: 'Intel Core i5-1135G7', ram: '16GB DDR4', storage: 'SSD 256GB', display: '14" Full HD', gpu: 'Intel Iris Xe', price: 7990000, originalPrice: 8990000, stock: 5, status: 'active', badge: 'Bán chạy', accent: '#8fa9bc' },
  { id: 'DEV-003', name: 'Dell XPS 15 OLED', brand: 'Dell', line: 'XPS', category: 'Đồ họa', cpu: 'Intel Core i7-12700H', ram: '32GB DDR5', storage: 'SSD 1TB', display: '15.6" 4K OLED', gpu: 'RTX 3050 Ti', price: 24990000, originalPrice: 27990000, stock: 2, status: 'active', badge: 'Màn OLED', accent: '#7d8a93' },
  { id: 'DEV-004', name: 'MacBook Pro M2 Max', brand: 'Apple', line: 'Apple MacBook', category: 'Đồ họa', cpu: 'Apple M2 Max', ram: '32GB Unified', storage: 'SSD 1TB', display: '14.2" Liquid Retina XDR', gpu: 'GPU 30 lõi', price: 38990000, originalPrice: 42990000, stock: 2, status: 'active', badge: 'Cao cấp', accent: '#a9adb0' },
  { id: 'DEV-011', name: 'MacBook Air M2', brand: 'Apple', line: 'Apple MacBook', category: 'Mỏng nhẹ', cpu: 'Apple M2', ram: '8GB Unified', storage: 'SSD 256GB', display: '13.6" Liquid Retina', gpu: 'GPU 8 lõi', price: 17990000, originalPrice: 19990000, stock: 4, status: 'active', badge: 'Mỏng nhẹ', accent: '#b7a58e' },
  { id: 'DEV-013', name: 'MacBook Pro M3 Pro', brand: 'Apple', line: 'Apple MacBook', category: 'Đồ họa', cpu: 'Apple M3 Pro', ram: '18GB Unified', storage: 'SSD 512GB', display: '14.2" Liquid Retina XDR', gpu: 'GPU 14 lõi', price: 39990000, originalPrice: 43990000, stock: 2, status: 'active', badge: 'Mới về', accent: '#72777b' },
  { id: 'DEV-017', name: 'ASUS Zenbook 14', brand: 'Asus', line: 'Zenbook', category: 'Mỏng nhẹ', cpu: 'Intel Core i5-1240P', ram: '16GB LPDDR5', storage: 'SSD 512GB', display: '14" 2.8K OLED', gpu: 'Intel Iris Xe', price: 15990000, originalPrice: 17490000, stock: 6, status: 'active', badge: 'Giá tốt', accent: '#7997ae' },
  { id: 'DEV-019', name: 'Lenovo Legion 5 Pro', brand: 'Lenovo', line: 'Legion', category: 'Gaming', cpu: 'Intel Core i7-13700H', ram: '32GB DDR5', storage: 'SSD 1TB', display: '16" 2.5K 165Hz', gpu: 'NVIDIA RTX 4060', price: 28990000, originalPrice: 31990000, stock: 3, status: 'active', condition: 'Like new', badge: 'Gaming', accent: '#455865' },
  { id: 'DEV-023', name: 'ASUS ProArt Studio', brand: 'Asus', line: 'ProArt', category: 'Đồ họa', cpu: 'Intel Core i7-13700H', ram: '32GB DDR5', storage: 'SSD 1TB', display: '16" 3.2K OLED', gpu: 'NVIDIA RTX 4060', price: 32990000, originalPrice: 35990000, stock: 2, status: 'active', condition: 'Mới', badge: 'Creator', accent: '#645d73' },
  { id: 'DEV-029', name: 'HP Pavilion Plus 14', brand: 'HP', line: 'Pavilion', category: 'Văn phòng', cpu: 'Intel Core i5-1240P', ram: '16GB DDR4', storage: 'SSD 512GB', display: '14" 2.2K IPS', gpu: 'Intel Iris Xe', price: 13990000, originalPrice: 15490000, stock: 7, status: 'active', condition: 'Mới', accent: '#a5a7aa' },
  { id: 'DEV-036', name: 'MacBook Pro 14 M3 Pro', brand: 'Apple', line: 'Apple MacBook', category: 'Mỏng nhẹ', cpu: 'Apple M3 Pro', ram: '18GB Unified', storage: 'SSD 512GB', display: '14.2" XDR', gpu: 'GPU 14 lõi', price: 40990000, originalPrice: 44990000, stock: 1, status: 'active', badge: 'Chỉ còn 1', accent: '#8d9396' },
  { id: 'DEV-041', name: 'Lenovo Yoga Slim 7', brand: 'Lenovo', line: 'Yoga', category: 'Mỏng nhẹ', cpu: 'AMD Ryzen 7 7840S', ram: '16GB LPDDR5', storage: 'SSD 1TB', display: '14.5" 2.9K OLED', gpu: 'Radeon 780M', price: 21990000, originalPrice: 23990000, stock: 3, status: 'active', condition: 'Mới', badge: 'OLED', accent: '#758f8b' },
  { id: 'DEV-042', name: 'Lenovo ThinkBook 14 G6', brand: 'Lenovo', line: 'ThinkBook', category: 'Văn phòng', cpu: 'Intel Core i5-1335U', ram: '16GB DDR5', storage: 'SSD 512GB', display: '14" WUXGA', gpu: 'Intel Iris Xe', price: 14990000, originalPrice: 16490000, stock: 5, status: 'active', condition: 'Like new', accent: '#6f8292' },
  { id: 'DEV-043', name: 'Acer Nitro V 15', brand: 'Acer', line: 'Nitro', category: 'Gaming', cpu: 'Intel Core i5-13420H', ram: '16GB DDR5', storage: 'SSD 512GB', display: '15.6" 144Hz', gpu: 'NVIDIA RTX 4050', price: 18990000, originalPrice: 20990000, stock: 4, status: 'active', badge: 'Gaming tốt', accent: '#536653' },
]

export const seedProducts: Product[] = [...baseProducts, ...importedLaptopProducts]

export const seedOrders: Order[] = [
  { id: 'DP-260701', createdAt: '2026-07-01T08:24:00.000Z', customer: { name: 'Nguyễn Minh Anh', phone: '0986 234 567', address: 'Hà Đông, Hà Nội', note: 'Gọi trước khi giao' }, items: [{ productId: 'DEV-037', quantity: 1 }], total: 7990000, status: 'new' },
  { id: 'DP-260630', createdAt: '2026-06-30T03:15:00.000Z', customer: { name: 'Trần Quang Huy', phone: '0912 888 686', address: 'Cầu Giấy, Hà Nội', note: '' }, items: [{ productId: 'DEV-019', quantity: 1 }], total: 28990000, status: 'confirmed' },
]

export const seedSettings: StoreSettings = {
  storeName: 'DP Lab',
  slogan: 'Giá tốt - uy tín - chất lượng',
  logoStyle: 'round',
  logoRoundSrc: '/dp-lab-logo.png',
  logoWideSrc: '/dtpt-techs-logo.png',
  phone: '0906 094 313',
  address: 'Tầng 5, V11-B09, KĐT mới An Hưng, P. La Khê, Hà Đông, Hà Nội',
  email: 'hello@dplab.vn',
  facebook: 'facebook.com/dplab.vn',
  content: {
    announcementPrimary: 'Miễn phí giao máy nội thành Hà Nội',
    announcementSecondary: 'Kiểm tra máy trước khi nhận',
    navProducts: 'Laptop',
    navWhy: 'Vì sao chọn DP Lab',
    navContact: 'Liên hệ',
    heroBadge: 'Laptop tuyển chọn · Bảo hành rõ ràng',
    heroTitle: 'Chiếc laptop đúng.',
    heroHighlight: 'Giá vừa tầm.',
    heroDescription: 'DP Lab chọn lọc từng chiếc máy theo nhu cầu thật: học tập, văn phòng, thiết kế hay gaming. Cấu hình rõ, giá minh bạch, tư vấn không vòng vo.',
    heroPrimaryAction: 'Khám phá laptop',
    trustQuality: 'Máy kiểm tra kỹ',
    trustWarranty: 'Bảo hành tận tâm',
    trustDelivery: 'Giao nhanh Hà Nội',
    service1Title: 'Máy tuyển chọn',
    service1Description: 'Kiểm tra 30+ hạng mục',
    service2Title: 'Bảo hành rõ ràng',
    service2Description: 'Hỗ trợ nhanh, không né tránh',
    service3Title: 'Cài đặt miễn phí',
    service3Description: 'Sẵn sàng để dùng ngay',
    service4Title: 'Tư vấn đúng nhu cầu',
    service4Description: 'Gọi là có người hỗ trợ',
    productsEyebrow: 'LAPTOP NỔI BẬT',
    productsTitle: 'Chọn máy theo cách của bạn',
    productsDescription: 'Mỗi sản phẩm đều hiển thị cấu hình và giá bán rõ ràng. Cần thêm thông tin? Chỉ cần gọi DP Lab.',
    whyEyebrow: 'VÌ SAO LÀ DP LAB?',
    whyTitle: 'Mua laptop nên là một quyết định nhẹ đầu.',
    whyDescription: 'Chúng tôi nói rõ chiếc máy làm tốt điều gì, điểm nào cần cân nhắc, và mức giá có thực sự phù hợp với bạn hay không.',
    why1Title: 'Tuyển chọn, không bán tràn lan',
    why1Description: 'Danh mục vừa đủ, tập trung vào những cấu hình có giá trị sử dụng tốt.',
    why2Title: 'Thông tin thật, giá rõ ràng',
    why2Description: 'Không để “giá liên hệ”. Giá trên website là cơ sở để bạn quyết định.',
    why3Title: 'Đồng hành sau khi mua',
    why3Description: 'Từ cài đặt, nâng cấp đến bảo hành, luôn có người thật hỗ trợ.',
    why4Title: 'Đặt trước, chưa cần thanh toán',
    why4Description: 'Giữ máy online, nhận cuộc gọi xác nhận rồi mới quyết định cuối cùng.',
    contactEyebrow: 'CHƯA BIẾT CHỌN MÁY NÀO?',
    contactTitle: 'Gọi DP Lab, kể nhu cầu của bạn.',
    contactSubtitle: 'Phần chọn máy để chúng tôi lo.',
    footerDescription: 'Laptop được chọn kỹ, tư vấn có tâm và đồng hành dài lâu.',
  },
}

