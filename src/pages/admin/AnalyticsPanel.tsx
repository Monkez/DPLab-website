import { BarChart3, Clock3, Eye, MousePointerClick, RefreshCw, TrendingDown, TrendingUp, UserRound, UsersRound } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { api } from '../../services/api'
import { useStore } from '../../store/StoreContext'
import type { AnalyticsBreakdown, AnalyticsMetric, AnalyticsReport } from '../../types'
import { formatDate, formatDateTime } from '../../utils/dateFormat'

const number = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 })
const duration = (seconds: number) => seconds < 60 ? `${Math.round(seconds)} giây` : `${number.format(seconds / 60)} phút`

function Change({ value }: { value: number | null }) {
  if (value === null) return <small className="metric-change">Chưa có kỳ trước</small>
  const positive = value >= 0
  return <small className={positive ? 'metric-change metric-change--up' : 'metric-change metric-change--down'}>{positive ? <TrendingUp /> : <TrendingDown />}{positive ? '+' : ''}{number.format(value)}% so với kỳ trước</small>
}

function MetricCard({ label, metric, icon: Icon, format = value => number.format(value) }: { label: string; metric: AnalyticsMetric; icon: typeof Eye; format?: (value: number) => string }) {
  return <article className="metric-card"><span><Icon /></span><div><small>{label}</small><strong>{format(metric.value)}</strong><Change value={metric.change} /></div></article>
}

function Breakdown({ title, items, label }: { title: string; items: AnalyticsBreakdown[]; label?: (value: string) => string }) {
  const max = Math.max(...items.map(item => item.value), 1)
  return <section className="analytics-card"><h2>{title}</h2>{items.length ? <div className="breakdown-list">{items.map(item => <div key={item.label}><div><span title={item.label}>{label ? label(item.label) : item.label}</span><b>{number.format(item.value)}</b></div><i><span style={{ width: `${item.value / max * 100}%` }} /></i></div>)}</div> : <p className="analytics-empty">Chưa có dữ liệu trong khoảng thời gian này.</p>}</section>
}

const deviceLabel = (value: string) => ({ desktop: 'Máy tính', tablet: 'Máy tính bảng', mobile: 'Điện thoại' }[value] || value)

export function AnalyticsPanel() {
  const { products } = useStore(); const [days, setDays] = useState(30); const [report, setReport] = useState<AnalyticsReport | null>(null); const [loading, setLoading] = useState(true); const [error, setError] = useState('')
  const productNames = useMemo(() => new Map(products.map(product => [product.id, `${product.name} · ${product.model}`])), [products])
  const load = async () => { setLoading(true); setError(''); try { setReport(await api.getAnalyticsReport(days)) } catch (reason) { setError(reason instanceof Error ? reason.message : 'Không tải được báo cáo') } finally { setLoading(false) } }
  useEffect(() => { void api.getAnalyticsReport(days).then(setReport).catch(reason => setError(reason instanceof Error ? reason.message : 'Không tải được báo cáo')).finally(() => setLoading(false)) }, [days])
  if (!report && loading) return <div className="analytics-loading"><RefreshCw /> Đang tổng hợp dữ liệu truy cập...</div>
  if (!report) return <div className="empty-results"><h2>Không tải được báo cáo</h2><p>{error}</p><button className="primary-button" onClick={load}>Thử lại</button></div>
  const maxViews = Math.max(...report.daily.map(point => point.views), 1)
  return <div className="analytics-panel">
    <div className="admin-toolbar"><p>Báo cáo không thu thập IP hay thông tin định danh cá nhân. Lượt truy cập khu vực admin được loại trừ.</p><label className="analytics-period">Khoảng thời gian<select value={days} onChange={event => { setLoading(true); setDays(Number(event.target.value)) }}><option value="7">7 ngày</option><option value="30">30 ngày</option><option value="90">90 ngày</option><option value="365">365 ngày</option></select></label><button className="secondary-button" disabled={loading} onClick={load}><RefreshCw />Làm mới</button></div>
    {error ? <p className="form-error">{error}</p> : null}
    <div className="metric-grid"><MetricCard label="Lượt xem trang" metric={report.summary.views} icon={Eye} /><MetricCard label="Người truy cập" metric={report.summary.visitors} icon={UserRound} /><MetricCard label="Phiên truy cập" metric={report.summary.sessions} icon={UsersRound} /><MetricCard label="Trang / phiên" metric={report.summary.pagesPerSession} icon={MousePointerClick} /><MetricCard label="Tỷ lệ thoát" metric={report.summary.bounceRate} icon={BarChart3} format={value => `${number.format(value)}%`} /><MetricCard label="Thời gian phiên TB" metric={report.summary.averageSessionSeconds} icon={Clock3} format={duration} /></div>
    <section className="analytics-card analytics-trend"><div className="analytics-card__title"><div><h2>Lưu lượng theo ngày</h2><p>{formatDate(report.daily[0]?.date)} – {formatDate(report.generatedAt)}</p></div><div className="visitor-split"><span><b>{number.format(report.summary.newVisitors)}</b> mới trong kỳ</span><span><b>{number.format(report.summary.returningVisitors)}</b> có trong kỳ trước</span></div></div><div className="traffic-chart" aria-label="Biểu đồ lượt xem theo ngày">{report.daily.map((point, index) => <div key={point.date} className="traffic-column" title={`${formatDate(point.date)}: ${point.views} lượt xem, ${point.visitors} người`}><span style={{ height: `${Math.max(point.views / maxViews * 100, point.views ? 5 : 1)}%` }} /><small>{report.daily.length <= 7 || index % Math.ceil(report.daily.length / 7) === 0 ? formatDate(point.date).slice(0, 5) : ''}</small></div>)}</div></section>
    <div className="analytics-grid"><Breakdown title="Trang được xem nhiều" items={report.topPages} /><Breakdown title="Sản phẩm được quan tâm" items={report.topProducts} label={value => productNames.get(value) || value} /><Breakdown title="Nguồn truy cập" items={report.sources} /><Breakdown title="Thiết bị" items={report.devices} label={deviceLabel} /><Breakdown title="Trình duyệt" items={report.browsers} /><Breakdown title="Hệ điều hành" items={report.operatingSystems} /><Breakdown title="Chiến dịch UTM" items={report.campaigns} /><Breakdown title="Khung giờ truy cập" items={report.hourly} /></div>
    <section className="analytics-card"><h2>Truy cập gần đây</h2><div className="recent-visits"><div className="recent-visits__head"><span>Thời gian</span><span>Trang</span><span>Nguồn</span><span>Thiết bị</span></div>{report.recentVisits.map((visit, index) => <div key={`${visit.createdAt}-${index}`}><time dateTime={visit.createdAt}>{formatDateTime(visit.createdAt)}</time><span title={visit.path}>{visit.path}</span><span>{visit.source}</span><span>{deviceLabel(visit.device)} · {visit.browser}</span></div>)}</div></section>
    <p className="analytics-note">Cập nhật báo cáo: {formatDateTime(report.generatedAt)}. Thời gian phiên được ước tính từ lần xem trang đầu tiên đến lần cuối trong cùng tab.</p>
  </div>
}
