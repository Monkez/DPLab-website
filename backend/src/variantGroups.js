import { summarizeProduct } from './productVariants.js'
const groups = [
  {
    "id": "SBC-101",
    "slug": "raspberry-pi-5",
    "name": "Máy tính nhúng Raspberry Pi 5",
    "model": "Raspberry Pi 5",
    "ids": [
      "SBC-109",
      "SBC-101",
      "SBC-102",
      "SBC-103"
    ],
    "values": [
      "2 GB",
      "4 GB",
      "8 GB",
      "16 GB"
    ]
  },
  {
    "id": "SBC-104",
    "slug": "orange-pi-5-plus",
    "name": "Máy tính nhúng Orange Pi 5 Plus",
    "model": "Orange Pi 5 Plus",
    "ids": [
      "SBC-104",
      "SBC-105"
    ],
    "values": [
      "8 GB",
      "16 GB (v1.5.1)"
    ]
  },
  {
    "id": "SBC-106",
    "slug": "radxa-rock-5b",
    "name": "Máy tính nhúng Radxa ROCK 5B",
    "model": "Radxa ROCK 5B",
    "ids": [
      "SBC-106",
      "SBC-107"
    ],
    "values": [
      "8 GB",
      "16 GB"
    ]
  }
]
export function groupEmbeddedProducts(products) {
  const result = products.map(p => ({ ...p }))
  for (const group of groups) {
    const parent = result.find(p => p.id === group.id)
    if (!parent) continue
    if (parent.variants?.length) { Object.assign(parent, summarizeProduct(parent)); continue }
    const children = group.ids.map(id => result.find(p => p.id === id)).filter(Boolean)
    const variants = children.map(p => ({ ...p, options: { RAM: group.values[group.ids.indexOf(p.id)] } }))
    const legacySlugs = children.map(p => ({ slug: p.slug, variantId: p.id }))
    Object.assign(parent, summarizeProduct({ ...parent, name: group.name, model: group.model, slug: group.slug, seoTitle: group.model + ' – cấu hình và báo giá | DTPT Techs', variants, legacySlugs, highlights: parent.highlights.filter(h => !/GB/.test(h)), specifications: parent.specifications.filter(s => s.label !== 'Bộ nhớ'), tags: [...new Set(children.flatMap(p => p.tags || []))] }))
    for (const child of children) if (child.id !== parent.id) { child.status = 'draft'; child.redirectTo = parent.id }
  }
  return result
}
// One transaction makes grouping repeatable on restart and keeps existing CMS data in variants.
export async function migrateProductVariants(pool) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const applied = await client.query("INSERT INTO settings (id, data) VALUES ('product_variants_20260918', '{}'::jsonb) ON CONFLICT (id) DO NOTHING RETURNING id")
    if (applied.rowCount) {
      const rows = await client.query("SELECT data FROM products WHERE id = ANY($1::text[]) FOR UPDATE", [groups.flatMap(g => g.ids)])
      for (const product of groupEmbeddedProducts(rows.rows.map(r => r.data))) await client.query('UPDATE products SET data = $2, updated_at = NOW() WHERE id = $1', [product.id, product])
    }
    await client.query('COMMIT')
  } catch (error) { await client.query('ROLLBACK'); throw error } finally { client.release() }
}
