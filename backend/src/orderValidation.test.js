import test from 'node:test'
import assert from 'node:assert/strict'
import { prepareOrderItems, validateOrderRequest } from './orderValidation.js'

const customer = { name: ' Nguyễn An ', phone: '0906 094 313', address: ' 12 Đường Test, Hà Nội ', note: '' }
const items = [{ productId: 'PC', quantity: 2 }]
const product = { id: 'PC', name: 'Máy tính', model: 'PC-1', status: 'active', priceMode: 'fixed', price: 2500000 }

test('orders require recipient contact, delivery address and a nonempty cart', () => {
  const valid = validateOrderRequest({ customer, items })
  assert.equal(valid.error, undefined)
  assert.equal(valid.customer.name, 'Nguyễn An')
  assert.equal(valid.customer.address, '12 Đường Test, Hà Nội')
  assert.equal(valid.customer.company, '')
  assert.equal(valid.customer.email, '')
  for (const payload of [
    { customer, items: [] },
    { customer: { ...customer, address: '' }, items },
    { customer: { ...customer, address: '  ' }, items },
    { customer: { ...customer, address: 12 }, items },
    { customer: { ...customer, address: 'x'.repeat(501) }, items },
    { customer: { ...customer, name: '' }, items },
    { customer: { ...customer, phone: 'bad' }, items },
    { customer, items: [{ productId: 'PC', quantity: 1.5 }] },
  ]) assert.ok(validateOrderRequest(payload).error)
})

test('order lines capture catalogue prices and model, ignoring forged client snapshots', () => {
  const [line] = prepareOrderItems([product], [{ ...items[0], unitPrice: 1, productName: 'Forged', variantModel: 'Forged' }])
  assert.equal(line.unitPrice, 2500000)
  assert.equal(line.productName, 'Máy tính')
  assert.equal(line.variantModel, 'PC-1')
  assert.equal(line.quantity, 2)
  const [contact] = prepareOrderItems([{ ...product, priceMode: 'contact' }], items)
  assert.equal(contact.unitPrice, undefined)
})

test('orders use the selected variant price and reject stale or unavailable configurations', () => {
  const multi = { ...product, variants: [
    { id: '8gb', model: 'PC-8', options: { RAM: '8 GB' }, priceMode: 'fixed', price: 4000000, status: 'active' },
    { id: '16gb', options: { RAM: '16 GB' }, priceMode: 'contact', status: 'active' },
    { id: 'old', options: { RAM: '4 GB' }, priceMode: 'fixed', price: 1, status: 'draft' },
  ] }
  const [line] = prepareOrderItems([multi], [{ ...items[0], variantId: '8gb' }])
  assert.equal(line.unitPrice, 4000000)
  assert.equal(line.variantModel, 'PC-8')
  assert.equal(line.variantLabel, 'RAM: 8 GB')
  assert.equal(prepareOrderItems([multi], [{ ...items[0], variantId: '16gb' }])[0].unitPrice, undefined)
  for (const variantId of [undefined, 'old', 'missing']) assert.throws(() => prepareOrderItems([multi], [{ ...items[0], variantId }]))
  assert.throws(() => prepareOrderItems([{ ...product, status: 'draft' }], items))
  assert.throws(() => prepareOrderItems([], items))
})
