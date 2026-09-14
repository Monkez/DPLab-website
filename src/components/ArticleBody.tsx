import { api } from '../services/api'
import { articleBlocks } from '../utils/articleMarkdown'

export function ArticleBody({ content }: { content: string }) {
  return <div className="article-content">{articleBlocks(content).map((part, index) => {
    if (part.type === 'image') return <figure key={index}><img src={api.articleImageUrl(part.image.src)} alt={part.image.alt} loading="lazy" decoding="async" referrerPolicy="no-referrer" />{part.image.caption && <figcaption>{part.image.caption}</figcaption>}</figure>
    return part.text.split(/\n{2,}/).map(block => block.trim()).filter(Boolean).map((block, blockIndex) => {
      const key = `${index}-${blockIndex}`
      if (block.startsWith('## ')) return <h2 key={key}>{block.slice(3)}</h2>
      if (block.startsWith('### ')) return <h3 key={key}>{block.slice(4)}</h3>
      if (block.split('\n').every(line => line.startsWith('- '))) return <ul key={key}>{block.split('\n').map((line, i) => <li key={i}>{line.slice(2)}</li>)}</ul>
      return <p key={key}>{block}</p>
    })
  })}</div>
}
