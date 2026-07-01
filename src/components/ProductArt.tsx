import type { Product } from '../types'

export function ProductArt({ product, large = false, imageSrc }: { product: Product; large?: boolean; imageSrc?: string }) {
  const realImage = imageSrc || product.detailImages?.[0]

  if (realImage) {
    return (
      <div className={`product-art product-art--photo ${large ? 'product-art--large' : ''}`} style={{ '--device-accent': product.accent } as React.CSSProperties}>
        <img src={realImage} alt={product.name} loading={large ? 'eager' : 'lazy'} />
        <span className="product-art__brand">{product.brand}</span>
      </div>
    )
  }

  return (
    <div className={`product-art ${large ? 'product-art--large' : ''}`} style={{ '--device-accent': product.accent } as React.CSSProperties} role="img" aria-label={`Minh họa ${product.name}`}>
      <div className="product-art__glow" />
      <div className="laptop">
        <div className="laptop__screen"><div className="laptop__wallpaper"><span>DP</span></div></div>
        <div className="laptop__base"><span /></div>
      </div>
      <span className="product-art__brand">{product.brand}</span>
    </div>
  )
}
