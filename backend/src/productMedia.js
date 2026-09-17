import { Router, raw } from 'express'
import { randomUUID } from 'node:crypto'
import { MAX_IMAGE_BYTES, normalizeArticleImage } from './articleMedia.js'

export function createProductMediaRouter({ requirePermission, saveImage, getImage }) {
  const router = Router()
  router.post('/', requirePermission('products.manage'), raw({ type: ['image/jpeg', 'image/png', 'image/webp', 'application/octet-stream'], limit: MAX_IMAGE_BYTES }), async (req, res) => {
    let data
    try { data = await normalizeArticleImage(req.body) }
    catch { return res.status(400).json({ message: 'Chọn ảnh tĩnh JPG, PNG hoặc WebP tối đa 5 MB, tối đa 40 megapixel.' }) }
    const id = randomUUID()
    await saveImage(id, data)
    res.status(201).json({ path: `/api/product-media/${id}` })
  })
  router.get('/:id', async (req, res) => {
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(req.params.id)) return res.sendStatus(404)
    const data = await getImage(req.params.id)
    if (!data) return res.sendStatus(404)
    res.set({ 'Content-Type': 'image/webp', 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'public, max-age=31536000, immutable' }).send(data)
  })
  return router
}
