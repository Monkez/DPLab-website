import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Download, Copy, Shuffle, Monitor, Smartphone, ExternalLink, X, FileText, Image, ChevronRight } from 'lucide-react';

const root = path.dirname(fileURLToPath(import.meta.url));
const kit = JSON.parse(await readFile(path.join(root, 'campaign.json'), 'utf8'));
const manifest = JSON.parse(await readFile(path.join(root, 'image-manifest.json'), 'utf8'));
const count = (text) => [...text].length;
const bounded = (text, limit, label) => assert(typeof text === 'string' && count(text) > 0 && count(text) <= limit, `${label}: ${count(text)}/${limit}`);
const origin = new URL(kit.campaign.website_url).origin;
const checkUrl = (url) => assert(new URL(url).protocol === 'https:' && new URL(url).origin === origin, `Invalid destination: ${url}`);
assert(kit.campaign.budget_daily === 30000 && kit.campaign.currency === 'VND');
assert(kit.campaign.initial_status === 'PAUSED');
assert(kit.status === 'LOCAL_REVIEW_DRAFT');
assert(kit.ad_groups.length === 2);
const limits = kit.text_limits;
for (const group of kit.ad_groups) {
  assert(group.headlines.length === 15 && group.descriptions.length === 4, group.name);
  assert(new Set(group.headlines).size === group.headlines.length, `Duplicate headline: ${group.name}`);
  group.headlines.forEach((text) => bounded(text, limits.headline, group.name));
  group.descriptions.forEach((text) => bounded(text, limits.description, group.name));
  group.display_paths.forEach((text) => bounded(text, limits.display_path, group.name));
  assert(group.preview_headlines.every((index) => Number.isInteger(index) && index >= 0 && index < group.headlines.length));
  assert(group.preview_descriptions.every((index) => Number.isInteger(index) && index >= 0 && index < group.descriptions.length));
  checkUrl(group.final_url);
}
assert(new Set(kit.sitelinks.map((link) => link.url)).size === kit.sitelinks.length);
for (const link of kit.sitelinks) {
  bounded(link.text, limits.sitelink, 'Sitelink');
  bounded(link.description1, limits.sitelink_description, 'Sitelink description');
  bounded(link.description2, limits.sitelink_description, 'Sitelink description');
  checkUrl(link.url);
}
kit.callouts.forEach((text) => bounded(text, limits.callout, 'Callout'));
for (const asset of manifest.assets) {
  const file = path.resolve(root, asset.file);
  assert(file.startsWith(`${root}${path.sep}`), `Asset outside kit: ${asset.file}`);
  const info = await stat(file);
  assert(info.size === asset.bytes && info.size <= 5120 * 1024, `Size mismatch: ${asset.file}`);
  if (asset.kind === 'product-concept' || asset.kind === 'banner') {
    const ratio = asset.width / asset.height;
    assert(Math.abs(ratio - 1) < 0.01 || Math.abs(ratio / 1.91 - 1) < 0.01, `Ratio mismatch: ${asset.file}`);
    assert(asset.width >= 600 && asset.height >= 314, `Image too small: ${asset.file}`);
  }
}
for (const group of kit.ad_groups) assert(manifest.assets.some((asset) => asset.file === group.preview_image));

const csv = (rows) => '\uFEFF' + rows.map((row) => row.map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`).join(',')).join('\r\n') + '\r\n';
const adRows = [['Campaign', 'Ad group', 'Asset', 'Index', 'Text', 'Characters', 'Limit', 'Final URL']];
for (const group of kit.ad_groups) {
  for (const [key, label, limit] of [['headlines', 'Headline', limits.headline], ['descriptions', 'Description', limits.description]]) {
    group[key].forEach((text, index) => adRows.push([kit.campaign.name, group.name, label, index + 1, text, count(text), limit, group.final_url]));
  }
}
await writeFile(path.join(root, 'ad-copy.csv'), csv(adRows));
const extensionRows = [['Asset', 'Text', 'Description 1', 'Description 2', 'Final URL']];
kit.sitelinks.forEach((link) => extensionRows.push(['Sitelink', link.text, link.description1, link.description2, link.url]));
kit.callouts.forEach((text) => extensionRows.push(['Callout', text, '', '', '']));
kit.structured_snippets.values.forEach((text) => extensionRows.push([`Structured snippet: ${kit.structured_snippets.header}`, text, '', '', '']));
extensionRows.push(['Business name', kit.business.name, '', '', kit.business.website]);
extensionRows.push(['Call asset', kit.business.phone_display, '', '', '']);
await writeFile(path.join(root, 'extensions.csv'), csv(extensionRows));
const keywordRows = [['Ad group', 'Keyword', 'Status']];
kit.ad_groups.forEach((group) => group.keyword_seeds.forEach((keyword) => keywordRows.push([group.name, keyword, kit.keyword_status])));
kit.negative_keyword_candidates.forEach((keyword) => keywordRows.push(['Campaign negative candidate', keyword, 'REVIEW_REQUIRED']));
await writeFile(path.join(root, 'keyword-seeds.csv'), csv(keywordRows));
const text = [kit.business.name, `${kit.campaign.type} / ${kit.campaign.location} / ${kit.campaign.budget_daily} VND/ngày`, 'BẢN XEM THỬ - CHƯA ĐĂNG', ''];
kit.ad_groups.forEach((group) => {
  text.push(group.name, group.final_url, 'TIÊU ĐỀ');
  group.headlines.forEach((item, index) => text.push(`${index + 1}. ${item} (${count(item)}/${limits.headline})`));
  text.push('MÔ TẢ');
  group.descriptions.forEach((item, index) => text.push(`${index + 1}. ${item} (${count(item)}/${limits.description})`));
  text.push('TỪ KHÓA GỢI Ý, CHƯA NGHIÊN CỨU', ...group.keyword_seeds, '');
});
text.push('LIÊN KẾT PHỤ');
kit.sitelinks.forEach((link) => text.push(link.text, link.description1, link.description2, link.url, ''));
text.push('CALLOUT', ...kit.callouts, '', 'LIÊN HỆ', kit.business.phone_display, kit.business.email, '', 'GHI CHÚ', ...kit.review_notes);
await writeFile(path.join(root, 'copy.txt'), '\uFEFF' + text.join('\r\n') + '\r\n');

const icons = Object.fromEntries(Object.entries({ download: Download, copy: Copy, shuffle: Shuffle, monitor: Monitor, phone: Smartphone, external: ExternalLink, close: X, file: FileText, image: Image, arrow: ChevronRight }).map(([key, Icon]) => [key, renderToStaticMarkup(React.createElement(Icon, { size: 18, strokeWidth: 1.7, 'aria-hidden': true }))]));
const serializable = (value) => JSON.stringify(value).replaceAll('<', '\\u003c').replaceAll('\u2028', '\\u2028').replaceAll('\u2029', '\\u2029');
const template = await readFile(path.join(root, 'preview.template.html'), 'utf8');
await writeFile(path.join(root, 'preview.html'), template.replace('__KIT_DATA__', serializable({ ...kit, assets: manifest.assets })).replace('__ICON_DATA__', serializable(icons)));
await mkdir(path.join(root, 'verification'), { recursive: true });
console.log(`Validated and exported ${kit.ad_groups.length} groups, ${adRows.length - 1} text assets, ${manifest.assets.length} images, ${kit.sitelinks.length} sitelinks.`);
