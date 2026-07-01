import { Phone } from 'lucide-react'
import type { StoreSettings } from '../types'

export function FloatingContact({ settings }: { settings: StoreSettings }) {
  const phone = settings.phone.replace(/\s/g, '')
  const facebook = settings.facebook.startsWith('http') ? settings.facebook : `https://${settings.facebook}`

  return <div className="floating-contact" aria-label="Liên hệ nhanh">
    <a className="floating-contact__item floating-contact__item--facebook" href={facebook} target="_blank" rel="noreferrer" aria-label="Facebook DTPT Shop">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M15.2 8.1h2.3V4.2c-.4-.1-1.8-.2-3.4-.2-3.3 0-5.6 2.1-5.6 5.9v3.3H4.8v4.4h3.7V24h4.6v-6.4h3.6l.6-4.4h-4.2v-2.9c0-1.3.3-2.2 2.1-2.2z" /></svg>
    </a>
    <a className="floating-contact__item floating-contact__item--zalo" href={`https://zalo.me/${phone}`} target="_blank" rel="noreferrer" aria-label="Zalo DTPT Shop">Zalo</a>
    <a className="floating-contact__item floating-contact__item--call" href={`tel:${phone}`} aria-label="Gọi DTPT Shop"><Phone /></a>
  </div>
}
