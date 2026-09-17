import test from 'node:test';
import assert from 'node:assert/strict';
import { refreshStorefrontCopy } from './storefrontCopy.js';

test('copy refresh replaces legacy defaults without changing custom CMS text or settings', () => {
  const settings = {
    slogan: 'Công nghệ tiên tiến. Giá trị bền vững.', phone: '0903463185',
    content: { whyTitle: 'Một đối tác kỹ thuật đáng tin cậy.', heroTitle: 'Tiêu đề do chủ website sửa' },
    categories: [{ id: 'custom', description: 'Nội dung riêng', visible: false }],
  };
  const next = refreshStorefrontCopy(settings);
  assert.equal(next.slogan, 'Thiết bị đo lường và tự động hóa');
  assert.equal(next.content.whyTitle, 'Hỗ trợ chọn và sử dụng thiết bị');
  assert.equal(next.content.heroTitle, settings.content.heroTitle);
  assert.equal(next.phone, settings.phone);
  assert.deepEqual(next.categories, settings.categories);
  assert.deepEqual(refreshStorefrontCopy(next), next);
  assert.equal(settings.content.whyTitle, 'Một đối tác kỹ thuật đáng tin cậy.');
});
