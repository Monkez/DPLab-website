import { Plus, Trash2 } from 'lucide-react'
import type { ProductVariant } from '../../types'
import { Field } from './AdminField'

export function ProductVariants({ variants, images, disabled, onChange }: { variants: ProductVariant[]; images: string[]; disabled: boolean; onChange: (variants: ProductVariant[]) => void }) {
  const update = (index: number, patch: Partial<ProductVariant>) => onChange(variants.map((v, i) => i === index ? { ...v, ...patch } : v))
  const add = () => onChange([...variants, { id: crypto.randomUUID(), options: Object.fromEntries(Object.keys(variants[0]?.options || { RAM: '' }).map(key => [key, ''])), model: '', status: 'active', priceMode: 'contact' }])
  return <section className="variant-editor admin-field--wide"><h3>Tùy chọn sản phẩm</h3><p>Mỗi cấu hình là một tổ hợp có thể đặt hàng, ví dụ RAM 8 GB + Màu đen. Dùng cùng tên tùy chọn cho các cấu hình. Giá danh mục tự lấy từ cấu hình thấp nhất đang bán.</p>
    {variants.map((variant, index) => <fieldset disabled={disabled} className="variant-editor__item" key={variant.id}><legend>Cấu hình {index + 1}</legend>
      <div className="variant-editor__options">{Object.entries(variant.options).map(([name, value], optionIndex) => <div key={optionIndex}>
        <label>Tên tùy chọn<input aria-label={`Tên tùy chọn ${optionIndex + 1}, cấu hình ${index + 1}`} value={name} placeholder="RAM, Màu sắc…" maxLength={60} onChange={event => { if (event.target.value !== name && Object.hasOwn(variant.options, event.target.value)) return; const entries = Object.entries(variant.options); entries[optionIndex] = [event.target.value, value]; update(index, { options: Object.fromEntries(entries) }) }} /></label>
        <label>Giá trị<input aria-label={`Giá trị ${optionIndex + 1}, cấu hình ${index + 1}`} value={value} placeholder="8 GB, Đen…" maxLength={100} onChange={event => update(index, { options: { ...variant.options, [name]: event.target.value } })} /></label>
        <button type="button" aria-label={`Bỏ tùy chọn ${optionIndex + 1}, cấu hình ${index + 1}`} onClick={() => update(index, { options: Object.fromEntries(Object.entries(variant.options).filter((_, i) => i !== optionIndex)) })}><Trash2 size={16} /></button>
      </div>)}</div>
      <button type="button" className="text-button" disabled={Object.keys(variant.options).length >= 6} onClick={() => { let n = 1; while (Object.hasOwn(variant.options, 'Tùy chọn ' + n)) n++; update(index, { options: { ...variant.options, ['Tùy chọn ' + n]: '' } }) }}>+ Thêm loại tùy chọn</button>
      <div className="variant-editor__fields">
        <Field label="Mã hàng / model"><input value={variant.model || ''} onChange={event => update(index, { model: event.target.value })} /></Field>
        <Field label="Kiểu giá cấu hình"><select value={variant.priceMode} onChange={event => update(index, { priceMode: event.target.value as 'fixed' | 'contact' })}><option value="fixed">Có giá</option><option value="contact">Liên hệ báo giá</option></select></Field>
        <Field label="Giá cấu hình (VNĐ)"><input type="number" min="1" disabled={variant.priceMode === 'contact'} value={variant.price ?? ''} onChange={event => update(index, { price: event.target.value ? Number(event.target.value) : undefined })} /></Field>
        <Field label="Trạng thái cấu hình"><select value={variant.status} onChange={event => update(index, { status: event.target.value as 'active' | 'draft' })}><option value="active">Đang bán</option><option value="draft">Ẩn / ngừng bán</option></select></Field>
        <Field label="Ảnh cấu hình"><select value={variant.images?.[0] || ''} onChange={event => update(index, { images: event.target.value ? [event.target.value] : undefined })}><option value="">Dùng ảnh chung</option>{[...new Set([...images, ...(variant.images || [])])].map((image, i) => <option key={image} value={image}>Ảnh {i + 1}</option>)}</select></Field>
        <Field label="Thông số riêng (Tên: Giá trị)" wide><textarea rows={3} value={variant.specifications?.map(s => s.label + ': ' + s.value).join('\n') || ''} placeholder="Để trống để dùng thông số chung" onChange={event => update(index, { specifications: event.target.value.trim() ? event.target.value.split('\n').filter(Boolean).map(line => { const split = line.indexOf(':'); return { label: split < 0 ? line : line.slice(0, split).trim(), value: split < 0 ? '' : line.slice(split + 1).trim() } }) : undefined })} /></Field>
      </div>
      <button type="button" className="text-button" onClick={() => onChange(variants.filter((_, i) => i !== index))}><Trash2 size={16} /> Bỏ cấu hình này</button>
    </fieldset>)}
    <button type="button" className="secondary-button" disabled={disabled || variants.length >= 100} onClick={add}><Plus size={18} />Thêm cấu hình</button>
  </section>
}
