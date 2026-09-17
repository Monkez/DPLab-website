import { ImagePlus, Trash2 } from 'lucide-react'
import { useState, type ChangeEvent } from 'react'
import { api } from '../../services/api'

export function ProductImages({ images, disabled, onChange, onUploading }: { images: string[]; disabled: boolean; onChange: (images: string[]) => void; onUploading: (uploading: boolean) => void }) {
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const upload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    event.target.value = ''
    if (!files.length || uploading) return
    setMessage('')
    if (files.some(file => !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || !file.size || file.size > 5 * 1024 * 1024)) {
      setMessage('Chọn ảnh JPG, PNG hoặc WebP, tối đa 5 MB mỗi ảnh.'); return
    }
    setUploading(true); onUploading(true)
    const next = [...images]
    try {
      for (const file of files) {
        next.push(await api.uploadProductImage(file))
        onChange([...next])
      }
      setMessage(`Đã tải ${files.length} ảnh. Bấm “Lưu sản phẩm” để lưu thay đổi.`)
    } catch (error) {
      setMessage(`${error instanceof Error ? error.message : 'Không tải được ảnh.'} Những ảnh tải thành công vẫn được giữ lại. Vui lòng chọn lại ảnh chưa tải được.`)
    } finally { setUploading(false); onUploading(false) }
  }
  return <section className="product-image-editor admin-field--wide" aria-labelledby="product-images-title">
    <h3 id="product-images-title">Ảnh sản phẩm</h3>
    <label className="product-image-upload"><ImagePlus size={24} /><strong>{uploading ? 'Đang tải ảnh…' : 'Chọn ảnh từ máy tính'}</strong><span>JPG, PNG, WebP · Tối đa 5 MB/ảnh · Có thể chọn nhiều ảnh</span><input type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={disabled || uploading || !api.enabled} onChange={upload} aria-label="Chọn ảnh sản phẩm từ máy tính" /></label>
    {!api.enabled && <p className="form-error">Bản xem trước chưa kết nối máy chủ lưu ảnh. Tính năng tải ảnh cần website có kết nối API.</p>}
    <p className="catalog-note">Ảnh đầu tiên là ảnh đại diện trên danh mục. Có thể đổi ảnh đại diện hoặc bỏ ảnh trước khi lưu.</p>
    {message && <p role="status" className="product-image-message">{message}</p>}
    <div className="product-image-previews">{images.map((src, index) => <article key={`${src}-${index}`}><img src={src} alt={`Ảnh sản phẩm ${index + 1}`} /><div><span>{index === 0 ? 'Ảnh đại diện' : `Ảnh ${index + 1}`}</span><button type="button" disabled={disabled || uploading} aria-label={`Bỏ ảnh ${index + 1}`} onClick={() => onChange(images.filter((_, position) => position !== index))}><Trash2 size={16} /></button></div>{index > 0 && <button type="button" disabled={disabled || uploading} onClick={() => onChange([src, ...images.filter((_, position) => position !== index)])}>Đặt làm ảnh đại diện</button>}</article>)}</div>
  </section>
}
