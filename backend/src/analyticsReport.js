const DAY_MS = 86400000
const siteHosts = new Set(['dtpt.shop', 'www.dtpt.shop'])
const dateKeyFormatter = new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Ho_Chi_Minh' })
const hourFormatter = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', hourCycle: 'h23', timeZone: 'Asia/Ho_Chi_Minh' })

const dateKey = value => dateKeyFormatter.format(new Date(value))
const change = (current, previous) => previous ? Math.round(((current - previous) / previous) * 1000) / 10 : current ? null : 0
const metric = (current, previous) => ({ value: Math.round(current * 10) / 10, change: change(current, previous) })
const top = (items, limit = 10) => [...items.entries()].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value || a.label.localeCompare(b.label)).slice(0, limit)
const add = (map, key, amount = 1) => map.set(key || 'Không xác định', (map.get(key || 'Không xác định') || 0) + amount)

function sourceOf(event) {
  if (event.utmSource) return event.utmMedium ? `${event.utmSource} / ${event.utmMedium}` : event.utmSource
  if (!event.referrer || event.referrer === 'Trực tiếp') return 'Trực tiếp'
  try {
    const host = new URL(event.referrer).hostname.replace(/^www\./, '')
    return !host || siteHosts.has(host) ? 'Trực tiếp' : host
  } catch { return event.referrer }
}

function summarize(events) {
  const sessions = new Map(); const visitors = new Set()
  for (const event of events) {
    visitors.add(event.visitorId)
    const current = sessions.get(event.sessionId) || { views: 0, first: Infinity, last: 0 }
    const time = new Date(event.createdAt).getTime()
    current.views += 1; current.first = Math.min(current.first, time); current.last = Math.max(current.last, time)
    sessions.set(event.sessionId, current)
  }
  const values = [...sessions.values()]
  const sessionCount = values.length
  return {
    views: events.length,
    visitors: visitors.size,
    sessions: sessionCount,
    pagesPerSession: sessionCount ? events.length / sessionCount : 0,
    bounceRate: sessionCount ? values.filter(item => item.views === 1).length / sessionCount * 100 : 0,
    averageSessionSeconds: sessionCount ? values.reduce((sum, item) => sum + Math.max(0, item.last - item.first) / 1000, 0) / sessionCount : 0,
  }
}

export function buildAnalyticsReport(events, requestedDays = 30, nowValue = new Date()) {
  const days = Math.min(Math.max(Number(requestedDays) || 30, 1), 365)
  const now = new Date(nowValue)
  const currentDays = Array.from({ length: days }, (_, index) => dateKey(new Date(now.getTime() - (days - index - 1) * DAY_MS)))
  const previousDays = Array.from({ length: days }, (_, index) => dateKey(new Date(now.getTime() - (days * 2 - index - 1) * DAY_MS)))
  const currentDaySet = new Set(currentDays); const previousDaySet = new Set(previousDays)
  const valid = events.filter(event => event.eventType === 'page_view' && !String(event.path || '').startsWith('/admin') && Number.isFinite(new Date(event.createdAt).getTime()))
  const current = valid.filter(event => currentDaySet.has(dateKey(event.createdAt)) && new Date(event.createdAt) <= now)
  const previous = valid.filter(event => previousDaySet.has(dateKey(event.createdAt)))
  const a = summarize(current); const b = summarize(previous)
  const previousVisitors = new Set(previous.map(event => event.visitorId)); const currentVisitors = new Set(current.map(event => event.visitorId))
  const returningVisitors = [...currentVisitors].filter(id => previousVisitors.has(id)).length
  const pages = new Map(); const products = new Map(); const sources = new Map(); const campaigns = new Map(); const devices = new Map(); const browsers = new Map(); const systems = new Map(); const hours = new Map(); const dailyTotals = new Map()
  for (const event of current) {
    add(pages, String(event.path || '/').split('?')[0]); if (event.productId) add(products, event.productId)
    add(sources, sourceOf(event)); if (event.utmCampaign) add(campaigns, event.utmCampaign)
    add(devices, event.device || 'desktop'); add(browsers, event.browser || 'Không xác định'); add(systems, event.operatingSystem || 'Không xác định')
    add(hours, `${hourFormatter.format(new Date(event.createdAt))}:00`)
    const day = dateKey(event.createdAt); const total = dailyTotals.get(day) || { views: 0, visitors: new Set(), sessions: new Set() }
    total.views += 1; total.visitors.add(event.visitorId); total.sessions.add(event.sessionId); dailyTotals.set(day, total)
  }
  const daily = currentDays.map(key => {
    const total = dailyTotals.get(key)
    return { date: key, views: total?.views || 0, visitors: total?.visitors.size || 0, sessions: total?.sessions.size || 0 }
  })
  return {
    days, generatedAt: now.toISOString(),
    summary: { views: metric(a.views, b.views), visitors: metric(a.visitors, b.visitors), sessions: metric(a.sessions, b.sessions), pagesPerSession: metric(a.pagesPerSession, b.pagesPerSession), bounceRate: metric(a.bounceRate, b.bounceRate), averageSessionSeconds: metric(a.averageSessionSeconds, b.averageSessionSeconds), newVisitors: currentVisitors.size - returningVisitors, returningVisitors },
    daily, topPages: top(pages), topProducts: top(products), sources: top(sources), campaigns: top(campaigns), devices: top(devices), browsers: top(browsers), operatingSystems: top(systems), hourly: top(hours, 24).sort((x, y) => x.label.localeCompare(y.label)),
    recentVisits: [...current].sort((x, y) => new Date(y.createdAt) - new Date(x.createdAt)).slice(0, 20).map(event => ({ path: event.path, source: sourceOf(event), device: event.device || 'desktop', browser: event.browser || 'Không xác định', createdAt: event.createdAt })),
  }
}
