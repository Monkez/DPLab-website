import test from 'node:test';
import assert from 'node:assert/strict';
import { validateQuoteRequest } from './quoteValidation.js';
const customer = { name: 'Nguyễn An', phone: '0906 094 313', note: 'Cần đo nhiệt độ tủ điện' };
test('accepts consultation without product, company or email', () => {
  const result = validateQuoteRequest({ customer, items: [] });
  assert.equal(result.error, undefined);
  assert.equal(result.customer.email, '');
});
test('accepts product RFQ without a note', () => {
  assert.equal(validateQuoteRequest({ customer: { ...customer, note: '' }, items: [{ productId: 'TST-101', quantity: 1 }] }).error, undefined);
});
test('rejects empty consultation, malformed contact, and invalid quantities', () => {
  for (const payload of [
    { customer: { ...customer, note: '' }, items: [] },
    { customer: { ...customer, name: 123 }, items: [] },
    { customer: { ...customer, phone: 'abcdefghi' }, items: [] },
    { customer: { ...customer, email: 'broken' }, items: [] },
    { customer, items: [null] },
    { customer, items: [{ productId: 'X', quantity: 0 }] },
    { customer, items: [{ productId: 'X', quantity: 1000 }] },
  ]) assert.ok(validateQuoteRequest(payload).error);
});
