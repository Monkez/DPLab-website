import pg from 'pg'
import { seedOrders, seedProducts, seedSettings } from './seed.js'

const { Pool } = pg

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { rejectUnauthorized: false },
})

export async function query(text, params) {
  return pool.query(text, params)
}

export async function initDatabase() {
  await query(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      data JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `)
  await query(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      data JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `)
  await query(`
    CREATE TABLE IF NOT EXISTS settings (
      id TEXT PRIMARY KEY,
      data JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `)

  const productCount = await query('SELECT COUNT(*)::int AS count FROM products')
  if (productCount.rows[0].count === 0) {
    for (const product of seedProducts) {
      await saveProduct(product)
    }
  }

  const orderCount = await query('SELECT COUNT(*)::int AS count FROM orders')
  if (orderCount.rows[0].count === 0) {
    for (const order of seedOrders) {
      await saveOrder(order)
    }
  }

  const settingsCount = await query('SELECT COUNT(*)::int AS count FROM settings')
  if (settingsCount.rows[0].count === 0) {
    await saveSettings(seedSettings)
  }
}

export async function listProducts() {
  const result = await query('SELECT data FROM products ORDER BY created_at ASC')
  return result.rows.map(row => row.data)
}

export async function saveProduct(product) {
  await query(
    `INSERT INTO products (id, data, updated_at)
     VALUES ($1, $2, NOW())
     ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
    [product.id, product],
  )
  return product
}

export async function deleteProduct(id) {
  await query('DELETE FROM products WHERE id = $1', [id])
}

export async function listOrders() {
  const result = await query('SELECT data FROM orders ORDER BY created_at DESC')
  return result.rows.map(row => row.data)
}

export async function saveOrder(order) {
  await query(
    `INSERT INTO orders (id, data, created_at, updated_at)
     VALUES ($1, $2, COALESCE($3::timestamptz, NOW()), NOW())
     ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
    [order.id, order, order.createdAt],
  )
  return order
}

export async function updateOrderStatus(id, status) {
  const existing = await query('SELECT data FROM orders WHERE id = $1', [id])
  if (existing.rowCount === 0) return null
  const order = { ...existing.rows[0].data, status }
  await saveOrder(order)
  return order
}

export async function getSettings() {
  const result = await query('SELECT data FROM settings WHERE id = $1', ['main'])
  return result.rows[0]?.data ?? seedSettings
}

export async function saveSettings(settings) {
  await query(
    `INSERT INTO settings (id, data, updated_at)
     VALUES ($1, $2, NOW())
     ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
    ['main', settings],
  )
  return settings
}

export async function resetDemoData() {
  await query('TRUNCATE products, orders, settings')
  for (const product of seedProducts) await saveProduct(product)
  for (const order of seedOrders) await saveOrder(order)
  await saveSettings(seedSettings)
  return { products: seedProducts, orders: seedOrders, settings: seedSettings }
}
