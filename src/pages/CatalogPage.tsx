import { ArrowLeft, ArrowUpDown, ChevronLeft, ChevronRight, Laptop, Search, X } from 'lucide-react'
import { useMemo } from 'react'
import { ProductCard } from '../components/ProductCard'
import { useStore } from '../store/StoreContext'
import type { Product } from '../types'

const PAGE_SIZE = 12
const categories = ['Tất cả', 'Văn phòng', 'Mỏng nhẹ', 'Đồ họa', 'Gaming'] as const
type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'best-selling'

const sectionTitles: Record<string, string> = {
  'best-selling': 'Sản phẩm bán chạy',
  newest: 'Sản phẩm mới về',
  gaming: 'Laptop Gaming',
  office: 'Laptop văn phòng',
}

function normalize(value?: string) {
  return (value || '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/đ/g, 'd').trim()
}

function belongsToBrand(productBrand: string, selectedBrand?: string) {
  if (!selectedBrand) return true
  if (selectedBrand === 'Laptop khác') return !['lenovo', 'dell', 'asus', 'acer', 'hp'].includes(normalize(productBrand))
  return normalize(productBrand) === normalize(selectedBrand)
}

function belongsToLine(product: Product, selectedLine?: string) {
  if (!selectedLine) return true
  const line = normalize(selectedLine)
  return normalize(product.line).includes(line) || normalize(product.name).includes(line)
}

export function CatalogPage({ searchParams, navigate }: { searchParams: URLSearchParams; navigate: (path: string) => void }) {
  const { products, orders, settings } = useStore()
  const section = searchParams.get('section') || ''
  const query = searchParams.get('q')?.trim() || ''
  const brand = searchParams.get('brand') || undefined
  const line = searchParams.get('line') || undefined
  const sectionCategory = section === 'gaming' ? 'Gaming' : section === 'office' ? 'Văn phòng' : undefined
  const selectedCategory = searchParams.get('category') || sectionCategory || 'Tất cả'
  const rawSort = searchParams.get('sort') || (section === 'best-selling' ? 'best-selling' : 'newest')
  const sortBy: SortOption = ['newest', 'price-asc', 'price-desc', 'best-selling'].includes(rawSort) ? rawSort as SortOption : 'newest'

  const activeProducts = useMemo(() => products.filter(product => product.status === 'active'), [products])
  const salesByProduct = useMemo(() => {
    const sales = new Map<string, number>()
    orders.filter(order => order.status !== 'cancelled').forEach(order => {
      order.items.forEach(item => sales.set(item.productId, (sales.get(item.productId) ?? 0) + item.quantity))
    })
    return sales
  }, [orders])

  const filteredProducts = useMemo(() => activeProducts.filter(product => {
    const searchable = normalize([product.name, product.brand, product.line, product.cpu, product.ram, product.storage, product.display, product.gpu].filter(Boolean).join(' '))
    return (selectedCategory === 'Tất cả' || product.category === selectedCategory)
      && belongsToBrand(product.brand, brand)
      && belongsToLine(product, line)
      && searchable.includes(normalize(query))
  }).map((product, index) => ({ product, index })).sort((a, b) => {
    if (sortBy === 'price-asc') return a.product.price - b.product.price || a.index - b.index
    if (sortBy === 'price-desc') return b.product.price - a.product.price || a.index - b.index
    if (sortBy === 'best-selling') {
      const score = (item: typeof a) => (salesByProduct.get(item.product.id) ?? 0) * 1000
        + (normalize(item.product.badge).includes('ban chay') ? 100 : 0)
        + (item.product.originalPrice && item.product.originalPrice > item.product.price ? (item.product.originalPrice - item.product.price) / item.product.originalPrice : 0)
      return score(b) - score(a) || a.index - b.index
    }
    return a.index - b.index
  }).map(item => item.product), [activeProducts, brand, line, query, salesByProduct, selectedCategory, sortBy])

  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE))
  const requestedPage = Math.max(1, Number(searchParams.get('page')) || 1)
  const currentPage = Math.min(requestedPage, pageCount)
  const pageProducts = filteredProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  const title = query ? `Kết quả tìm kiếm cho “${query}”` : brand ? `${brand}${line ? ` · ${line}` : ''}` : sectionTitles[section] || (selectedCategory !== 'Tất cả' ? selectedCategory : 'Tất cả laptop')

  const updateQuery = (key: string, value?: string) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    if (key !== 'page') next.delete('page')
    navigate(`/laptop${next.toString() ? `?${next}` : ''}`)
  }

  const updateCategory = (category: string) => {
    const next = new URLSearchParams(searchParams)
    next.delete('section')
    next.delete('page')
    if (category === 'Tất cả') next.delete('category')
    else next.set('category', category)
    navigate(`/laptop${next.toString() ? `?${next}` : ''}`)
  }

  return <main className="catalog-page">
    <section className="catalog-hero"><div className="container">
      <button className="catalog-back" onClick={() => navigate('/')}><ArrowLeft />Trang chủ</button>
      <p className="eyebrow">DANH MỤC LAPTOP</p>
      <h1>{title}</h1>
      <p>{query ? `Tìm thấy ${filteredProducts.length} sản phẩm phù hợp.` : `${filteredProducts.length} sản phẩm đang có tại ${settings.storeName}.`}</p>
      {(brand || line || query || section) && <button className="catalog-clear" onClick={() => navigate('/laptop')}><X />Xóa bộ lọc</button>}
    </div></section>

    <section className="catalog-results"><div className="container">
      <div className="catalog-toolbar">
        <div className="category-tabs" role="tablist">{categories.map(category => <button key={category} className={selectedCategory === category ? 'active' : ''} onClick={() => updateCategory(category)}>{category}</button>)}</div>
        <label className="product-sort"><ArrowUpDown /><span>Sắp xếp</span><select value={sortBy} onChange={event => updateQuery('sort', event.target.value)} aria-label="Sắp xếp sản phẩm"><option value="newest">Mới nhất</option><option value="price-asc">Giá thấp đến cao</option><option value="price-desc">Giá cao đến thấp</option><option value="best-selling">Bán chạy nhất</option></select></label>
      </div>

      {pageProducts.length ? <div className="product-grid">{pageProducts.map(product => <ProductCard product={product} navigate={navigate} key={product.id} />)}</div> : <div className="no-results"><Search /><h3>Chưa tìm thấy sản phẩm phù hợp</h3><p>Thử từ khóa hoặc bộ lọc khác, hoặc gọi {settings.phone} để được tư vấn.</p></div>}

      {filteredProducts.length > PAGE_SIZE && <nav className="pagination" aria-label="Phân trang sản phẩm">
        <button disabled={currentPage === 1} onClick={() => updateQuery('page', String(currentPage - 1))} aria-label="Trang trước"><ChevronLeft /></button>
        <div>{Array.from({ length: pageCount }, (_, index) => index + 1).map(page => <button key={page} className={page === currentPage ? 'active' : ''} onClick={() => updateQuery('page', String(page))} aria-label={`Trang ${page}`} aria-current={page === currentPage ? 'page' : undefined}>{page}</button>)}</div>
        <button disabled={currentPage === pageCount} onClick={() => updateQuery('page', String(currentPage + 1))} aria-label="Trang sau"><ChevronRight /></button>
      </nav>}
    </div></section>
  </main>
}
