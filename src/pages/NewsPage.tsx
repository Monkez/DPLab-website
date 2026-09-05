import { ArticleCard } from '../components/ArticleCard'
import { useStore } from '../store/StoreContext'

export function NewsPage({ navigate }: { navigate: (path: string) => void }) {
  const { articles } = useStore()
  const published = articles.filter(article => article.status === 'published').sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  return <main><section className="page-hero"><div className="container"><span className="eyebrow">KIẾN THỨC CÔNG NGHIỆP</span><h1>Tin tức & chuyên môn</h1><p>Kiến thức lựa chọn thiết bị, công nghệ mới và kinh nghiệm triển khai cho nhà máy, phòng nghiên cứu.</p></div></section><section className="section"><div className="container">{published.length ? <div className="article-grid">{published.map(article => <ArticleCard key={article.id} article={article} navigate={navigate} />)}</div> : <div className="empty-results"><h2>Chưa có bài viết</h2><p>Nội dung chuyên môn đang được cập nhật.</p></div>}</div></section></main>
}
