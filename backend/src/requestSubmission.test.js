import test from 'node:test'
import assert from 'node:assert/strict'
import express from 'express'
import { createRequestSubmissionRouter } from './requestSubmission.js'

const product = { id: 'PC', name: 'Máy tính', model: 'PC-1', status: 'active', priceMode: 'fixed', price: 2500000 }
const customer = { name: 'Test Customer', phone: '0906094313', address: '12 Đường Test, Hà Nội', note: '' }
const items = [{ productId: 'PC', quantity: 2 }]

async function fixture(t, overrides = {}) {
  const saved = []
  const app = express()
  app.use(express.json())
  app.use('/api', createRequestSubmissionRouter({ listProducts: async () => [product], saveQuote: async value => { saved.push(value); return value }, ...overrides }))
  app.use((error, _req, res, _next) => res.status(500).json({ message: error.message }))
  const server = app.listen(0, '127.0.0.1')
  await new Promise(resolve => server.once('listening', resolve))
  t.after(() => new Promise(resolve => { server.close(resolve); server.closeAllConnections() }))
  const post = (path, body) => fetch(`http://127.0.0.1:${server.address().port}/api/${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  return { post, saved }
}

test('POST orders saves validated delivery information before returning a server-generated receipt', async t => {
  const { post, saved } = await fixture(t)
  const response = await post('orders', { customer, items: [{ ...items[0], unitPrice: 1 }], id: 'FORGED', status: 'won', shippingIncluded: true })
  assert.equal(response.status, 201)
  const order = await response.json()
  assert.deepEqual(saved, [order])
  assert.match(order.id, /^ORD-\d{6}-[a-f0-9]{12}$/)
  assert.equal(order.requestType, 'order')
  assert.equal(order.status, 'new')
  assert.equal(order.shippingIncluded, false)
  assert.equal(order.customer.address, customer.address)
  assert.equal(order.items[0].unitPrice, 2500000)
})

test('invalid orders and unavailable products are rejected without saving', async t => {
  const { post, saved } = await fixture(t)
  for (const body of [
    { customer: { ...customer, address: '' }, items },
    { customer, items: [] },
    { customer, items: [{ productId: 'missing', quantity: 1 }] },
    { customer, items: [{ productId: 'PC', quantity: 1000 }] },
    { customer, items: [{ productId: 'PC', quantity: 1, variantId: 'stale' }] },
  ]) assert.equal((await post('orders', body)).status, 400)
  assert.equal(saved.length, 0)
})

test('a failed save cannot produce a successful order receipt', async t => {
  const { post } = await fixture(t, { saveQuote: async () => { throw new Error('Database unavailable') } })
  assert.equal((await post('orders', { customer, items })).status, 500)
})

test('the quote endpoint preserves product RFQs and consultation without requiring an address', async t => {
  const { post, saved } = await fixture(t)
  for (const body of [
    { customer: { name: customer.name, phone: customer.phone }, items, requestType: 'order' },
    { customer: { name: customer.name, phone: customer.phone, note: 'Cần tư vấn thiết bị đo' }, items: [] },
  ]) {
    const response = await post('quotes', body)
    assert.equal(response.status, 201)
    const quote = await response.json()
    assert.match(quote.id, /^RFQ-/)
    assert.equal(quote.requestType, 'quote')
    assert.equal(quote.shippingIncluded, undefined)
  }
  assert.equal(saved.length, 2)
})
