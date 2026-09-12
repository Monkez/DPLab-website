const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Asia/Ho_Chi_Minh',
})
const dateTimeFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Ho_Chi_Minh',
})

function parseDate(value: string | Date) {
  if (value instanceof Date) return value
  return new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00+07:00` : value)
}

export function formatDate(value?: string | Date) {
  if (!value) return '—'
  const parsed = parseDate(value)
  return Number.isNaN(parsed.getTime()) ? '—' : dateFormatter.format(parsed)
}

export function formatDateTime(value?: string | Date) {
  if (!value) return '—'
  const parsed = parseDate(value)
  return Number.isNaN(parsed.getTime()) ? '—' : dateTimeFormatter.format(parsed)
}
