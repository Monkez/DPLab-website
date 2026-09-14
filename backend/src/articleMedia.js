import sharp from 'sharp'

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024
export async function normalizeArticleImage(input) {
  if (!Buffer.isBuffer(input) || !input.length || input.length > MAX_IMAGE_BYTES) throw new Error('Ảnh phải có dung lượng từ 1 byte đến 5 MB.')
  const image = sharp(input, { limitInputPixels: 40_000_000, failOn: 'warning' })
  const metadata = await image.metadata()
  if (!['jpeg', 'png', 'webp'].includes(metadata.format) || (metadata.pages || 1) > 1) throw new Error('Chỉ hỗ trợ ảnh tĩnh JPG, PNG hoặc WebP.')
  return image.rotate().resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true }).webp({ quality: 82 }).toBuffer()
}
