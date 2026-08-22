import type { ReactNode } from 'react'

export function Field({ label, wide, children }: { label: string; wide?: boolean; children: ReactNode }) {
  return <label className={wide ? 'admin-field admin-field--wide' : 'admin-field'}><span>{label}</span>{children}</label>
}
