import Link from 'next/link'

type BlogCardProps = {
  post: {
    pageId: string
    title: string
    url: string
    cover?: string | null
    published?: string | null
    author?: string | null
    summary?: string | null
  }
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <li className='tag-card'>
      <Link href={post.url} className='tag-card__coverLink'>
        <div className='tag-card__cover'>
          {post.cover ? <img src={post.cover} alt={post.title} /> : null}
          <div className='tag-card__coverTitle'>{post.title}</div>
          {post.author ? <div className='tag-card__author'>By {post.author}</div> : null}
          {post.published ? <div className='tag-card__date'>{post.published}</div> : null}
        </div>
      </Link>

      <div className='tag-card__body'>
        {post.summary ? <div className='tag-card__summary'>{post.summary}</div> : null}
      </div>
    </li>
  )
}
