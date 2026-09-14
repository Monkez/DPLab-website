import { test } from 'node:test'
import assert from 'node:assert/strict'
import { articleBlocks, imageMarkdown, insertArticleImages, safeImageUrl } from '../src/utils/articleMarkdown.ts'

test('images preserve captions, escaping, offsets and surrounding Markdown', () => {
  const original = '## Heading\n\nBefore. After.\n\n- One\n- Two'
  const image = { src: 'https://example.com/photo(1).png', alt: 'Ảnh [1] \\ thử', caption: 'Bước "2" & <script>text</script>' }
  const content = insertArticleImages(original, original.indexOf(' After'), [imageMarkdown(image), imageMarkdown({ ...image, src: '/api/article-media/uuid', caption: '' })])
  const images = articleBlocks(content).filter(block => block.type === 'image').map(block => block.image)
  assert.equal(images.length, 2)
  assert.deepEqual({ src: images[0].src, alt: images[0].alt, caption: images[0].caption }, image)
  assert.equal(content.slice(images[0].start, images[0].end), imageMarkdown(image))
  const removed = content.slice(0, images[0].start) + content.slice(images[0].end)
  assert.equal(articleBlocks(removed).filter(block => block.type === 'image').length, 1)
  assert(removed.includes('## Heading') && removed.includes('After.') && removed.includes('- Two'))
})
test('standard image lines work without blank separators and preserve CRLF offsets', () => {
  const content = 'Before\r\n![Test](/products/one.jpg "Caption")\r\n![](/products/two.jpg)\r\nAfter'
  const images = articleBlocks(content).filter(block => block.type === 'image')
  assert.equal(images.length, 2)
  assert.equal(images[0].image.caption, 'Caption')
  assert.equal(content.slice(images[1].image.start, images[1].image.end).trim(), '![](/products/two.jpg)')
})
test('unsafe URLs never become image elements; old content remains text', () => {
  for (const url of ['javascript:alert(1)', 'data:image/svg+xml,test', '//evil.test/x', '/\\evil.test/x', 'https://user:pass@example.com/x', 'https://example.com/x\n']) assert.equal(safeImageUrl(url), false, url)
  assert.equal(articleBlocks('## Old\n\nPlain text\n\n- List')[0].type, 'text')
  assert.equal(articleBlocks('![bad](javascript:alert(1))')[0].type, 'text')
  assert.throws(() => imageMarkdown({ src: 'javascript:test', alt: '', caption: '' }))
})
