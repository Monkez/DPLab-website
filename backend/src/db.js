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
  const catalogVersion = 'trieubom-237-v6-dtpt-shop'
  const brandVersion = 'dtpt-shop-v1'
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
  await query(`
    CREATE TABLE IF NOT EXISTS analytics_events (
      event_id TEXT PRIMARY KEY,
      visitor_id TEXT NOT NULL,
      session_id TEXT NOT NULL,
      event_type TEXT NOT NULL,
      path TEXT NOT NULL,
      product_id TEXT,
      referrer TEXT,
      device TEXT NOT NULL DEFAULT 'desktop',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS analytics_events_created_at_idx ON analytics_events (created_at DESC);
    CREATE INDEX IF NOT EXISTS analytics_events_session_id_idx ON analytics_events (session_id);
  `)

  await query(`DELETE FROM products WHERE id LIKE 'DEV-%'`)

  const importedCatalogVersion = await query('SELECT data FROM settings WHERE id = $1', ['catalog_version'])
  if (importedCatalogVersion.rows[0]?.data?.version !== catalogVersion) {
    for (const product of seedProducts) {
      await saveProduct(product)
    }
    await query(
      `INSERT INTO settings (id, data, updated_at) VALUES ($1, $2, NOW())
       ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
      ['catalog_version', { version: catalogVersion }],
    )
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

  const settingsCount = await query("SELECT COUNT(*)::int AS count FROM settings WHERE id = 'main'")
  if (settingsCount.rows[0].count === 0) {
    await saveSettings(seedSettings)
  }

  const storedBrandVersion = await query('SELECT data FROM settings WHERE id = $1', ['brand_version'])
  if (storedBrandVersion.rows[0]?.data?.version !== brandVersion) {
    const storedSettings = await query('SELECT data FROM settings WHERE id = $1', ['main'])
    await saveSettings(migrateBrandSettings(storedSettings.rows[0]?.data ?? seedSettings))
    await query(
      `INSERT INTO settings (id, data, updated_at) VALUES ($1, $2, NOW())
       ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
      ['brand_version', { version: brandVersion }],
    )
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

function migrateBrandSettings(settings) {
  const content = Object.fromEntries(Object.entries(settings.content ?? {}).map(([key, value]) => [
    key,
    typeof value === 'string' ? value.replaceAll('DP LAB', 'DTPT SHOP').replaceAll('DP Lab', 'DTPT Shop') : value,
  ]))
  return {
    ...settings,
    storeName: 'DTPT Shop',
    email: settings.email === 'hello@dplab.vn' ? 'hello@dtpt.shop' : settings.email,
    facebook: settings.facebook === 'facebook.com/dplab.vn' ? 'facebook.com/dtpt.shop' : settings.facebook,
    content,
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

export async function recordAnalyticsEvent(event) {
  await query(
    `INSERT INTO analytics_events (event_id, visitor_id, session_id, event_type, path, product_id, referrer, device, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, COALESCE($9::timestamptz, NOW()))
     ON CONFLICT (event_id) DO NOTHING`,
    [event.eventId, event.visitorId, event.sessionId, event.eventType, event.path, event.productId || null, event.referrer || null, event.device || 'desktop', event.createdAt],
  )
}

export async function listAnalyticsEvents(days = 30) {
  const safeDays = Math.min(Math.max(Number(days) || 30, 1), 365)
  const result = await query(
    `SELECT event_id, visitor_id, session_id, event_type, path, product_id, referrer, device, created_at
     FROM analytics_events
     WHERE created_at >= NOW() - ($1 * INTERVAL '1 day')
     ORDER BY created_at ASC`,
    [safeDays * 2],
  )
  return result.rows.map(row => ({
    eventId: row.event_id,
    visitorId: row.visitor_id,
    sessionId: row.session_id,
    eventType: row.event_type,
    path: row.path,
    productId: row.product_id,
    referrer: row.referrer,
    device: row.device,
    createdAt: row.created_at,
  }))
}
