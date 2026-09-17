import { Search, SlidersHorizontal } from 'lucide-react'
import { useMemo } from 'react'
import { ProductCard } from '../components/ProductCard'
import { useStore } from '../store/StoreContext'
import { matchesProduct } from '../utils/catalog'

export function CatalogPage({ params, navigate, onQuote }: { params: URLSearchParams; navigate: (path: string) => void; onQuote: () => void }) {
  const { products, addToQuote, settings } = useStore()
  const category = params.get('category') || '', query = params.get('q') || '', brand = params.get('brand') || '', budget = params.get('budget') || '', sort = params.get('sort') || 'featured'
  const categories = settings.categories.filter(item => item.visible).sort((a, b) => a.sortOrder - b.sortOrder)
  const active = useMemo(() => products.filter(product => product.status === 'active'), [products])
  const brands = [...new Set(active.filter(product => !category || product.category === category).map(product => product.brand))].sort()
  const filtered = useMemo(() => active.filter(product => (!category || product.category === category) && (!brand || product.brand === brand) && matchesProduct(product, query) && (!budget || (product.priceMode !== 'contact' && Boolean(product.price) && (budget === 'low' ? product.price! < 5000000 : budget === 'mid' ? product.price! >= 5000000 && product.price! <= 15000000 : product.price! > 15000000)))).sort((a, b) => {
    if (sort.startsWith('price')) {
      const ap = a.priceMode === 'contact' ? undefined : a.price, bp = b.priceMode === 'contact' ? undefined : b.price
      if (!ap || !bp) return Number(!ap) - Number(!bp)
      return sort === 'price-asc' ? ap - bp : bp - ap
    }
    return Number(b.featured) - Number(a.featured) || (a.sortOrder ?? 9999) - (b.sortOrder ?? 9999)
  }), [active, category, brand, query, budget, sort])
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value); else next.delete(key)
    if (key === 'category') next.delete('brand')
    navigate(`/san-pham${next.size ? `?${next}` : ''}`)
  }
  return <main>
    <section className="page-hero"><div className="container"><span className="eyebrow">CATALOGUE DTPT TECHS</span><h1>{category || 'Sản phẩm'}</h1><p>{category ? categories.find(item => item.name === category)?.description : 'Tìm theo model, ứng dụng hoặc thương hiệu. Chưa rõ cấu hình? Gửi nhu cầu để được tư vấn.'}</p></div></section>
    <section className="section"><div className="container">
      <form className="catalog-search" onSubmit={event => { event.preventDefault(); update('q', String(new FormData(event.currentTarget).get('q') || '').trim()) }}>
        <Search aria-hidden="true" /><input key={query} name="q" defaultValue={query} aria-label="Tìm thiết bị" placeholder="Ví dụ: ADAM-6050, nguồn 24V, máy hiện sóng…" /><button className="primary-button" type="submit">Tìm kiếm</button>
      </form>
      <div className="catalog-layout"><aside className="filters"><h3><SlidersHorizontal /> Ngành hàng</h3><button className={!category ? 'active' : ''} onClick={() => update('category', '')}>Tất cả <span>{active.length}</span></button>{categories.map(item => <button key={item.id} className={category === item.name ? 'active' : ''} onClick={() => update('category', item.name)}>{item.name}<span>{active.filter(product => product.category === item.name).length}</span></button>)}</aside>
      <div className="catalog-main"><div className="catalog-refinements">
        <label>Thương hiệu<select value={brand} onChange={event => update('brand', event.target.value)}><option value="">Tất cả thương hiệu</option>{brands.map(value => <option key={value}>{value}</option>)}</select></label>
        <label>Ngân sách dự kiến<select value={budget} onChange={event => update('budget', event.target.value)}><option value="">Tất cả mức giá</option><option value="low">Dưới 5 triệu</option><option value="mid">5–15 triệu</option><option value="high">Trên 15 triệu</option></select></label>
        <label>Sắp xếp<select value={sort} onChange={event => update('sort', event.target.value)}><option value="featured">Nổi bật</option><option value="price-asc">Giá thấp đến cao</option><option value="price-desc">Giá cao đến thấp</option></select></label>
      </div><div className="catalog-toolbar"><p role="status"><strong>{filtered.length}</strong> sản phẩm{query && <> cho “{query}”</>}</p>{(query || category || brand || budget) && <button className="text-button" onClick={() => navigate('/san-pham')}>Xóa bộ lọc</button>}</div>
      {budget && <p className="catalog-note">Bộ lọc ngân sách chỉ gồm sản phẩm có giá công khai. Thiết bị cần báo giá riêng xuất hiện khi chọn tất cả mức giá.</p>}
      {filtered.length ? <div className="product-grid">{filtered.map(product => <ProductCard key={product.id} product={product} navigate={navigate} add={addToQuote} />)}</div> : <div className="empty-results"><h2>Chưa tìm thấy thiết bị phù hợp</h2><p>Thử bỏ bớt bộ lọc hoặc gửi model và ứng dụng. Bạn vẫn có thể hỏi báo giá thiết bị chưa có trong danh mục.</p><button className="primary-button" onClick={onQuote}>Nhờ tư vấn lựa chọn</button></div>}
      </div></div>
    </div></section>
  </main>
}
