import type { StoreSettings } from '../types'

export function FloatingContact({ settings }: { settings: StoreSettings }) {
  const phone = settings.phone.replace(/\s/g, '')

  return (
    <aside className="floating-contact" aria-label="Liên hệ nhanh">
      <a className="zalo-contact" href={`https://zalo.me/${phone}`} aria-label={`Chat Zalo ${settings.phone}`}>
        <img src="/contact/zalo.png" width="30" height="30" alt="Zalo" />
      </a>
      <a className="phone-contact" href={`tel:${phone}`} aria-label={`Gọi ${settings.phone}`}>
        <img src="/contact/phone.png" width="30" height="30" alt="Điện thoại" />
      </a>
    </aside>
  )
}
