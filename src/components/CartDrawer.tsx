import { quoteLineKey } from '../../backend/src/productVariants.js'
import { Minus, Plus, ShoppingCart, Trash2, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useStore } from '../store/StoreContext'
import { cartDetails, formatMoney } from '../utils/cart'

export function CartDrawer({ open, onClose, onCheckout }: { open: boolean; onClose: () => void; onCheckout: (mode: 'quote' | 'order') => void }) {
  const { products, quoteItems, updateQuoteItem } = useStore()
  const dialog = useRef<HTMLDialogElement>(null)
  const cart = cartDetails(products, quoteItems)
  useEffect(() => {
    if (!open) return
    const node = dialog.current
    node?.showModal()
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous; node?.close() }
  }, [open])
  return <dialog ref={dialog} className="cart-dialog" aria-labelledby="cart-title" onCancel={event => { event.preventDefault(); onClose() }} onClick={event => { if (event.target === event.currentTarget) onClose() }}>
    <aside className="drawer">
      <div className="drawer__head"><div><small>THIẾT BỊ ĐÃ CHỌN</small><h2 id="cart-title">Giỏ hàng</h2></div><button className="icon-button" onClick={onClose} aria-label="Đóng giỏ hàng"><X /></button></div>
      <div className="drawer__body">
        {!quoteItems.length ? <div className="empty-state"><div className="empty-icon"><ShoppingCart /></div><h3>Giỏ hàng đang trống</h3><p>Thêm thiết bị để yêu cầu báo giá hoặc đặt đơn.</p><button className="secondary-button" onClick={onClose}>Tiếp tục chọn thiết bị</button></div> : cart.lines.map(({ item, product, label, unitPrice, available }) => <div className="quote-line" key={quoteLineKey(item)}>
          <div><strong>{product?.name || item.productId}</strong><small>{product?.brand} · {label}</small><span className="cart-line-price">{unitPrice === undefined ? 'Cần xác nhận giá' : `${formatMoney(unitPrice)} / sản phẩm`}</span>{!available && <small className="form-error">Thiết bị hoặc cấu hình đã ngừng bán. Vui lòng xóa và chọn lại.</small>}</div>
          <div className="quantity"><button aria-label={`Giảm số lượng ${label}`} onClick={() => updateQuoteItem(quoteLineKey(item), item.quantity - 1)}><Minus /></button><span aria-live="polite">{item.quantity}</span><button aria-label={`Tăng số lượng ${label}`} disabled={item.quantity >= 999} onClick={() => updateQuoteItem(quoteLineKey(item), item.quantity + 1)}><Plus /></button></div>
          <button aria-label={`Xóa ${label} khỏi giỏ hàng`} className="delete-button" onClick={() => updateQuoteItem(quoteLineKey(item), 0)}><Trash2 /></button>
        </div>)}
      </div>
      <div className="drawer__foot">
        {quoteItems.length > 0 && <div className="cart-total"><span>{cart.pendingPrices ? 'Tạm tính phần có giá' : 'Tạm tính'}</span><strong>{cart.pendingPrices && !cart.subtotal ? 'Chờ báo giá' : formatMoney(cart.subtotal)}</strong></div>}
        <p>Giá chưa bao gồm phí ship. Nhân viên DTPT-Techs sẽ liên hệ xác nhận giá, tình trạng hàng và phí giao hàng.</p>
        {cart.pendingPrices && <p>Một số thiết bị cần xác nhận giá; tạm tính chưa bao gồm các thiết bị này.</p>}
        <div className="cart-actions"><button className="secondary-button" disabled={cart.unavailable} onClick={() => onCheckout('quote')}>Yêu cầu báo giá</button><button className="primary-button" disabled={!quoteItems.length || cart.unavailable} onClick={() => onCheckout('order')}>Đặt đơn</button></div>
      </div>
    </aside>
  </dialog>
}
