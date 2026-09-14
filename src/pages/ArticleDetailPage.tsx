import { ArrowLeft, CalendarDays, UserRound } from 'lucide-react'
import type { Article } from '../types'
import { ArticleBody } from '../components/ArticleBody'
import { formatDate } from '../utils/dateFormat'

export function ArticleDetailPage({ article, navigate }: { article: Article; navigate: (path: string) => void }) {
  return <main className="article-detail"><div className="container article-detail__wrap"><button className="back-link" onClick={() => navigate('/tin-tuc')}><ArrowLeft /> Tất cả bài viết</button><header><span className="eyebrow">{article.category || 'TIN TỨC'}</span><h1>{article.title}</h1><p className="article-lead">{article.excerpt}</p><div className="article-byline"><span><UserRound />{article.author}</span><time dateTime={article.publishedAt}><CalendarDays />{formatDate(article.publishedAt)}</time></div></header>{article.coverImage ? <img className="article-cover" src={article.coverImage} alt={article.title} /> : null}<ArticleBody content={article.content} />{article.tags.length ? <div className="article-tags">{article.tags.map(tag => <span key={tag}>{tag}</span>)}</div> : null}</div></main>
}
