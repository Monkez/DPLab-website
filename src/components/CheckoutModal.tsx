import { CheckCircle2, X } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { api } from '../services/api'
import { useStore } from '../store/StoreContext'

export function CheckoutModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { submitQuote, products, quoteItems, settings } = useStore()
  const [sentId, setSentId] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    const data = new FormData(event.currentTarget)
    const customer = { name: String(data.get('name')), company: String(data.get('company')), phone: String(data.get('phone')), email: String(data.get('email')), note: String(data.get('note')) }
    const emailLines = quoteItems.map(item => { const product = products.find(value => value.id === item.productId); return `- ${product?.name || item.productId} (${product?.model || item.productId}) x ${item.quantity}` })
    try {
      const quote = await submitQuote(customer)
      if (!api.enabled) {
        const subject = encodeURIComponent(`Yêu cầu báo giá từ ${customer.company}`)
        const body = encodeURIComponent(`Họ tên: ${customer.name}\nCông ty: ${customer.company}\nĐiện thoại: ${customer.phone}\nEmail: ${customer.email}\n\nSản phẩm:\n${emailLines.join('\n')}\n\nYêu cầu kỹ thuật:\n${customer.note}`)
        window.location.href = `mailto:${settings.email}?subject=${subject}&body=${body}`
        setSentId('EMAIL')
      } else setSentId(quote.id)
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Không thể gửi yêu cầu') } finally { setBusy(false) }
  }
  const close = () => { setSentId(''); setError(''); onClose() }
  if (!open) return null
  const emailMode = sentId === 'EMAIL'
  return <div className="modal-shell"><button className="drawer-backdrop" onClick={close} aria-label="Đóng" /><div className="modal"><button className="modal__close icon-button" onClick={close}><X /></button>{sentId ? <div className="success"><CheckCircle2 /><h2>{emailMode ? 'Email yêu cầu đã được chuẩn bị' : 'Đã nhận yêu cầu'}</h2>{!emailMode && <p>Mã yêu cầu: <strong>{sentId}</strong></p>}<p>{emailMode ? `Vui lòng kiểm tra ứng dụng email và bấm gửi tới ${settings.email}.` : 'DTPT Techs sẽ liên hệ để trao đổi chi tiết kỹ thuật và báo giá.'}</p><button className="primary-button" onClick={close}>Hoàn tất</button></div> : <><small className="eyebrow">YÊU CẦU BÁO GIÁ</small><h2>Cho chúng tôi biết nhu cầu của bạn</h2><p>Thông tin này giúp kỹ sư chuẩn bị phương án phù hợp trước khi liên hệ.</p><form onSubmit={submit} className="quote-form"><label>Họ và tên *<input name="name" required /></label><label>Công ty / đơn vị *<input name="company" required /></label><label>Số điện thoại *<input name="phone" required /></label><label>Email *<input name="email" type="email" required /></label><label className="full">Yêu cầu kỹ thuật<textarea name="note" rows={4} placeholder="Ứng dụng, thông số, số lượng, điều kiện vận hành..." /></label>{error && <p className="form-error full">{error}</p>}<button className="primary-button full" disabled={busy}>{busy ? 'Đang xử lý...' : api.enabled ? 'Gửi yêu cầu' : 'Tạo email yêu cầu'}</button></form></>}</div></div>
}
