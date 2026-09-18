import test from 'node:test'
import assert from 'node:assert/strict'
import { embeddedConfigurations } from './embeddedProducts.js'
import { groupEmbeddedProducts, migrateProductVariants } from './variantGroups.js'
import { summarizeProduct, variantProduct, validateVariants, prepareQuoteItems, quoteLineKey, quoteItemLabel } from './productVariants.js'

test('group existing boards without losing prices, images, custom fields or old URLs', () => {
  const source = structuredClone(embeddedConfigurations)
  source.find(p => p.id === 'SBC-102').price = 5000000
  source.find(p => p.id === 'SBC-102').images = ['/custom-image.jpg']
  const grouped = groupEmbeddedProducts(source)
  const pi = grouped.find(p => p.id === 'SBC-101')
  assert.equal(grouped.filter(p => p.status === 'active').length, 4)
  assert.equal(pi.slug, 'raspberry-pi-5')
  assert.equal(pi.variants.length, 4)
  assert.equal(pi.price, 2187000)
  assert.equal(pi.priceMode, 'from')
  assert.equal(pi.variants.find(v => v.id === 'SBC-102').price, 5000000)
  assert.deepEqual(pi.variants.find(v => v.id === 'SBC-102').images, ['/custom-image.jpg'])
  assert.ok(pi.legacySlugs.some(a => a.slug === 'raspberry-pi-5-8gb' && a.variantId === 'SBC-102'))
  assert.equal(grouped.find(p => p.id === 'SBC-102').redirectTo, pi.id)
  assert.equal(source.find(p => p.id === 'SBC-102').status, 'active')
  assert.deepEqual(groupEmbeddedProducts(grouped), grouped)
})

const multi = { id: 'TEST', name: 'Test', model: 'T', status: 'active', images: ['/common.jpg'], variants: [
  { id: 'black8', options: { RAM: '8 GB', 'Màu sắc': 'Đen' }, status: 'active', priceMode: 'fixed', price: 100 },
  { id: 'white16', options: { RAM: '16 GB', 'Màu sắc': 'Trắng' }, status: 'active', priceMode: 'contact' },
  { id: 'hidden', options: { RAM: '4 GB', 'Màu sắc': 'Đen' }, status: 'draft', priceMode: 'fixed', price: 1 },
] }
test('generic option validation rejects duplicates, missing dimensions and bad prices', () => {
  assert.equal(validateVariants(multi), '')
  assert.ok(validateVariants({ ...multi, variants: [...multi.variants, { ...multi.variants[0], id: 'duplicate' }] }))
  assert.ok(validateVariants({ ...multi, variants: [{ ...multi.variants[0], price: -1 }] }))
  assert.ok(validateVariants({ ...multi, variants: [multi.variants[0], { ...multi.variants[1], options: { RAM: '16 GB' } }] }))
  assert.ok(validateVariants({ ...multi, variants: [multi.variants[2]] }))
  assert.equal(summarizeProduct(multi).price, 100)
  assert.equal(variantProduct(multi, multi.variants[1]).price, undefined)
  assert.deepEqual(variantProduct(multi, { ...multi.variants[0], images: undefined }).images, multi.images)
})

test('RFQ resolves exact configurations, retains snapshots, rejects unavailable or forged options', () => {
  const result = prepareQuoteItems([multi], [{ productId: 'TEST', variantId: 'black8', quantity: 2, variantLabel: 'forged' }, { productId: 'TEST', variantId: 'white16', quantity: 1 }])
  assert.equal(result[0].variantLabel, 'RAM: 8 GB · Màu sắc: Đen')
  assert.notEqual(quoteLineKey(result[0]), quoteLineKey(result[1]))
  assert.equal(quoteItemLabel([], result[0]), result[0].variantLabel)
  for (const variantId of [undefined, 'hidden', 'missing']) assert.throws(() => prepareQuoteItems([multi], [{ productId: 'TEST', variantId, quantity: 1 }]))
  assert.throws(() => prepareQuoteItems([{ id: 'SIMPLE', status: 'active' }], [{ productId: 'SIMPLE', variantId: 'forged', quantity: 1 }]))
  const grouped = groupEmbeddedProducts(embeddedConfigurations)
  const legacy = prepareQuoteItems(grouped, [{ productId: 'SBC-102', quantity: 3 }])[0]
  assert.equal(legacy.productId, 'SBC-101')
  assert.equal(legacy.variantId, 'SBC-102')
  assert.equal(legacy.variantLabel, 'RAM: 8 GB')
  assert.equal(prepareQuoteItems(grouped, [{ productId: 'SBC-101', quantity: 1 }])[0].variantLabel, 'RAM: 4 GB')
})

test('migration commits once and rolls back failures instead of marking partial work done', async () => {
  const commands = []
  let applied = false, fail = false
  const client = { release() { commands.push('release') }, async query(sql) {
    commands.push(sql)
    if (sql.startsWith('INSERT')) return { rowCount: applied ? 0 : 1 }
    if (sql.startsWith('SELECT')) return { rows: embeddedConfigurations.map(data => ({ data })) }
    if (sql.startsWith('UPDATE') && fail) throw new Error('write failed')
    if (sql === 'COMMIT') applied = true
    return { rows: [] }
  } }
  const pool = { async connect() { return client } }
  await migrateProductVariants(pool)
  assert.ok(commands.includes('COMMIT'))
  commands.length = 0
  await migrateProductVariants(pool)
  assert.equal(commands.some(s => s.startsWith('UPDATE')), false)
  applied = false; fail = true; commands.length = 0
  await assert.rejects(migrateProductVariants(pool), /write failed/)
  assert.ok(commands.includes('ROLLBACK'))
  assert.equal(commands.includes('COMMIT'), false)
  assert.equal(commands.at(-1), 'release')
})
