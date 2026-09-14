export interface ArticleImage { src: string; alt: string; caption: string; start: number; end: number }
export type ArticleBlock = { type: 'text'; text: string } | { type: 'image'; image: ArticleImage }

export function safeImageUrl(value: string) {
  if (!value || /[\s<>\\]/.test(value) || Array.from(value).some(char => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127)) return false
  if (value.startsWith('/') && !value.startsWith('//')) return true
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password } catch { return false }
}
const unescapeText = (value: string) => value.replace(/\\([\\[\]"])/g, '$1')
const escapeText = (value: string) => value.replace(/\r?\n/g, ' ').replace(/[\\[\]"]/g, '\\$&')

export function articleBlocks(content: string): ArticleBlock[] {
  const blocks: ArticleBlock[] = []
  let text = '', offset = 0
  const flush = () => { if (text.trim()) blocks.push({ type: 'text', text }); text = '' }
  for (const line of content.split('\n')) {
    const match = line.trim().match(/^!\[((?:\\.|[^\]\\])*)\]\(\s*(?:<([^<>]+)>|(\S+?))(?:\s+"((?:\\.|[^"\\])*)")?\s*\)$/)
    const src = match?.[2] || match?.[3] || ''
    if (match && safeImageUrl(src)) {
      flush()
      blocks.push({ type: 'image', image: { src, alt: unescapeText(match[1]), caption: unescapeText(match[4] || ''), start: offset, end: offset + line.length } })
    } else text += line + '\n'
    offset += line.length + 1
  }
  flush()
  return blocks
}
export function imageMarkdown(image: Pick<ArticleImage, 'src' | 'alt' | 'caption'>) {
  if (!safeImageUrl(image.src)) throw new Error('Dùng URL HTTPS hoặc đường dẫn ảnh bắt đầu bằng /, không chứa khoảng trắng.')
  return `![${escapeText(image.alt)}](<${image.src}>${image.caption ? ` "${escapeText(image.caption)}"` : ''})`
}

export function insertArticleImages(content: string, at: number, images: string[]) {
  const position = Math.max(0, Math.min(at, content.length))
  return content.slice(0, position) + '\n\n' + images.join('\n\n') + '\n\n' + content.slice(position)
}
