import { Check, Plus, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { useStore } from '../store/StoreContext'
import type { Product } from '../types'
import { ProductArt } from './ProductArt'

const money = (value: number) => `${new Intl.NumberFormat('vi-VN').format(value)}₫`

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useStore()
  const [added, setAdded] = useState(false)
  const specs = [product.cpu, product.ram, product.storage, product.display]
  const meta = [product.brand, product.line, product.category].filter(Boolean).join(' · ')

  const handleAdd = () => {
    addToCart(product.id)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1200)
  }

  return (
    <article className="product-card">
      <div className="product-card__badges">
        {product.condition && <span className={`condition-badge condition-badge--${product.condition === 'Mới' ? 'new' : product.condition === 'Like new' ? 'like-new' : 'used'}`}>{product.condition}</span>}
        {product.badge && <span className="product-card__badge">{product.badge}</span>}
      </div>
      <ProductArt product={product} />
      <div className="product-card__body">
        <p className="eyebrow">{meta}</p>
        <h3>{product.name}</h3>
        <ul className="spec-list">{specs.map(spec => <li key={spec}><Check size={13} />{spec}</li>)}</ul>
        <div className="price-row">
          <div><strong>{money(product.price)}</strong>{product.originalPrice && <del>{money(product.originalPrice)}</del>}</div>
          <span className={product.stock > 0 ? 'stock' : 'stock stock--empty'}>{product.stock > 0 ? `Còn ${product.stock}` : 'Hết hàng'}</span>
        </div>
        <div className="product-card__actions">
          <a className="button button--ghost button--icon" href="tel:0906094313" aria-label="Liên hệ mua hàng"><ShoppingCart size={17} /></a>
          <button className={`button button--primary button--grow ${added ? 'button--success' : ''}`} onClick={handleAdd} disabled={product.stock === 0}>
            {added ? <><Check size={17} />Đã thêm</> : <><Plus size={17} />Thêm vào giỏ</>}
          </button>
        </div>
      </div>
    </article>
  )
}
