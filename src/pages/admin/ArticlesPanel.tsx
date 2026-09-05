import { Eye, EyeOff, FileText, Pencil, Plus, Search, Trash2, X } from 'lucide-react'
import { useMemo, useState, type FormEvent } from 'react'
import { useStore } from '../../store/StoreContext'
import type { Article } from '../../types'
import { Field } from './AdminField'

const slugify = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const now = () => new Date().toISOString()
const emptyArticle = (): Article => ({ id: `NEWS-${Date.now()}`, slug: '', title: '', excerpt: '', content: '', coverImage: '', category: 'Kiến thức kỹ thuật', tags: [], author: 'DTPT Techs', status: 'draft', featured: false, publishedAt: now(), updatedAt: now(), seoTitle: '', seoDescription: '' })

export function ArticlesPanel() {
  const { articles, saveArticle, deleteArticle } = useStore(); const [query, setQuery] = useState(''); const [editing, setEditing] = useState<Article | null>(null); const [isNew, setIsNew] = useState(false); const [busy, setBusy] = useState(false)
  const visible = useMemo(() => { const q = query.trim().toLowerCase(); return articles.filter(item => !q || `${item.title} ${item.category} ${item.tags.join(' ')}`.toLowerCase().includes(q)) }, [articles, query])
  const remove = async (article: Article) => { if (!confirm(`Xóa vĩnh viễn “${article.title}”?`)) return; setBusy(true); try { await deleteArticle(article.id) } finally { setBusy(false) } }
  return <><div className="admin-toolbar"><label className="admin-search"><Search /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Tìm tiêu đề, chuyên mục, tag..." /></label><span>{visible.length}/{articles.length} bài viết</span><button className="primary-button" onClick={() => { setEditing(emptyArticle()); setIsNew(true) }}><Plus />Viết bài</button></div><div className="article-admin-list">{visible.map(article => <article key={article.id}><div className="product-admin-thumb">{article.coverImage ? <img src={article.coverImage} alt="" /> : <FileText />}</div><div><strong>{article.title}</strong><span>{article.category} · {article.author}</span><small>{new Date(article.publishedAt).toLocaleDateString('vi-VN')} · /tin-tuc/{article.slug}</small></div><div><span className={`status-pill ${article.status === 'draft' ? 'status-pill--draft' : ''}`}>{article.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}</span></div><div className="admin-row-actions"><button title="Sửa" onClick={() => { setEditing(article); setIsNew(false) }}><Pencil /></button><button title={article.status === 'published' ? 'Chuyển về nháp' : 'Xuất bản'} onClick={() => saveArticle({ ...article, status: article.status === 'published' ? 'draft' : 'published', updatedAt: now() })}>{article.status === 'published' ? <EyeOff /> : <Eye />}</button><button className="danger" title="Xóa" disabled={busy} onClick={() => remove(article)}><Trash2 /></button></div></article>)}</div>{editing ? <ArticleEditor article={editing} isNew={isNew} busy={busy} onClose={() => setEditing(null)} onSave={async article => { if (articles.some(item => item.id !== article.id && item.slug === article.slug)) return alert('Slug URL đã được dùng.'); setBusy(true); try { await saveArticle(article, isNew); setEditing(null) } finally { setBusy(false) } }} /> : null}</>
}

function ArticleEditor({ article, isNew, busy, onClose, onSave }: { article: Article; isNew: boolean; busy: boolean; onClose: () => void; onSave: (article: Article) => Promise<void> }) {
  const [draft, setDraft] = useState(article)
  const change = <K extends keyof Article>(key: K, value: Article[K]) => setDraft(item => ({ ...item, [key]: value }))
  const submit = (event: FormEvent) => { event.preventDefault(); void onSave({ ...draft, slug: slugify(draft.slug || draft.title), updatedAt: now(), publishedAt: draft.publishedAt || now() }) }
  return <div className="admin-editor-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}><form className="admin-editor" onSubmit={submit}>
    <div className="admin-editor__head"><div><span className="eyebrow">{isNew ? 'BÀI VIẾT MỚI' : 'CHỈNH SỬA BÀI VIẾT'}</span><h2>{draft.title || 'Chưa đặt tiêu đề'}</h2></div><button type="button" onClick={onClose} aria-label="Đóng"><X /></button></div>
    <div className="admin-editor__body">
      <Field label="Tiêu đề" wide><input required value={draft.title} onChange={event => change('title', event.target.value)} /></Field>
      <Field label="Slug URL"><input value={draft.slug} placeholder="Tự tạo từ tiêu đề" onChange={event => change('slug', event.target.value)} /></Field>
      <Field label="Chuyên mục"><input value={draft.category} onChange={event => change('category', event.target.value)} /></Field>
      <Field label="Mô tả ngắn" wide><textarea required rows={3} maxLength={320} value={draft.excerpt} onChange={event => change('excerpt', event.target.value)} /></Field>
      <Field label="Nội dung (Markdown đơn giản)" wide><textarea required rows={18} value={draft.content} placeholder={'## Tiêu đề phần\n\nNội dung...\n\n- Danh sách'} onChange={event => change('content', event.target.value)} /></Field>
      <Field label="Ảnh cover"><input value={draft.coverImage} placeholder="/products/anh.jpg hoặc URL HTTPS" onChange={event => change('coverImage', event.target.value)} /></Field>
      <Field label="Tác giả"><input required value={draft.author} onChange={event => change('author', event.target.value)} /></Field>
      <Field label="Tag (cách nhau bằng dấu phẩy)"><input value={draft.tags.join(', ')} onChange={event => change('tags', event.target.value.split(',').map(value => value.trim()).filter(Boolean))} /></Field>
      <Field label="Ngày xuất bản"><input type="datetime-local" required value={draft.publishedAt.slice(0, 16)} onChange={event => { if (event.target.value) change('publishedAt', new Date(event.target.value).toISOString()) }} /></Field>
      <Field label="Trạng thái"><select value={draft.status} onChange={event => change('status', event.target.value as Article['status'])}><option value="draft">Bản nháp</option><option value="published">Xuất bản</option></select></Field>
      <Field label="SEO title" wide><input maxLength={70} value={draft.seoTitle || ''} placeholder="Mặc định dùng tiêu đề bài viết" onChange={event => change('seoTitle', event.target.value)} /></Field>
      <Field label="SEO description" wide><textarea rows={3} maxLength={170} value={draft.seoDescription || ''} placeholder="Mặc định dùng mô tả ngắn" onChange={event => change('seoDescription', event.target.value)} /></Field>
      <label className="admin-check full"><input type="checkbox" checked={draft.featured} onChange={event => change('featured', event.target.checked)} />Bài viết nổi bật</label>
    </div>
    <div className="admin-editor__footer"><button type="button" className="secondary-button" onClick={onClose}>Hủy</button><button className="primary-button" disabled={busy}>{busy ? 'Đang lưu...' : 'Lưu bài viết'}</button></div>
  </form></div>
}
