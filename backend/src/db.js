import pg from 'pg'
import crypto from 'crypto'
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
  await query(`
    CREATE TABLE IF NOT EXISTS admin_users (
      username TEXT PRIMARY KEY,
      password_hash TEXT NOT NULL,
      display_name TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `)

  const productCount = await query('SELECT COUNT(*)::int AS count FROM products')
  if (productCount.rows[0].count === 0) {
    for (const product of seedProducts) {
      await saveProduct(product)
    }
  } else {
    for (const product of seedProducts) {
      const exists = await query('SELECT 1 FROM products WHERE id = $1', [product.id])
      if (exists.rowCount === 0) await saveProduct(product)
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

  const adminCount = await query('SELECT COUNT(*)::int AS count FROM admin_users')
  if (adminCount.rows[0].count === 0) {
    await createAdminUser({
      username: process.env.ADMIN_DEFAULT_USERNAME || 'delai',
      password: process.env.ADMIN_DEFAULT_PASSWORD || '1711@pie',
      displayName: process.env.ADMIN_DEFAULT_DISPLAY_NAME || 'Tiến Đệ',
    })
  }
}

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.pbkdf2Sync(password, salt, 120000, 32, 'sha256').toString('hex')
  return `${salt}:${hash}`
}

function verifyPassword(password, storedHash) {
  const [salt, hash] = storedHash.split(':')
  if (!salt || !hash) return false
  const candidate = hashPassword(password, salt).split(':')[1]
  return crypto.timingSafeEqual(Buffer.from(candidate, 'hex'), Buffer.from(hash, 'hex'))
}

const publicAdminUser = row => ({
  username: row.username,
  displayName: row.display_name,
  createdAt: row.created_at,
})

export async function authenticateAdmin(username, password) {
  const result = await query('SELECT * FROM admin_users WHERE username = $1', [username])
  const user = result.rows[0]
  if (!user || !verifyPassword(password, user.password_hash)) return null
  return publicAdminUser(user)
}

export async function listAdminUsers() {
  const result = await query('SELECT username, display_name, created_at FROM admin_users ORDER BY created_at ASC')
  return result.rows.map(publicAdminUser)
}

export async function createAdminUser({ username, password, displayName }) {
  const cleanUsername = String(username || '').trim().toLowerCase()
  const cleanDisplayName = String(displayName || '').trim()
  if (!cleanUsername || !password || !cleanDisplayName) throw new Error('Username, password and display name are required')
  const user = {
    username: cleanUsername,
    passwordHash: hashPassword(String(password)),
    displayName: cleanDisplayName,
  }
  const result = await query(
    `INSERT INTO admin_users (username, password_hash, display_name)
     VALUES ($1, $2, $3)
     ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash, display_name = EXCLUDED.display_name
     RETURNING username, display_name, created_at`,
    [user.username, user.passwordHash, user.displayName],
  )
  return publicAdminUser(result.rows[0])
}

export async function deleteAdminUser(username) {
  const count = await query('SELECT COUNT(*)::int AS count FROM admin_users')
  if (count.rows[0].count <= 1) throw new Error('Cannot delete the last admin account')
  await query('DELETE FROM admin_users WHERE username = $1', [username])
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
