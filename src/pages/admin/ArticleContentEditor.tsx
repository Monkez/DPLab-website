import { useEffect, useRef, useState } from 'react'
import { ArticleBody } from '../../components/ArticleBody'
import { api } from '../../services/api'
import { articleBlocks, imageMarkdown, insertArticleImages, type ArticleImage } from '../../utils/articleMarkdown'

interface Props { value: string; onChange: (value: string) => void; disabled: boolean; onEditingChange: (editing: boolean) => void }
type ImageDraft = { src: string; alt: string; caption: string; original?: ArticleImage }

export function ArticleContentEditor({ value, onChange, disabled, onEditingChange }: Props) {
  const textarea = useRef<HTMLTextAreaElement>(null)
  const caret = useRef(0)
  const imagePanel = useRef<HTMLFieldSetElement>(null)
  const [image, setImage] = useState<ImageDraft | null>(null)
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [preview, setPreview] = useState(false)
  const images = articleBlocks(value).flatMap(part => part.type === 'image' ? [part.image] : [])
  const imageOpen = !!image
  useEffect(() => {
    if (imageOpen) { imagePanel.current?.scrollIntoView({ block: 'nearest' }); imagePanel.current?.querySelector<HTMLInputElement>('input:not(:disabled)')?.focus() }
  }, [imageOpen])
  const open = (original?: ArticleImage) => {
    if (!original) caret.current = textarea.current?.selectionStart ?? value.length
    setImage(original ? { ...original, original } : { src: '', alt: '', caption: '' })
    setFiles([]); setMessage(''); onEditingChange(true)
  }
  const close = () => { setImage(null); setFiles([]); onEditingChange(false); requestAnimationFrame(() => textarea.current?.focus()) }
  const apply = async () => {
    if (!image || uploading) return
    setMessage('')
    if (!files.length && !image.src.trim()) return setMessage('Chọn ảnh từ máy hoặc nhập đường dẫn ảnh.')
    if (files.some(file => file.size > 5 * 1024 * 1024)) return setMessage('Mỗi ảnh phải nhỏ hơn hoặc bằng 5 MB.')
    setUploading(true)
    try {
      const urls: string[] = []
      for (const [index, file] of files.entries()) { setMessage(`Đang tải ảnh ${index + 1}/${files.length}…`); urls.push(await api.uploadArticleImage(file)) }
      if (!urls.length) urls.push(image.src.trim())
      const markdown = urls.map(src => imageMarkdown({ ...image, src }))
      if (image.original) onChange(value.slice(0, image.original.start) + markdown[0] + value.slice(image.original.end))
      else onChange(insertArticleImages(value, caret.current, markdown))
      close()
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Không thể tải ảnh. Vui lòng thử lại.') }
    finally { setUploading(false) }
  }
  return <div className="article-content-editor full">
    <label htmlFor="article-markdown">Nội dung bài viết</label>
    <div className="article-image-actions"><button type="button" className="secondary-button" disabled={disabled || !!image} onClick={() => open()}>+ Chèn ảnh trong bài</button><button type="button" className="secondary-button" onClick={() => setPreview(!preview)}>{preview ? 'Ẩn xem trước' : 'Xem trước nội dung'}</button></div>
    <textarea id="article-markdown" ref={textarea} required rows={16} value={value} disabled={disabled || !!image} onSelect={event => { caret.current = event.currentTarget.selectionStart }} onChange={event => { caret.current = event.target.selectionStart; onChange(event.target.value) }} placeholder={'## Tiêu đề phần\n\nNội dung bài viết…'} />
    <p className="article-editor-hint">Đặt con trỏ vào nội dung rồi chèn ảnh. Có thể chọn nhiều ảnh cùng lúc. Ảnh đại diện được chọn riêng. Nhấn “Lưu bài viết” để lưu mọi thay đổi.</p>
    {image && <fieldset ref={imagePanel} className="article-image-editor" disabled={uploading}>
      <legend>{image.original ? 'Sửa ảnh trong bài' : 'Chèn ảnh trong bài'}</legend>
      <label>Chọn ảnh từ máy<input type="file" accept="image/jpeg,image/png,image/webp" multiple={!image.original} disabled={!api.enabled} onChange={event => setFiles(Array.from(event.target.files || []))} /></label>
      <small>JPG, PNG hoặc WebP, tối đa 5 MB/ảnh. Có thể chọn nhiều ảnh khi chèn mới.</small>
      <label>Hoặc đường dẫn ảnh<input value={image.src} disabled={files.length > 0} placeholder="https://… hoặc /products/anh.jpg" onChange={event => setImage({ ...image, src: event.target.value })} /></label>
      <label>Mô tả ảnh<input maxLength={180} value={image.alt} onChange={event => setImage({ ...image, alt: event.target.value })} /></label>
      <label>Chú thích dưới ảnh<input maxLength={500} value={image.caption} onChange={event => setImage({ ...image, caption: event.target.value })} /></label>
      <small>Khi chọn nhiều ảnh, mô tả và chú thích áp dụng chung; có thể sửa riêng từng ảnh sau đó.</small>
      <p role="status" aria-live="polite">{message}</p>
      <div className="article-image-actions"><button type="button" className="primary-button" onClick={() => void apply()}>{uploading ? 'Đang tải…' : 'Áp dụng ảnh'}</button><button type="button" className="secondary-button" onClick={close}>Hủy chỉnh ảnh</button></div>
    </fieldset>}
    {!!images.length && <section className="article-image-list" aria-label="Ảnh trong bài"><h3>Ảnh trong bài ({images.length})</h3>{images.map((item, index) => <div key={item.start}><img src={api.articleImageUrl(item.src)} alt={item.alt} loading="lazy" referrerPolicy="no-referrer" /><span>Ảnh {index + 1}<small>{item.caption || item.alt || 'Chưa có mô tả'}</small></span><button type="button" disabled={disabled || !!image} onClick={() => open(item)}>Sửa ảnh {index + 1}</button><button type="button" disabled={disabled || !!image} onClick={() => onChange(value.slice(0, item.start) + value.slice(item.end))}>Xóa ảnh {index + 1}</button></div>)}</section>}
    {preview && <section className="article-editor-preview" aria-label="Xem trước nội dung"><h3>Xem trước nội dung</h3><ArticleBody content={value} /></section>}
  </div>
}
