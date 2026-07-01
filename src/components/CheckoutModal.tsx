import { CheckCircle2, ChevronRight, Phone, ShieldCheck, X } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useStore } from '../store/StoreContext'
import type { Order } from '../types'

const money = (value: number) => new Intl.NumberFormat('vi-VN').format(value) + '₫'

export function CheckoutModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { cart, products, cartTotal, createOrder, settings } = useStore()
  const [submitted, setSubmitted] = useState<Order | null>(null)
  const [error, setError] = useState('')

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); const form = new FormData(event.currentTarget)
    const name = String(form.get('name') ?? '').trim(); const phone = String(form.get('phone') ?? '').trim(); const address = String(form.get('address') ?? '').trim()
    if (!name || !/^[0-9+ .-]{9,15}$/.test(phone) || !address) { setError('Vui lòng kiểm tra họ tên, số điện thoại và địa chỉ.'); return }
    setSubmitted(createOrder({ name, phone, address, note: String(form.get('note') ?? '') })); setError('')
  }

  const close = () => { setSubmitted(null); onClose() }
  if (!open) return null
  return <div className="modal-shell" role="dialog" aria-modal="true" aria-label="Đặt hàng">
    <button className="modal-backdrop" onClick={close} aria-label="Đóng" />
    <div className="checkout-modal">
      <button className="modal-close" onClick={close}><X /></button>
      {submitted ? <div className="success-view"><span className="success-icon"><CheckCircle2 size={42} /></span><p className="eyebrow">ĐẶT HÀNG THÀNH CÔNG</p><h2>Cảm ơn bạn đã chọn DP Lab!</h2><p>Đơn <strong>#{submitted.id}</strong> đã được ghi nhận. Nhân viên sẽ gọi xác nhận trong giờ làm việc.</p><div className="success-order"><span>Tổng giá trị đơn hàng</span><strong>{money(submitted.total)}</strong></div><a className="button button--primary button--wide" href={`tel:${settings.phone.replace(/\s/g, '')}`}><Phone size={18} />Gọi ngay {settings.phone}</a><button className="text-button" onClick={close}>Tiếp tục mua sắm <ChevronRight size={16} /></button></div> : <div className="checkout-grid">
        <form onSubmit={submit} className="checkout-form"><p className="eyebrow">THÔNG TIN NHẬN HÀNG</p><h2>Hoàn tất đặt hàng</h2><div className="form-grid"><label>Họ và tên *<input name="name" autoFocus placeholder="Nguyễn Văn A" /></label><label>Số điện thoại *<input name="phone" inputMode="tel" placeholder="09xx xxx xxx" /></label><label className="form-span">Địa chỉ nhận hàng *<input name="address" placeholder="Số nhà, đường, quận/huyện..." /></label><label className="form-span">Ghi chú<textarea name="note" rows={3} placeholder="Thời gian nhận hàng, yêu cầu thêm..." /></label></div>{error && <p className="form-error">{error}</p>}<div className="offline-note"><ShieldCheck size={19} /><span>Không cần thanh toán online. DP Lab sẽ gọi xác nhận trước khi giao.</span></div><button className="button button--primary button--wide" type="submit">Xác nhận đặt hàng · {money(cartTotal)}</button></form>
        <div className="checkout-summary"><p className="eyebrow">ĐƠN HÀNG CỦA BẠN</p>{cart.map(item => { const product = products.find(p => p.id === item.productId); return product ? <div className="summary-item" key={item.productId}><span>{item.quantity}×</span><div><strong>{product.name}</strong><small>{product.cpu} · {product.ram}</small></div><b>{money(product.price * item.quantity)}</b></div> : null })}<div className="summary-total"><span>Tổng cộng</span><strong>{money(cartTotal)}</strong></div></div>
      </div>}
    </div>
  </div>
}
