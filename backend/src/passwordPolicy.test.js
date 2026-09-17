import test from 'node:test';
import assert from 'node:assert/strict';
import { createAdminUser, updateAdminUser, authenticateAdmin, pool } from './db.js';

test('short passwords can be created, verified and changed; blank update retains password', async (t) => {
  let stored;
  t.mock.method(pool, 'query', async (sql, values) => {
    if (sql.includes('INSERT INTO admin_users')) {
      stored = { username: values[0], password_hash: values[1], display_name: values[2], role: values[3], permissions: JSON.parse(values[4]), active: true, is_root: false };
    } else if (sql.includes('UPDATE admin_users SET')) {
      if (values[5]) stored.password_hash = values[5];
    }
    return { rows: stored ? [stored] : [] };
  });
  await createAdminUser({ username: 'short-pass', password: 'a', displayName: 'Test User' });
  assert.ok(await authenticateAdmin('short-pass', 'a'));
  assert.equal(await authenticateAdmin('short-pass', 'wrong'), null);
  const actor = { username: 'owner', isRoot: true };
  await updateAdminUser('short-pass', { password: 'xy' }, actor);
  assert.ok(await authenticateAdmin('short-pass', 'xy'));
  assert.equal(await authenticateAdmin('short-pass', 'a'), null);
  await updateAdminUser('short-pass', { password: '' }, actor);
  assert.ok(await authenticateAdmin('short-pass', 'xy'));
  await assert.rejects(createAdminUser({ username: 'empty-pass', password: '', displayName: 'Test User' }), /nhập mật khẩu/);
});
