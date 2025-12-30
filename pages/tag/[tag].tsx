/* eslint-disable simple-import-sort/imports */
import { type GetStaticPaths, type GetStaticProps } from 'next'
import Link from 'next/link'

import { NotionPage } from '@/components/NotionPage'
import { domain, tagArchiveNotionPageId } from '@/lib/config'
import { getPublishedPosts } from '@/lib/get-published-posts'
import { resolveNotionPage } from '@/lib/resolve-notion-page'
import { type PageProps } from '@/lib/types'
import { isHiddenTag, normalizeTag, slugToTag, tagToSlug } from '@/lib/tags'

const BLOG_INDEX_PAGE_ID = '26449883313980758e9df71e17fd52bc'

interface TagArchiveProps extends PageProps {
  tag: string
  posts: {
    pageId: string
    title: string
    url: string
    tags: string[]
    cover?: string | null
    published?: string | null
    publishedTime?: number | null
    summary?: string | null
    author?: string | null
  }[]
  allTags: string[]
  blogIndexUrl: string
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps<TagArchiveProps> = async (
  context
) => {
  const tagSlug = String(context.params?.tag ?? '')
  const tag = normalizeTag(slugToTag(tagSlug))

  if (!tag || isHiddenTag(tag)) {
    return { notFound: true, revalidate: 60 }
  }

  const posts = await getPublishedPosts()

  const shellPageId = tagArchiveNotionPageId || BLOG_INDEX_PAGE_ID
  const shellProps = await resolveNotionPage(domain, shellPageId)

  if (!shellProps?.recordMap || !shellProps.site) {
    return { notFound: true, revalidate: 60 }
  }

  const filtered = posts.filter((p) =>
    p.tags.some((t) => normalizeTag(t) === tag)
  )
  filtered.sort(
    (a, b) => (b.publishedTime ?? 0) - (a.publishedTime ?? 0)
  )

  if (!filtered.length) {
    return { notFound: true, revalidate: 60 }
  }

  const allTags = Array.from(
    new Set(
      posts
        .flatMap((p) => p.tags.map((t) => normalizeTag(t)))
        .filter(Boolean)
    )
  )
    .filter((t) => !isHiddenTag(t))
    .toSorted((a, b) => a.localeCompare(b))

  const blogIndexUrl = 'https://www.openalmond.com/the-almond-branch-blog'

  return {
    props: {
      ...(shellProps as PageProps),
      tag,
      posts: filtered,
      allTags,
      blogIndexUrl
    },
    revalidate: 60
  }
}

export default function TagArchivePage(props: TagArchiveProps) {
  const { tag, posts, allTags, blogIndexUrl, ...notionPageProps } = props

  return (
    <NotionPage {...(notionPageProps as PageProps)}>
      <div className='tag-injected'>
        <h1 className='tag-archive-title'>Posts tagged "{tag}"</h1>

        {!!allTags.length && (
          <div className='tag-archive-tags'>
            {allTags.map((t) => {
              const slug = tagToSlug(t)
              const isActive = normalizeTag(t) === normalizeTag(tag)
              if (!slug) return null

              return (
                <Link
                  key={t}
                  href={`/tag/${slug}`}
                  className={`notion-link tag-archive-tagLink ${isActive ? 'tag-archive-tagLink--active' : ''}`}
                >
                  {t}
                </Link>
              )
            })}
          </div>
        )}

        <ul className='tag-archive-list'>
          {posts.map((post) => (
            <li key={post.pageId} className='tag-card'>
              <Link href={post.url} className='tag-card__coverLink'>
                <div className='tag-card__cover'>
                  {post.cover ? <img src={post.cover} alt={post.title} /> : null}
                  <div className='tag-card__coverTitle'>{post.title}</div>
                  {post.author ? (
                    <div className='tag-card__author'>By {post.author}</div>
                  ) : null}
                  {post.published ? (
                    <div className='tag-card__date'>{post.published}</div>
                  ) : null}
                </div>
              </Link>

              <div className='tag-card__body'>
                {post.summary ? (
                  <div className='tag-card__summary'>{post.summary}</div>
                ) : null}
              </div>
            </li>
          ))}
        </ul>

        <div className='tag-archive-back'>
          <Link href={blogIndexUrl} className='notion-link'>
            ← All Posts
          </Link>
        </div>
      </div>
    </NotionPage>
  )
}
