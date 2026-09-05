import assert from 'node:assert/strict'
import test from 'node:test'
import { ADMIN_PERMISSIONS, hasPermission, normalizeAdminAccess } from './permissions.js'

test('owner receives every permission', () => {
  assert.deepEqual(normalizeAdminAccess('owner', []).permissions, ADMIN_PERMISSIONS)
})

test('administrator cannot manage accounts or reset the system', () => {
  const access = normalizeAdminAccess('administrator', ADMIN_PERMISSIONS)
  assert.equal(access.permissions.includes('users.manage'), false)
  assert.equal(access.permissions.includes('system.reset'), false)
  assert.equal(access.permissions.includes('products.manage'), true)
  assert.equal(access.permissions.includes('articles.manage'), true)
})

test('content editor can manage news articles', () => {
  const access = normalizeAdminAccess('content_editor', [])
  assert.equal(access.permissions.includes('articles.manage'), true)
})

test('custom permissions discard unknown and duplicate values', () => {
  const access = normalizeAdminAccess('custom', ['quotes.view', 'quotes.view', 'unknown'])
  assert.deepEqual(access.permissions, ['quotes.view'])
})

test('managing quotes always includes permission to view them', () => {
  const access = normalizeAdminAccess('custom', ['quotes.manage'])
  assert.deepEqual(access.permissions, ['quotes.manage', 'quotes.view'])
})

test('root and owner always pass permission checks', () => {
  assert.equal(hasPermission({ isRoot: true, role: 'viewer', permissions: [] }, 'users.manage'), true)
  assert.equal(hasPermission({ isRoot: false, role: 'owner', permissions: [] }, 'system.reset'), true)
  assert.equal(hasPermission({ isRoot: false, role: 'viewer', permissions: [] }, 'products.manage'), false)
})
