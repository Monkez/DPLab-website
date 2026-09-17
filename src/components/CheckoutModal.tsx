import { CheckCircle2, X } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { validateQuoteRequest } from '../../backend/src/quoteValidation.js'
import { api } from '../services/api'
import { useStore } from '../store/StoreContext'

export function CheckoutModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { submitQuote, products, quoteItems, settings } = useStore()
  const [sentId, setSentId] = useState(''), [busy, setBusy] = useState(false), [error, setError] = useState('')
  const [draft, setDraft] = useState({ name: '', company: '', phone: '', email: '', note: '' })
  const dialog = useRef<HTMLDialogElement>(null)
  const form = useRef<HTMLFormElement>(null)
  useEffect(() => {
    if (open) { const node = dialog.current; node?.showModal(); const previous = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = previous; node?.close() } }
  }, [open])
  const close = () => { if (busy) return; setSentId(''); setError(''); onClose() }
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (busy) return
    setBusy(true); setError('')
    const data = new FormData(event.currentTarget)
    const customer = { name: String(data.get('name') || '').trim(), company: String(data.get('company') || '').trim(), phone: String(data.get('phone') || '').trim(), email: String(data.get('email') || '').trim(), note: String(data.get('note') || '').trim() }
    setDraft(customer)
    const validation = validateQuoteRequest({ customer, items: quoteItems })
    if (validation.error) { setError(validation.error); setBusy(false); return }
    try {
      if (!api.enabled) {
        const lines = quoteItems.map(item => { const product = products.find(value => value.id === item.productId); return `- ${product?.name || item.productId} (${product?.model || item.productId}) x ${item.quantity}${item.requirement ? `: ${item.requirement}` : ''}` })
        const subject = encodeURIComponent(`Yêu cầu tư vấn / báo giá từ ${customer.company || customer.name}`)
        const body = encodeURIComponent(`Họ tên: ${customer.name}\nĐơn vị: ${customer.company}\nĐiện thoại: ${customer.phone}\nEmail: ${customer.email}\n\n${lines.join('\n')}\n\nNhu cầu:\n${customer.note}`)
        window.location.href = `mailto:${settings.email}?subject=${subject}&body=${body}`
        setSentId('EMAIL') // Opening an email client is not a confirmed submission; keep the list.
      } else { const quote = await submitQuote(customer); setSentId(quote.id); setDraft({ name: '', company: '', phone: '', email: '', note: '' }); form.current?.reset() }
    } catch { setError('Chưa gửi được yêu cầu. Thông tin vẫn được giữ lại; vui lòng thử lại hoặc liên hệ trực tiếp bên dưới.') } finally { setBusy(false) }
  }
  const phone = settings.phone.replace(/\D/g, '')
  return <dialog ref={dialog} className="quote-dialog" aria-labelledby="quote-title" onCancel={event => { event.preventDefault(); close() }} onClick={event => { if (event.target === event.currentTarget) close() }}>
    <button className="modal__close icon-button" onClick={close} disabled={busy} aria-label="Đóng biểu mẫu"><X /></button>
    {sentId ? <div className="success"><CheckCircle2 /><h2 id="quote-title">{sentId === 'EMAIL' ? 'Vui lòng gửi trong ứng dụng email' : 'Đã nhận yêu cầu của bạn'}</h2>{sentId !== 'EMAIL' && <p>Mã yêu cầu: <strong>{sentId}</strong></p>}<p>{sentId === 'EMAIL' ? `Website chưa xác nhận đã gửi. Kiểm tra nội dung và bấm Gửi tới ${settings.email}. Danh sách thiết bị vẫn được giữ lại.` : 'DTPT Techs sẽ liên hệ theo thông tin bạn cung cấp để xác nhận nhu cầu.'}</p><button className="primary-button" onClick={sentId === 'EMAIL' ? () => setSentId('') : close}>{sentId === 'EMAIL' ? 'Quay lại biểu mẫu' : 'Hoàn tất'}</button></div> : <>
      <small className="eyebrow">TƯ VẤN & BÁO GIÁ</small><h2 id="quote-title">Bạn cần thiết bị cho ứng dụng nào?</h2><p>Chỉ cần họ tên và số điện thoại. Gửi yêu cầu chưa phải là đặt hàng hoặc thanh toán.</p>
      {quoteItems.length > 0 && <ul className="quote-summary" aria-label="Thiết bị cần báo giá">{quoteItems.map(item => <li key={item.productId}>{products.find(product => product.id === item.productId)?.model || item.productId}<strong> × {item.quantity}</strong></li>)}</ul>}
      <form ref={form} onSubmit={submit} className="quote-form">
        <label>Họ và tên *<input name="name" defaultValue={draft.name} autoComplete="name" required maxLength={100} /></label>
        <label>Số điện thoại / Zalo *<input name="phone" defaultValue={draft.phone} type="tel" autoComplete="tel" required maxLength={30} /></label>
        <label>Công ty / đơn vị<input name="company" defaultValue={draft.company} autoComplete="organization" maxLength={160} placeholder="Không bắt buộc" /></label>
        <label>Email nhận báo giá<input name="email" defaultValue={draft.email} type="email" autoComplete="email" maxLength={160} placeholder="Không bắt buộc" /></label>
        <label className="full">Nhu cầu của bạn{!quoteItems.length && ' *'}<textarea name="note" defaultValue={draft.note} rows={3} required={!quoteItems.length} minLength={quoteItems.length ? undefined : 10} maxLength={4000} placeholder="Ví dụ: cần đo nhiệt độ 8 điểm, kết nối RS-485, ngân sách và thời điểm cần hàng…" /></label>
        <p className="form-privacy full">Thông tin bạn gửi được dùng để xử lý yêu cầu và liên hệ tư vấn. Xem <a href="/huong-dan-mua-hang#bao-mat" target="_blank" rel="noreferrer">thông tin bảo mật</a>.</p>
        {error && <p className="form-error full" role="alert">{error}</p>}
        <button className="primary-button full" disabled={busy}>{busy ? 'Đang gửi…' : api.enabled ? 'Gửi yêu cầu tư vấn / báo giá' : 'Soạn email yêu cầu'}</button>
      </form>
    </>}
    <div className="quote-direct"><span>Cần trao đổi ngay?</span><a href={`tel:${phone}`}>Gọi {settings.phone}</a><a href={`https://zalo.me/${phone}`} target="_blank" rel="noreferrer">Chat Zalo</a><a href={`mailto:${settings.email}`}>{settings.email}</a></div>
  </dialog>
}
