import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { useStore } from '../store/StoreContext'
import { ProductArt } from './ProductArt'

const money = (value: number) => new Intl.NumberFormat('vi-VN').format(value) + '₫'

export function CartDrawer({ open, onClose, onCheckout }: { open: boolean; onClose: () => void; onCheckout: () => void }) {
  const { cart, products, cartTotal, updateCartQuantity } = useStore()
  return (
    <div className={`drawer-shell ${open ? 'drawer-shell--open' : ''}`} aria-hidden={!open}>
      <button className="drawer-backdrop" onClick={onClose} aria-label="Đóng giỏ hàng" />
      <aside className="cart-drawer" aria-label="Giỏ hàng">
        <div className="drawer-header"><div><p className="eyebrow">DTPT SHOP</p><h2>Giỏ hàng <span>{cart.length}</span></h2></div><button className="icon-button" onClick={onClose}><X /></button></div>
        <div className="drawer-content">
          {cart.length === 0 ? <div className="empty-state"><span><ShoppingBag size={32} /></span><h3>Giỏ hàng đang trống</h3><p>Chọn một chiếc laptop ưng ý, DTPT Shop sẽ giữ máy giúp bạn.</p><button className="button button--primary" onClick={onClose}>Tiếp tục xem máy</button></div> : cart.map(item => {
            const product = products.find(p => p.id === item.productId)
            if (!product) return null
            return <div className="cart-item" key={item.productId}>
              <ProductArt product={product} />
              <div className="cart-item__info"><h3>{product.name}</h3><p>{money(product.price)}</p><div className="quantity"><button onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}><Minus size={14} /></button><span>{item.quantity}</span><button onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}><Plus size={14} /></button></div></div>
              <button className="remove-button" onClick={() => updateCartQuantity(item.productId, 0)} aria-label={`Xóa ${product.name}`}><Trash2 size={17} /></button>
            </div>
          })}
        </div>
        {cart.length > 0 && <div className="drawer-footer"><div className="total"><span>Tạm tính</span><strong>{money(cartTotal)}</strong></div><p>Chưa bao gồm phí vận chuyển (nếu có)</p><button className="button button--primary button--wide" onClick={onCheckout}>Đặt hàng ngay</button></div>}
      </aside>
    </div>
  )
}
