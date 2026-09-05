import { ArrowRight, CalendarDays } from 'lucide-react'
import type { Article } from '../types'

export function ArticleCard({ article, navigate }: { article: Article; navigate: (path: string) => void }) {
  return <article className="article-card">
    <button className="article-card__image" onClick={() => navigate(`/tin-tuc/${article.slug}`)} aria-label={`Đọc ${article.title}`}>
      {article.coverImage ? <img src={article.coverImage} alt={article.title} loading="lazy" /> : <span>DTPT TECHS</span>}
    </button>
    <div className="article-card__body"><div className="article-meta"><span>{article.category}</span><time dateTime={article.publishedAt}><CalendarDays />{new Date(article.publishedAt).toLocaleDateString('vi-VN')}</time></div><h3><button onClick={() => navigate(`/tin-tuc/${article.slug}`)}>{article.title}</button></h3><p>{article.excerpt}</p><button className="article-link" onClick={() => navigate(`/tin-tuc/${article.slug}`)}>Đọc bài viết <ArrowRight /></button></div>
  </article>
}
