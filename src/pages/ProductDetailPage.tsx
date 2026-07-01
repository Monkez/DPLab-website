import { ArrowLeft, Check, Phone, PlayCircle, ShoppingBag } from 'lucide-react'
import { ProductArt } from '../components/ProductArt'
import { useStore } from '../store/StoreContext'
import type { Product } from '../types'

const money = (value: number) => `${new Intl.NumberFormat('vi-VN').format(value)}₫`

function paragraphs(value?: string) {
  return (value || '').split(/\n+/).map(item => item.trim()).filter(Boolean)
}

function videoEmbed(url?: string) {
  if (!url) return ''
  if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/')
  if (url.includes('youtu.be/')) return `https://www.youtube.com/embed/${url.split('youtu.be/')[1]?.split('?')[0]}`
  return url
}

export function ProductDetailPage({ product, navigate }: { product: Product; navigate: (path: string) => void }) {
  const { addToCart, settings } = useStore()
  const images = product.detailImages?.filter(Boolean) ?? []
  const article = paragraphs(product.detailArticle)
  const summary = product.salesSummary || `${product.name} là lựa chọn đáng cân nhắc cho nhu cầu ${product.category.toLowerCase()}, cấu hình ${product.cpu}, ${product.ram}, ${product.storage}.`
  const video = videoEmbed(product.videoUrl)
  const specs = [
    ['CPU', product.cpu],
    ['RAM', product.ram],
    ['Ổ cứng', product.storage],
    ['Màn hình', product.display],
    ['GPU', product.gpu],
    ['Tình trạng', product.condition || 'Like new'],
    ['Thương hiệu', product.brand],
    ['Dòng máy', product.line || 'Đang cập nhật'],
  ]

  return <main className="product-detail">
    <div className="container">
      <button className="detail-back" onClick={() => navigate('/')}><ArrowLeft size={17} />Quay lại cửa hàng</button>
      <section className="detail-hero">
        <div className="detail-gallery">
          <div className="detail-art"><ProductArt product={product} large /></div>
          {images.length > 0 && <div className="detail-thumbs">{images.map((src, index) => <img key={`${src}-${index}`} src={src} alt={`${product.name} ảnh ${index + 1}`} />)}</div>}
        </div>
        <div className="detail-summary">
          <p className="eyebrow">{[product.brand, product.line, product.category].filter(Boolean).join(' · ')}</p>
          <h1>{product.name}</h1>
          <p>{summary}</p>
          <div className="detail-price"><strong>{money(product.price)}</strong>{product.originalPrice && <del>{money(product.originalPrice)}</del>}</div>
          <div className="detail-badges">{product.condition && <span>{product.condition}</span>}{product.badge && <span>{product.badge}</span>}<span>{product.stock > 0 ? `Còn ${product.stock} máy` : 'Hết hàng'}</span></div>
          <div className="detail-actions"><button className="button button--primary button--large" onClick={() => addToCart(product.id)}><ShoppingBag size={18} />Thêm vào giỏ hàng</button><a className="button button--light button--large" href={`tel:${settings.phone.replace(/\s/g, '')}`}><Phone size={18} />Tư vấn ngay</a></div>
        </div>
      </section>

      <section className="detail-grid">
        <article className="detail-panel">
          <h2>Cấu hình chi tiết</h2>
          <div className="detail-specs">{specs.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
        </article>
        <article className="detail-panel detail-article">
          <h2>{product.detailTitle || `Giới thiệu ${product.name}`}</h2>
          {(article.length ? article : [
            `${product.name} được DP Lab chọn theo tiêu chí cấu hình rõ ràng, giá minh bạch và phù hợp với nhu cầu sử dụng thực tế.`,
            `Máy phù hợp cho nhóm nhu cầu ${product.category.toLowerCase()}, đặc biệt khi bạn cần một lựa chọn cân bằng giữa hiệu năng, độ bền và ngân sách.`,
          ]).map(item => <p key={item}><Check size={16} />{item}</p>)}
        </article>
      </section>

      {video && <section className="detail-panel detail-video"><h2>Video giới thiệu</h2><div><iframe src={video} title={`Video ${product.name}`} allowFullScreen /></div><p><PlayCircle size={16} />Bạn có thể nhập link YouTube hoặc video trong trang quản trị sản phẩm.</p></section>}
    </div>
  </main>
}
