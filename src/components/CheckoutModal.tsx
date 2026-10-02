import { quoteLineKey, quoteItemLabel } from '../../backend/src/productVariants.js'
import { CheckCircle2, X } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { validateQuoteRequest } from '../../backend/src/quoteValidation.js'
import { api } from '../services/api'
import { useStore } from '../store/StoreContext'
import { validateOrderRequest } from '../../backend/src/orderValidation.js'
import { cartDetails, formatMoney } from '../utils/cart'

export function CheckoutModal({ open, mode = 'quote', onClose }: { open: boolean; mode?: 'quote' | 'order'; onClose: () => void }) {
  const { submitQuote, submitOrder, products, quoteItems, settings } = useStore()
  const ordering = mode === 'order'
  const cart = cartDetails(products, quoteItems)
  const [sentId, setSentId] = useState(''), [busy, setBusy] = useState(false), [error, setError] = useState('')
  const [draft, setDraft] = useState({ name: '', company: '', phone: '', email: '', note: '', address: '' })
  const dialog = useRef<HTMLDialogElement>(null)
  const form = useRef<HTMLFormElement>(null)
  const pending = useRef(false)
  useEffect(() => {
    if (open) { const node = dialog.current; node?.showModal(); const previous = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = previous; node?.close() } }
  }, [open])
  const close = () => { if (pending.current) return; setSentId(''); setError(''); onClose() }
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (pending.current) return
    pending.current = true
    setBusy(true); setError('')
    const data = new FormData(event.currentTarget)
    const customer = { name: String(data.get('name') || '').trim(), company: String(data.get('company') || '').trim(), phone: String(data.get('phone') || '').trim(), email: String(data.get('email') || '').trim(), note: String(data.get('note') || '').trim(), address: String(data.get('address') || '').trim() }
    setDraft(customer)
    const validation = (ordering ? validateOrderRequest : validateQuoteRequest)({ customer, items: quoteItems })
    if (validation.error) { setError(validation.error); setBusy(false); pending.current = false; return }
    try {
      if (ordering) {
        const order = await submitOrder(customer)
        setSentId(order.id); setDraft({ name: '', company: '', phone: '', email: '', note: '', address: '' }); form.current?.reset()
      } else if (!api.enabled) {
        const lines = quoteItems.map(item => { const product = products.find(value => value.id === item.productId); return `- ${product?.name || item.productId} (${quoteItemLabel(products, item)}) x ${item.quantity}${item.requirement ? `: ${item.requirement}` : ''}` })
        const subject = encodeURIComponent(`Yêu cầu tư vấn / báo giá từ ${customer.company || customer.name}`)
        const body = encodeURIComponent(`Họ tên: ${customer.name}\nĐơn vị: ${customer.company}\nĐiện thoại: ${customer.phone}\nEmail: ${customer.email}\n\n${lines.join('\n')}\n\nNhu cầu:\n${customer.note}`)
        window.location.href = `mailto:${settings.email}?subject=${subject}&body=${body}`
        setSentId('EMAIL') // Opening an email client is not a confirmed submission; keep the list.
      } else { const quote = await submitQuote(customer); setSentId(quote.id); setDraft({ name: '', company: '', phone: '', email: '', note: '', address: '' }); form.current?.reset() }
    } catch (reason) { setError(`${reason instanceof Error ? reason.message : 'Chưa gửi được yêu cầu.'} Thông tin và giỏ hàng vẫn được giữ lại; vui lòng thử lại hoặc liên hệ trực tiếp bên dưới.`) } finally { setBusy(false); pending.current = false }
  }
  const phone = settings.phone.replace(/\D/g, '')
  return <dialog ref={dialog} className="quote-dialog" aria-labelledby="quote-title" onCancel={event => { event.preventDefault(); close() }} onClick={event => { if (event.target === event.currentTarget) close() }}>
    <button className="modal__close icon-button" onClick={close} disabled={busy} aria-label="Đóng biểu mẫu"><X /></button>
    {sentId ? <div className="success" role="status"><CheckCircle2 /><h2 id="quote-title">{sentId === 'EMAIL' ? 'Vui lòng gửi trong ứng dụng email' : ordering ? 'Đơn đã được thêm vào hệ thống' : 'Đã nhận yêu cầu của bạn'}</h2>{sentId !== 'EMAIL' && <p>{ordering ? 'Mã đơn' : 'Mã yêu cầu'}: <strong>{sentId}</strong></p>}<p>{sentId === 'EMAIL' ? `Website chưa xác nhận đã gửi. Kiểm tra nội dung và bấm Gửi tới ${settings.email}. Giỏ hàng vẫn được giữ lại.` : ordering ? 'Nhân viên DTPT-Techs sẽ liên hệ với quý khách để xác nhận và ship đơn.' : 'DTPT Techs sẽ liên hệ theo thông tin bạn cung cấp để xác nhận nhu cầu.'}</p><button className="primary-button" onClick={sentId === 'EMAIL' ? () => setSentId('') : close}>{sentId === 'EMAIL' ? 'Quay lại biểu mẫu' : 'Hoàn tất'}</button></div> : <>
      <small className="eyebrow">{ordering ? 'THÔNG TIN GIAO HÀNG' : 'TƯ VẤN & BÁO GIÁ'}</small><h2 id="quote-title">{ordering ? 'Đặt đơn' : 'Yêu cầu tư vấn / báo giá'}</h2><p>{ordering ? 'Nhập thông tin nhận hàng và kiểm tra giỏ hàng trước khi xác nhận đặt đơn.' : 'Chỉ cần họ tên và số điện thoại. Gửi yêu cầu chưa phải là đặt hàng hoặc thanh toán.'}</p>
      {quoteItems.length > 0 && <ul className="quote-summary" aria-label={ordering ? 'Thiết bị đặt đơn' : 'Thiết bị cần báo giá'}>{cart.lines.map(({ item, product, label }) => <li key={quoteLineKey(item)}>{product?.name || item.productId} — {label}<strong> × {item.quantity}</strong></li>)}</ul>}
      {ordering && <div className="checkout-total"><div className="cart-total"><span>{cart.pendingPrices ? 'Tạm tính phần có giá' : 'Tạm tính'}</span><strong>{cart.pendingPrices && !cart.subtotal ? 'Chờ báo giá' : formatMoney(cart.subtotal)}</strong></div><p>Giá chưa bao gồm phí ship. Nhân viên DTPT-Techs sẽ liên hệ xác nhận và thông báo phí giao hàng.</p>{cart.pendingPrices && <p>Một số thiết bị cần xác nhận giá; tạm tính chưa bao gồm các thiết bị này.</p>}</div>}
      {ordering && !api.enabled && <p className="form-error" role="alert">Hệ thống đặt đơn đang tạm ngưng. Vui lòng liên hệ DTPT-Techs qua điện thoại hoặc Zalo bên dưới.</p>}
      <form ref={form} onSubmit={submit} className="quote-form" aria-busy={busy}>
        <fieldset className="checkout-fields full" disabled={busy}>
        <label>Họ và tên *<input name="name" defaultValue={draft.name} autoComplete="name" required maxLength={100} /></label>
        <label>Số điện thoại / Zalo *<input name="phone" defaultValue={draft.phone} type="tel" autoComplete="tel" required maxLength={30} /></label>
        {ordering && <label className="full">Địa chỉ giao hàng *<textarea name="address" defaultValue={draft.address} rows={2} autoComplete="street-address" required maxLength={500} placeholder="Số nhà, đường, phường/xã, tỉnh/thành phố" /></label>}
        <label>Công ty / đơn vị<input name="company" defaultValue={draft.company} autoComplete="organization" maxLength={160} placeholder="Không bắt buộc" /></label>
        <label>{ordering ? 'Email liên hệ' : 'Email nhận báo giá'}<input name="email" defaultValue={draft.email} type="email" autoComplete="email" maxLength={160} placeholder="Không bắt buộc" /></label>
        <label className="full">{ordering ? 'Ghi chú đơn hàng' : 'Nhu cầu của bạn'}{!ordering && !quoteItems.length && ' *'}<textarea name="note" defaultValue={draft.note} rows={3} required={!ordering && !quoteItems.length} minLength={!ordering && !quoteItems.length ? 10 : undefined} maxLength={4000} placeholder={ordering ? 'Thời gian nhận hàng, yêu cầu cấu hình hoặc ghi chú khác (không bắt buộc)' : 'Ví dụ: cần đo nhiệt độ 8 điểm, kết nối RS-485, ngân sách và thời điểm cần hàng…'} /></label>
        </fieldset>
        <p className="form-privacy full">Thông tin bạn gửi được dùng để xử lý yêu cầu và liên hệ tư vấn. Xem <a href="/huong-dan-mua-hang#bao-mat" target="_blank" rel="noreferrer">thông tin bảo mật</a>.</p>
        {error && <p className="form-error full" role="alert">{error}</p>}
        <button className="primary-button full" disabled={busy || (ordering && (!api.enabled || !quoteItems.length || cart.unavailable))}>{busy ? 'Đang gửi…' : ordering ? 'Xác nhận đặt đơn' : api.enabled ? 'Gửi yêu cầu tư vấn / báo giá' : 'Soạn email yêu cầu'}</button>
      </form>
    </>}
    <div className="quote-direct"><span>Cần trao đổi ngay?</span><a href={`tel:${phone}`}>Gọi {settings.phone}</a><a href={`https://zalo.me/${phone}`} target="_blank" rel="noreferrer">Chat Zalo</a><a href={`mailto:${settings.email}`}>{settings.email}</a></div>
  </dialog>
}
