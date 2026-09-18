import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
import { seedProducts } from '../backend/src/seed.js';

const source = await readFile(new URL('../src/utils/catalog.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { matchesProduct, entryProducts } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);

test('Vietnamese search supports accents, mixed case, punctuation, model and application', () => {
  const product = seedProducts.find(item => item.model === 'HDR-60-24');
  assert.ok(matchesProduct(product, 'nguon 24v'));
  assert.ok(matchesProduct(product, 'HDR 60 24'));
  assert.ok(matchesProduct(product, 'NGUỒN PLC'));
  assert.equal(matchesProduct(product, 'camera nhiet'), false);
});
test('entry assortment is active, distinct and includes the verified DIN rail supply', () => {
  const selected = entryProducts(seedProducts);
  assert.equal(selected.length, 8);
  assert.equal(new Set(selected.map(item => item.id)).size, 8);
  assert.ok(selected.some(item => item.model === 'HDR-60-24' && item.priceMode === 'contact' && !item.price));
  assert.equal(entryProducts(seedProducts.map(item => ({ ...item, status: 'draft' }))).length, 0);
  assert.equal(new Set(seedProducts.map(item => item.id)).size, seedProducts.length);
  assert.equal(new Set(seedProducts.map(item => item.slug)).size, seedProducts.length);
});

 test('embedded catalogue has exact configurations, local images and traceable market prices', async () => {
  const { embeddedConfigurations: embeddedProducts } = await import('../backend/src/embeddedProducts.js');
  assert.equal(embeddedProducts.length, 9);
  for (const product of embeddedProducts) {
    assert.ok(seedProducts.some(item => item.id === product.id));
    assert.ok(matchesProduct(product, product.brand === 'Radxa' ? 'rockchip' : product.brand));
    await readFile(new URL('../public' + product.images[0], import.meta.url));
    assert.ok(product.manufacturerUrl.startsWith('https://'));
    if (product.brand === 'Radxa') {
      assert.equal(product.priceMode, 'contact');
      assert.equal(product.price, undefined);
    } else {
      assert.ok(product.price > 0);
      assert.equal(product.priceBasis, 'store-price');
      assert.ok(product.priceSourceUrl.startsWith('https://'));
      assert.equal(product.priceUpdatedAt, '2026-09-18');
    }
  }
  assert.ok(matchesProduct(embeddedProducts.find(p => p.brand === 'NVIDIA'), 'jsetson'));
  assert.equal(embeddedProducts.find(p => p.slug === 'raspberry-pi-5-8gb').price, 4957200);
});

test('owner prices are exactly 10 percent below recorded market prices, including Pi 5 2GB', async () => {
  const { embeddedConfigurations: embeddedProducts } = await import('../backend/src/embeddedProducts.js');
  const expected = { 'SBC-101': 3256200, 'SBC-102': 4957200, 'SBC-103': 8748000, 'SBC-104': 5940000, 'SBC-105': 9270000, 'SBC-108': 13705200, 'SBC-109': 2187000 };
  for (const [id, price] of Object.entries(expected)) assert.equal(embeddedProducts.find(p => p.id === id).price, price);
  assert.ok(matchesProduct(embeddedProducts.find(p => p.id === 'SBC-109'), 'raspberry pi 5 2gb'));
});
