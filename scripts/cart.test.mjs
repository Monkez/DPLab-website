import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import ts from 'typescript'

const source = await readFile(new URL('../src/utils/cart.ts', import.meta.url), 'utf8')
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText.replace('../../backend/src/productVariants.js', new URL('../backend/src/productVariants.js', import.meta.url).href)
const { cartDetails } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`)
const product = { id: 'PC', name: 'Máy tính', model: 'PC', status: 'active', priceMode: 'fixed', price: 2500000 }

test('cart totals account for quantities, selected variants and contact-only prices', () => {
  const products = [product, { ...product, id: 'CONTACT', priceMode: 'contact' }, { ...product, id: 'MULTI', variants: [{ id: '16gb', status: 'active', priceMode: 'fixed', price: 4000000, options: { RAM: '16 GB' } }] }]
  const cart = cartDetails(products, [{ productId: 'PC', quantity: 2 }, { productId: 'CONTACT', quantity: 3 }, { productId: 'MULTI', variantId: '16gb', quantity: 1 }])
  assert.equal(cart.subtotal, 9000000)
  assert.equal(cart.pendingPrices, true)
  assert.equal(cart.unavailable, false)
  assert.equal(cart.lines[2].unitPrice, 4000000)
  assert.equal(cart.lines[1].unitPrice, undefined)
})

test('stale cart lines stay visible for removal and are excluded from totals', () => {
  const cart = cartDetails([{ ...product, status: 'draft' }], [{ productId: 'PC', quantity: 2 }, { productId: 'MISSING', quantity: 1 }])
  assert.equal(cart.lines.length, 2)
  assert.equal(cart.subtotal, 0)
  assert.equal(cart.unavailable, true)
  assert.equal(cartDetails([product], [{ productId: 'PC', variantId: 'stale', quantity: 1 }]).unavailable, true)
  assert.equal(cartDetails([], []).unavailable, false)
})
