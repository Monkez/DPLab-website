import pg from 'pg'
import crypto from 'crypto'
import { seedProducts, seedQuotes, seedSettings } from './seed.js'
import { ADMIN_PERMISSIONS, normalizeAdminAccess } from './permissions.js'

const { Pool } = pg

const databaseUrl = process.env.DATABASE_URL || ''
const configuredSsl = process.env.DATABASE_SSL?.trim().toLowerCase()
const useDatabaseSsl = configuredSsl
  ? ['1', 'true', 'require', 'required'].includes(configuredSsl)
  : Boolean(databaseUrl) && !['localhost', '127.0.0.1', '.railway.internal'].some(host => databaseUrl.includes(host))

export const pool = new Pool({
  connectionString: databaseUrl,
  ssl: useDatabaseSsl ? { rejectUnauthorized: false } : false,
})

export async function query(text, params) {
  return pool.query(text, params)
}

export async function initDatabase() {
  const catalogVersion = 'dtpt-industrial-v5-88-products'
  await query(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      data JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `)
  await query(`
    CREATE TABLE IF NOT EXISTS quotes (
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
      role TEXT NOT NULL DEFAULT 'viewer',
      permissions JSONB NOT NULL DEFAULT '[]'::jsonb,
      active BOOLEAN NOT NULL DEFAULT TRUE,
      is_root BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `)
  await query(`
    ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'viewer';
    ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS permissions JSONB NOT NULL DEFAULT '[]'::jsonb;
    ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS active BOOLEAN NOT NULL DEFAULT TRUE;
    ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS is_root BOOLEAN NOT NULL DEFAULT FALSE;
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

  await query(`DELETE FROM products WHERE data->>'slug' IS NULL`)

  const importedCatalogVersion = await query('SELECT data FROM settings WHERE id = $1', ['catalog_version'])
  if (importedCatalogVersion.rows[0]?.data?.version !== catalogVersion) {
    await query('DELETE FROM products')
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

  const quoteCount = await query('SELECT COUNT(*)::int AS count FROM quotes')
  if (quoteCount.rows[0].count === 0) {
    for (const quote of seedQuotes) await saveQuote(quote)
  }

  const settingsCount = await query("SELECT COUNT(*)::int AS count FROM settings WHERE id = 'main'")
  if (settingsCount.rows[0].count === 0) {
    await saveSettings(seedSettings)
  }

  const currentSettings = await getSettings()
  if (currentSettings.storeName !== 'DTPT Techs') await saveSettings(seedSettings)

  const rootUsername = String(process.env.ADMIN_DEFAULT_USERNAME || '').trim().toLowerCase()
  const rootPassword = process.env.ADMIN_DEFAULT_PASSWORD
  const adminCount = await query('SELECT COUNT(*)::int AS count FROM admin_users')
  if (adminCount.rows[0].count === 0) {
    if (!rootUsername || !rootPassword) {
      throw new Error('ADMIN_DEFAULT_USERNAME and ADMIN_DEFAULT_PASSWORD are required for the first deployment')
    }
    await createAdminUser({
      username: rootUsername,
      password: rootPassword,
      displayName: process.env.ADMIN_DEFAULT_DISPLAY_NAME || 'DTPT Admin',
      role: 'owner',
    }, { isRoot: true })
  }

  if (rootUsername) {
    const promoted = await query(
      `UPDATE admin_users
       SET role = 'owner', permissions = $2, active = TRUE, is_root = TRUE
       WHERE username = $1`,
      [rootUsername, JSON.stringify(ADMIN_PERMISSIONS)],
    )
    if (promoted.rowCount === 0 && rootPassword) {
      await createAdminUser({
        username: rootUsername,
        password: rootPassword,
        displayName: process.env.ADMIN_DEFAULT_DISPLAY_NAME || 'DTPT Admin',
        role: 'owner',
      }, { isRoot: true })
    }
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
  role: row.role || 'viewer',
  permissions: Array.isArray(row.permissions) ? row.permissions : [],
  active: row.active !== false,
  isRoot: Boolean(row.is_root),
  createdAt: row.created_at,
})

export async function authenticateAdmin(username, password) {
  const result = await query('SELECT * FROM admin_users WHERE username = $1', [String(username || '').trim().toLowerCase()])
  const user = result.rows[0]
  if (!user || user.active === false || !verifyPassword(password, user.password_hash)) return null
  return publicAdminUser(user)
}

export async function getAdminUser(username) {
  const result = await query('SELECT * FROM admin_users WHERE username = $1', [String(username || '').trim().toLowerCase()])
  return result.rows[0] ? publicAdminUser(result.rows[0]) : null
}

export async function listAdminUsers() {
  const result = await query('SELECT username, display_name, role, permissions, active, is_root, created_at FROM admin_users ORDER BY is_root DESC, created_at ASC')
  return result.rows.map(publicAdminUser)
}

export async function createAdminUser({ username, password, displayName, role = 'viewer', permissions = [] }, { isRoot = false } = {}) {
  const cleanUsername = String(username || '').trim().toLowerCase()
  const cleanDisplayName = String(displayName || '').trim()
  if (!/^[a-z0-9._-]{3,40}$/.test(cleanUsername)) throw new Error('Tên đăng nhập cần 3–40 ký tự: chữ thường, số, dấu chấm, gạch ngang hoặc gạch dưới')
  if (String(password || '').length < 10) throw new Error('Mật khẩu phải có ít nhất 10 ký tự')
  if (cleanDisplayName.length < 2 || cleanDisplayName.length > 80) throw new Error('Tên hiển thị cần từ 2 đến 80 ký tự')
  if (await getAdminUser(cleanUsername)) throw new Error('Tên đăng nhập đã tồn tại')
  const access = isRoot ? { role: 'owner', permissions: ADMIN_PERMISSIONS } : normalizeAdminAccess(role, permissions)
  const user = {
    username: cleanUsername,
    passwordHash: hashPassword(String(password)),
    displayName: cleanDisplayName,
  }
  const result = await query(
    `INSERT INTO admin_users (username, password_hash, display_name, role, permissions, active, is_root)
     VALUES ($1, $2, $3, $4, $5, TRUE, $6)
     RETURNING username, display_name, role, permissions, active, is_root, created_at`,
    [user.username, user.passwordHash, user.displayName, access.role, JSON.stringify(access.permissions), isRoot],
  )
  return publicAdminUser(result.rows[0])
}

export async function updateAdminUser(username, { displayName, password, role, permissions, active }, actor) {
  const target = await getAdminUser(username)
  if (!target) return null
  if (target.isRoot && actor.username !== target.username) throw new Error('Không thể chỉnh sửa tài khoản gốc')
  if (target.isRoot && (role !== undefined || active === false)) throw new Error('Không thể hạ quyền hoặc khóa tài khoản gốc')
  if (role === 'owner' && !actor.isRoot) throw new Error('Chỉ tài khoản gốc mới có thể cấp vai trò Chủ sở hữu')

  const cleanDisplayName = displayName === undefined ? target.displayName : String(displayName).trim()
  if (cleanDisplayName.length < 2 || cleanDisplayName.length > 80) throw new Error('Tên hiển thị cần từ 2 đến 80 ký tự')
  if (password !== undefined && password !== '' && String(password).length < 10) throw new Error('Mật khẩu mới phải có ít nhất 10 ký tự')
  const access = target.isRoot ? { role: 'owner', permissions: ADMIN_PERMISSIONS } : normalizeAdminAccess(role ?? target.role, permissions ?? target.permissions)
  const nextActive = target.isRoot ? true : active ?? target.active
  const changesOwnAccess = actor.username === target.username && (
    access.role !== target.role || nextActive !== target.active ||
    JSON.stringify([...access.permissions].sort()) !== JSON.stringify([...target.permissions].sort())
  )
  if (changesOwnAccess) throw new Error('Không thể tự thay đổi vai trò, quyền hoặc trạng thái tài khoản đang đăng nhập')
  if (!actor.isRoot && (access.role === 'owner' || access.permissions.some(permission => ['users.manage', 'system.reset'].includes(permission)))) {
    throw new Error('Chỉ tài khoản gốc mới có thể cấp quyền quản lý tài khoản hoặc reset hệ thống')
  }

  if (target.role === 'owner' && (access.role !== 'owner' || !nextActive)) {
    const owners = await query("SELECT COUNT(*)::int AS count FROM admin_users WHERE role = 'owner' AND active = TRUE")
    if (owners.rows[0].count <= 1) throw new Error('Phải giữ lại ít nhất một Chủ sở hữu đang hoạt động')
  }

  const passwordHash = password ? hashPassword(String(password)) : null
  const result = await query(
    `UPDATE admin_users SET display_name = $2, role = $3, permissions = $4, active = $5,
       password_hash = COALESCE($6, password_hash)
     WHERE username = $1
     RETURNING username, display_name, role, permissions, active, is_root, created_at`,
    [target.username, cleanDisplayName, access.role, JSON.stringify(access.permissions), nextActive, passwordHash],
  )
  return publicAdminUser(result.rows[0])
}

export async function deleteAdminUser(username, actor) {
  const target = await getAdminUser(username)
  if (!target) return false
  if (target.isRoot) throw new Error('Không thể xóa tài khoản gốc')
  if (target.username === actor.username) throw new Error('Không thể tự xóa tài khoản đang đăng nhập')
  if (target.role === 'owner' && target.active) {
    const owners = await query("SELECT COUNT(*)::int AS count FROM admin_users WHERE role = 'owner' AND active = TRUE")
    if (owners.rows[0].count <= 1) throw new Error('Phải giữ lại ít nhất một Chủ sở hữu đang hoạt động')
  }
  await query('DELETE FROM admin_users WHERE username = $1', [target.username])
  return true
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

export async function listQuotes() {
  const result = await query('SELECT data FROM quotes ORDER BY created_at DESC')
  return result.rows.map(row => row.data)
}

export async function saveQuote(quote) {
  await query(
    `INSERT INTO quotes (id, data, created_at, updated_at)
     VALUES ($1, $2, COALESCE($3::timestamptz, NOW()), NOW())
     ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
    [quote.id, quote, quote.createdAt],
  )
  return quote
}

export async function updateQuoteStatus(id, status) {
  const existing = await query('SELECT data FROM quotes WHERE id = $1', [id])
  if (existing.rowCount === 0) return null
  const quote = { ...existing.rows[0].data, status }
  await saveQuote(quote)
  return quote
}

export async function getSettings() {
  const result = await query('SELECT data FROM settings WHERE id = $1', ['main'])
  const stored = result.rows[0]?.data ?? {}
  return {
    ...seedSettings,
    ...stored,
    categories: Array.isArray(stored.categories) && stored.categories.length ? stored.categories : seedSettings.categories,
    visibility: { ...seedSettings.visibility, ...stored.visibility },
    appearance: { ...seedSettings.appearance, ...stored.appearance },
    content: { ...seedSettings.content, ...stored.content },
  }
}

export async function saveSettings(settings) {
  const normalized = {
    ...seedSettings,
    ...settings,
    categories: Array.isArray(settings?.categories) && settings.categories.length ? settings.categories : seedSettings.categories,
    visibility: { ...seedSettings.visibility, ...settings?.visibility },
    appearance: { ...seedSettings.appearance, ...settings?.appearance },
    content: { ...seedSettings.content, ...settings?.content },
  }
  await query(
    `INSERT INTO settings (id, data, updated_at)
     VALUES ($1, $2, NOW())
     ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
    ['main', normalized],
  )
  return normalized
}

export async function resetDemoData() {
  await query('TRUNCATE products, quotes, settings')
  for (const product of seedProducts) await saveProduct(product)
  for (const quote of seedQuotes) await saveQuote(quote)
  await saveSettings(seedSettings)
  return { products: seedProducts, quotes: seedQuotes, settings: seedSettings }
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
