import assert from 'node:assert/strict'
import test from 'node:test'
import { buildAnalyticsReport } from './analyticsReport.js'

const event = (overrides = {}) => ({ eventId: crypto.randomUUID(), visitorId: 'v1', sessionId: 's1', eventType: 'page_view', path: '/', device: 'desktop', createdAt: '2026-09-10T02:00:00.000Z', ...overrides })

test('analytics report calculates sessions and excludes admin traffic', () => {
  const report = buildAnalyticsReport([
    event(), event({ path: '/san-pham', createdAt: '2026-09-10T02:02:00.000Z' }),
    event({ path: '/admin', sessionId: 'admin' }),
    event({ visitorId: 'v2', sessionId: 's2', path: '/tin-tuc' }),
  ], 7, new Date('2026-09-11T00:00:00.000Z'))
  assert.equal(report.summary.views.value, 3)
  assert.equal(report.summary.visitors.value, 2)
  assert.equal(report.summary.sessions.value, 2)
  assert.equal(report.summary.bounceRate.value, 50)
  assert.equal(report.topPages[0].label, '/')
})

test('analytics report attributes UTM and referrer sources', () => {
  const report = buildAnalyticsReport([
    event({ utmSource: 'google', utmMedium: 'cpc' }),
    event({ visitorId: 'v2', sessionId: 's2', referrer: 'https://example.com/a' }),
  ], 7, new Date('2026-09-11T00:00:00.000Z'))
  assert.deepEqual(report.sources.map(item => item.label).sort(), ['example.com', 'google / cpc'])
})
