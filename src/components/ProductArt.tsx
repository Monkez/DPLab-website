import { Box, Camera, Cpu, Gauge, Network, RadioTower, ScanLine, Waves } from 'lucide-react'
import type { Product } from '../types'

const icons = { 'Máy tính công nghiệp': Cpu, 'Machine Vision': Camera, 'Cảm biến & đo lường': Gauge, 'Giám sát tình trạng máy': Waves, 'DAQ & Remote I/O': RadioTower, 'Industrial IoT & mạng': Network, 'Thiết bị đo điện tử': ScanLine, 'Tự động hóa & điều khiển': Box }
export function ProductArt({ product, large = false }: { product: Product; large?: boolean }) {
  const Icon = icons[product.category as keyof typeof icons] ?? Cpu
  return <div className={`product-art ${large ? 'product-art--large' : ''}`} style={{ '--accent': product.accent } as React.CSSProperties}>
    <span className="product-art__grid" /><Icon /><strong>{product.brand}</strong><small>{product.model}</small>
  </div>
}
