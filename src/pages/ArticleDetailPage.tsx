import { ArrowLeft, CalendarDays, UserRound } from 'lucide-react'
import type { Article } from '../types'

function ArticleBody({ content }: { content: string }) {
  const blocks = content.split(/\n{2,}/).map(block => block.trim()).filter(Boolean)
  return <div className="article-content">{blocks.map((block, index) => {
    if (block.startsWith('## ')) return <h2 key={index}>{block.slice(3)}</h2>
    if (block.startsWith('### ')) return <h3 key={index}>{block.slice(4)}</h3>
    if (block.split('\n').every(line => line.startsWith('- '))) return <ul key={index}>{block.split('\n').map(line => <li key={line}>{line.slice(2)}</li>)}</ul>
    return <p key={index}>{block}</p>
  })}</div>
}

export function ArticleDetailPage({ article, navigate }: { article: Article; navigate: (path: string) => void }) {
  return <main className="article-detail"><div className="container article-detail__wrap"><button className="back-link" onClick={() => navigate('/tin-tuc')}><ArrowLeft /> Tất cả bài viết</button><header><span className="eyebrow">{article.category || 'TIN TỨC'}</span><h1>{article.title}</h1><p className="article-lead">{article.excerpt}</p><div className="article-byline"><span><UserRound />{article.author}</span><time dateTime={article.publishedAt}><CalendarDays />{new Date(article.publishedAt).toLocaleDateString('vi-VN')}</time></div></header>{article.coverImage ? <img className="article-cover" src={article.coverImage} alt={article.title} /> : null}<ArticleBody content={article.content} />{article.tags.length ? <div className="article-tags">{article.tags.map(tag => <span key={tag}>{tag}</span>)}</div> : null}</div></main>
}
