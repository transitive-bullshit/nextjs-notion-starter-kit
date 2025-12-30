import { type GetStaticPaths, type GetStaticProps } from 'next'
import Link from 'next/link'

import { NotionPage } from '@/components/NotionPage'
import { domain } from '@/lib/config'
import { getPublishedPosts } from '@/lib/get-published-posts'
import { getSiteMap } from '@/lib/get-site-map'
import { mapPageUrl } from '@/lib/map-page-url'
import { resolveNotionPage } from '@/lib/resolve-notion-page'
import { type PageProps } from '@/lib/types'
import { isHiddenTag, normalizeTag, slugToTag, tagToSlug } from '@/lib/tags'

const BLOG_INDEX_PAGE_ID = '2d949883313980b891eddda34009e3b5'

interface TagArchiveProps extends PageProps {
  tag: string
  posts: {
    pageId: string
    title: string
    url: string
    tags: string[]
    cover?: string | null
    published?: string | null
    summary?: string | null
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

  const [posts, siteMap] = await Promise.all([
    getPublishedPosts(),
    getSiteMap()
  ])

  const shellPageId = BLOG_INDEX_PAGE_ID
  const shellProps = await resolveNotionPage(domain, shellPageId)

  if (!shellProps?.recordMap || !shellProps.site) {
    return { notFound: true, revalidate: 60 }
  }

  const filtered = posts.filter((p) =>
    p.tags.some((t) => normalizeTag(t) === tag)
  )

  if (!filtered.length) {
    return { notFound: true, revalidate: 60 }
  }

  const allTags = Array.from(
    new Set(
      posts
        .map((p) => p.tags.map((t) => normalizeTag(t)))
        .flat()
        .filter(Boolean)
    )
  )
    .filter((t) => !isHiddenTag(t))
    .sort((a, b) => a.localeCompare(b))

  let blogIndexUrl = '/'
  const blogRecordMap = siteMap.pageMap[BLOG_INDEX_PAGE_ID]
  if (blogRecordMap) {
    blogIndexUrl = mapPageUrl(
      siteMap.site,
      blogRecordMap,
      new URLSearchParams()
    )(BLOG_INDEX_PAGE_ID)
  }

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
                  className={`notion-tag-link ${isActive ? 'is-active-tag' : ''}`}
                >
                  <span className='notion-property-multi_select-item'>{t}</span>
                </Link>
              )
            })}
          </div>
        )}

        <div className='notion-gallery-grid' style={{ marginTop: 24 }}>
          {posts.map((post) => (
            <Link
              key={post.pageId}
              href={post.url}
              className='notion-collection-card'
              style={{ display: 'block' }}
            >
              {post.cover ? (
                <div className='notion-collection-card-cover'>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.cover} alt='' />
                </div>
              ) : null}

              <div className='notion-collection-card-body'>
                <div className='notion-page-title-text'>{post.title}</div>

                {post.published ? (
                  <div className='notion-property-text' style={{ marginTop: 6 }}>
                    {post.published}
                  </div>
                ) : null}

                {post.summary ? (
                  <div className='notion-property-text' style={{ marginTop: 8 }}>
                    {post.summary}
                  </div>
                ) : null}
              </div>
            </Link>
          ))}
        </div>

        <div className='tag-archive-back'>
          <Link href={blogIndexUrl}>{'←'} All Posts</Link>
        </div>
      </div>
    </NotionPage>
  )
}
