import { Eye, Monitor, MousePointerClick, RefreshCcw, Smartphone, Tablet, Timer, TrendingDown, TrendingUp, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { api } from '../../services/api'
import type { AnalyticsEvent, Product } from '../../types'

type Period = 7 | 30 | 90

const number = (value: number, digits = 0) => new Intl.NumberFormat('vi-VN', { maximumFractionDigits: digits }).format(value)
const dateKey = (value: Date) => new Intl.DateTimeFormat('en-CA').format(value)

function percentChange(current: number, previous: number) {
  if (!previous) return current ? 100 : 0
  return Math.round(((current - previous) / previous) * 100)
}

function sourceName(referrer?: string) {
  const value = (referrer || '').toLowerCase()
  if (!value || value === 'trực tiếp') return 'Trực tiếp'
  if (value.includes('google')) return 'Google'
  if (value.includes('facebook') || value.includes('fb.')) return 'Facebook'
  if (value.includes('zalo')) return 'Zalo'
  if (value.includes('dtpt.shop') || value.includes('localhost') || value.includes('127.0.0.1')) return 'Nội bộ'
  return referrer || 'Khác'
}

function pageName(path: string) {
  if (path === '/' || path.startsWith('/?')) return 'Trang chủ'
  if (path.startsWith('/laptop?')) return 'Danh mục / tìm kiếm'
  if (path === '/laptop') return 'Tất cả laptop'
  return decodeURIComponent(path.split('?')[0]).replace(/^\//, '') || 'Trang chủ'
}

interface Summary {
  views: number
  visitors: number
  sessions: number
  bounceRate: number
  pagesPerSession: number
}

function summarize(events: AnalyticsEvent[]): Summary {
  const sessions = new Map<string, number>()
  events.forEach(event => sessions.set(event.sessionId, (sessions.get(event.sessionId) || 0) + 1))
  const bounced = [...sessions.values()].filter(views => views === 1).length
  return {
    views: events.length,
    visitors: new Set(events.map(event => event.visitorId)).size,
    sessions: sessions.size,
    bounceRate: sessions.size ? Math.round((bounced / sessions.size) * 100) : 0,
    pagesPerSession: sessions.size ? events.length / sessions.size : 0,
  }
}

export function AnalyticsTab({ products }: { products: Product[] }) {
  const [period, setPeriod] = useState<Period>(30)
  const [events, setEvents] = useState<AnalyticsEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    api.getAnalyticsEvents(period)
      .then(data => { if (active) setEvents(data) })
      .catch(cause => { if (active) setError(cause instanceof Error ? cause.message : 'Không tải được dữ liệu truy cập') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [period, refreshKey])

  const report = useMemo(() => {
    const now = Date.now()
    const start = now - period * 86400000
    const previousStart = now - period * 2 * 86400000
    const currentEvents = events.filter(event => new Date(event.createdAt).getTime() >= start)
    const previousEvents = events.filter(event => {
      const time = new Date(event.createdAt).getTime()
      return time >= previousStart && time < start
    })
    const current = summarize(currentEvents)
    const previous = summarize(previousEvents)
    const days = Array.from({ length: period }, (_, index) => {
      const day = new Date(now - (period - index - 1) * 86400000)
      const key = dateKey(day)
      const dayEvents = currentEvents.filter(event => dateKey(new Date(event.createdAt)) === key)
      return { key, label: day.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }), views: dayEvents.length, visitors: new Set(dayEvents.map(event => event.visitorId)).size }
    })
    const countBy = (getKey: (event: AnalyticsEvent) => string) => [...currentEvents.reduce((map, event) => {
      const key = getKey(event)
      map.set(key, (map.get(key) || 0) + 1)
      return map
    }, new Map<string, number>())].sort((a, b) => b[1] - a[1])
    const productNames = new Map(products.map(product => [product.id, product.name]))
    return {
      current,
      previous,
      days,
      pages: countBy(event => pageName(event.path)).slice(0, 8),
      products: countBy(event => event.productId ? productNames.get(event.productId) || event.productId : '').filter(([name]) => name).slice(0, 8),
      sources: countBy(event => sourceName(event.referrer)).slice(0, 6),
      devices: countBy(event => event.device),
    }
  }, [events, period, products])

  const maxViews = Math.max(...report.days.map(day => day.views), 1)
  const deviceIcon = { desktop: <Monitor />, tablet: <Tablet />, mobile: <Smartphone /> }
  const deviceLabel = { desktop: 'Máy tính', tablet: 'Máy tính bảng', mobile: 'Điện thoại' }

  return <>
    <div className="admin-title analytics-title">
      <div><p className="eyebrow">PHÂN TÍCH CHUYÊN SÂU</p><h1>Báo cáo lượt truy cập</h1><p>Theo dõi hành vi khách hàng và hiệu quả nội dung trên website.</p></div>
      <div className="analytics-actions">
        <select value={period} onChange={event => setPeriod(Number(event.target.value) as Period)} aria-label="Khoảng thời gian">
          <option value={7}>7 ngày qua</option><option value={30}>30 ngày qua</option><option value={90}>90 ngày qua</option>
        </select>
        <button className="button button--light" onClick={() => setRefreshKey(value => value + 1)} disabled={loading}><RefreshCcw />{loading ? 'Đang tải' : 'Làm mới'}</button>
      </div>
    </div>

    {error && <div className="analytics-alert">{error}</div>}
    <div className="analytics-metrics">
      <AnalyticsMetric icon={<Eye />} label="Lượt xem trang" value={number(report.current.views)} change={percentChange(report.current.views, report.previous.views)} />
      <AnalyticsMetric icon={<Users />} label="Khách truy cập" value={number(report.current.visitors)} change={percentChange(report.current.visitors, report.previous.visitors)} />
      <AnalyticsMetric icon={<MousePointerClick />} label="Phiên truy cập" value={number(report.current.sessions)} change={percentChange(report.current.sessions, report.previous.sessions)} />
      <AnalyticsMetric icon={<Timer />} label="Trang / phiên" value={number(report.current.pagesPerSession, 1)} change={percentChange(report.current.pagesPerSession, report.previous.pagesPerSession)} />
    </div>

    <div className="analytics-overview-grid">
      <section className="admin-panel analytics-chart-panel">
        <div className="panel-heading"><div><h2>Xu hướng truy cập</h2><p>Lượt xem và khách truy cập theo ngày</p></div><span className="analytics-legend"><i />Lượt xem <i />Khách</span></div>
        <div className="analytics-chart">
          {report.days.map((day, index) => <div className="analytics-day" key={day.key} title={`${day.label}: ${day.views} lượt xem, ${day.visitors} khách`}>
            <div className="analytics-bar-wrap"><i style={{ height: `${Math.max((day.views / maxViews) * 100, day.views ? 4 : 0)}%` }} /><b style={{ height: `${Math.max((day.visitors / maxViews) * 100, day.visitors ? 3 : 0)}%` }} /></div>
            {(period === 7 || index % Math.ceil(period / 10) === 0) && <small>{day.label}</small>}
          </div>)}
        </div>
        {!loading && report.current.views === 0 && <p className="analytics-empty">Chưa có lượt truy cập trong khoảng thời gian này. Dữ liệu mới sẽ xuất hiện sau khi khách mở website.</p>}
      </section>
      <section className="admin-panel analytics-quality">
        <div className="panel-heading"><div><h2>Chất lượng phiên</h2><p>Mức độ tương tác của khách</p></div></div>
        <div className="quality-score"><strong>{report.current.bounceRate}%</strong><span>Tỷ lệ thoát</span></div>
        <div className="quality-track"><i style={{ width: `${report.current.bounceRate}%` }} /></div>
        <p>Tỷ lệ phiên chỉ xem một trang. Càng thấp, khách càng quan tâm đến nhiều nội dung.</p>
        <dl><div><dt>{number(report.current.pagesPerSession, 1)}</dt><dd>Trang / phiên</dd></div><div><dt>{number(report.current.visitors ? report.current.views / report.current.visitors : 0, 1)}</dt><dd>Lượt xem / khách</dd></div></dl>
      </section>
    </div>

    <div className="analytics-detail-grid">
      <RankingPanel title="Trang được xem nhiều" subtitle="Nội dung thu hút nhất" rows={report.pages} total={report.current.views} />
      <RankingPanel title="Sản phẩm được quan tâm" subtitle="Chi tiết laptop có nhiều lượt xem" rows={report.products} total={report.products.reduce((sum, row) => sum + row[1], 0)} />
      <RankingPanel title="Nguồn truy cập" subtitle="Khách đến từ đâu" rows={report.sources} total={report.current.views} />
      <section className="admin-panel analytics-ranking">
        <div className="panel-heading"><div><h2>Thiết bị</h2><p>Thiết bị khách đang sử dụng</p></div></div>
        <div className="device-list">{report.devices.map(([device, count]) => <div key={device}><span>{deviceIcon[device as keyof typeof deviceIcon] || <Monitor />}<b>{deviceLabel[device as keyof typeof deviceLabel] || device}</b></span><strong>{number(count)}<small>{report.current.views ? Math.round((count / report.current.views) * 100) : 0}%</small></strong></div>)}</div>
      </section>
    </div>
  </>
}

function AnalyticsMetric({ icon, label, value, change }: { icon: React.ReactNode; label: string; value: string; change: number }) {
  const positive = change >= 0
  return <article className="admin-panel analytics-metric"><span>{icon}</span><small>{label}</small><strong>{value}</strong><p className={positive ? 'positive' : 'negative'}>{positive ? <TrendingUp /> : <TrendingDown />}{Math.abs(change)}% <em>so với kỳ trước</em></p></article>
}

function RankingPanel({ title, subtitle, rows, total }: { title: string; subtitle: string; rows: [string, number][]; total: number }) {
  const max = Math.max(...rows.map(row => row[1]), 1)
  return <section className="admin-panel analytics-ranking">
    <div className="panel-heading"><div><h2>{title}</h2><p>{subtitle}</p></div></div>
    {rows.length ? <ol>{rows.map(([name, count]) => <li key={name}><div><span title={name}>{name}</span><strong>{number(count)}</strong></div><i><b style={{ width: `${(count / max) * 100}%` }} /></i><small>{total ? Math.round((count / total) * 100) : 0}% tổng lượt xem</small></li>)}</ol> : <p className="analytics-empty">Chưa có dữ liệu.</p>}
  </section>
}
