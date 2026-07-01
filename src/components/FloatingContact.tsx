import { Phone } from 'lucide-react'
import type { StoreSettings } from '../types'

export function FloatingContact({ settings }: { settings: StoreSettings }) {
  const phone = settings.phone.replace(/\s/g, '')
  const facebook = settings.facebook.startsWith('http') ? settings.facebook : `https://${settings.facebook}`
  return <div className="floating-contact" aria-label="Liên hệ nhanh">
    <a className="floating-contact__item floating-contact__item--facebook" href={facebook} target="_blank" rel="noreferrer" aria-label="Facebook DP Lab">f</a>
    <a className="floating-contact__item floating-contact__item--zalo" href={`https://zalo.me/${phone}`} target="_blank" rel="noreferrer" aria-label="Zalo DP Lab">Zalo</a>
    <a className="floating-contact__item floating-contact__item--call" href={`tel:${phone}`} aria-label="Gọi DP Lab"><Phone /></a>
  </div>
}
