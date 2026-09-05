export const ADMIN_PERMISSIONS = [
  'quotes.view',
  'quotes.manage',
  'products.manage',
  'categories.manage',
  'branding.manage',
  'content.manage',
  'articles.manage',
  'display.manage',
  'analytics.view',
  'users.manage',
  'system.reset',
]

export const ADMIN_ROLES = ['owner', 'administrator', 'catalog_editor', 'content_editor', 'sales', 'viewer', 'custom']

export const ROLE_PRESETS = {
  owner: ADMIN_PERMISSIONS,
  administrator: ADMIN_PERMISSIONS.filter(permission => !['users.manage', 'system.reset'].includes(permission)),
  catalog_editor: ['products.manage', 'categories.manage'],
  content_editor: ['branding.manage', 'content.manage', 'articles.manage', 'display.manage'],
  sales: ['quotes.view', 'quotes.manage'],
  viewer: ['quotes.view', 'analytics.view'],
  custom: [],
}

export function normalizeAdminAccess(role, permissions) {
  const normalizedRole = ADMIN_ROLES.includes(role) ? role : 'viewer'
  const requested = Array.isArray(permissions) ? permissions : []
  const customPermissions = [...new Set(requested.filter(permission => ADMIN_PERMISSIONS.includes(permission)))]
  if (customPermissions.includes('quotes.manage') && !customPermissions.includes('quotes.view')) customPermissions.push('quotes.view')
  return {
    role: normalizedRole,
    permissions: normalizedRole === 'custom'
      ? customPermissions
      : [...ROLE_PRESETS[normalizedRole]],
  }
}

export function hasPermission(user, permission) {
  return Boolean(user?.isRoot || user?.role === 'owner' || user?.permissions?.includes(permission))
}
