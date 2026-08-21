import { Mail, Phone } from 'lucide-react'
import type { StoreSettings } from '../types'
export function FloatingContact({ settings }: { settings: StoreSettings }) { return <div className="floating-contact"><a href={`tel:${settings.phone.replace(/\s/g, '')}`} aria-label="Gọi điện"><Phone /></a><a href={`mailto:${settings.email}`} aria-label="Gửi email"><Mail /></a></div> }
