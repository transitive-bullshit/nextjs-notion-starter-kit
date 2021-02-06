'use client'

import Image, { type ImageProps } from 'next/image'
import Link, { type LinkProps } from 'next/link'
import { useRouter } from 'next/navigation'
import { type ExtendedRecordMap, type PageBlock } from 'notion-types'
import {
  getBlockTitle,
  getBlockValue,
  getSignedFileUrl,
  uuidToId
} from 'notion-utils'
import * as React from 'react'

import { mapImageUrl } from '@/lib/map-image-url'

import styles from './article-view-transitions.module.css'

type ArticleTransitionPart = 'description' | 'hero' | 'title'

interface ArticleTransitionContextValue {
  articleCoverPageIds: ReadonlyMap<string, string | null>
  enabled: boolean
}

const emptyArticleCoverPageIds = new Map<string, string | null>()
const ArticleTransitionContext =
  React.createContext<ArticleTransitionContextValue>({
    articleCoverPageIds: emptyArticleCoverPageIds,
    enabled: false
  })

export function ArticleTransitionProvider({
  children,
  enabled,
  recordMap
}: {
  children: React.ReactNode
  enabled: boolean
  recordMap: ExtendedRecordMap
}) {
  const articleCoverPageIds = React.useMemo(
    () =>
      enabled ? createArticleCoverPageIds(recordMap) : emptyArticleCoverPageIds,
    [enabled, recordMap]
  )
  const value = React.useMemo(
    () => ({ articleCoverPageIds, enabled }),
    [articleCoverPageIds, enabled]
  )

  return (
    <ArticleTransitionContext.Provider value={value}>
      {children}
    </ArticleTransitionContext.Provider>
  )
}

export function ArticlePageLink({
  href,
  onFocus,
  onMouseEnter,
  prefetch,
  ...props
}: LinkProps & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const router = useRouter()
  const prefetchOnIntent = () => {
    if (
      prefetch === undefined &&
      typeof href === 'string' &&
      href.startsWith('/')
    ) {
      router.prefetch(href)
    }
  }

  return (
    <Link
      {...props}
      href={href}
      prefetch={prefetch === undefined ? false : prefetch}
      onMouseEnter={(event) => {
        onMouseEnter?.(event)
        if (!event.defaultPrevented) prefetchOnIntent()
      }}
      onFocus={(event) => {
        onFocus?.(event)
        if (!event.defaultPrevented) prefetchOnIntent()
      }}
    />
  )
}

export function ArticleTransitionImage(props: ImageProps) {
  const { articleCoverPageIds, enabled } = React.useContext(
    ArticleTransitionContext
  )
  const src = getImageSource(props.src)
  const pageId =
    enabled && src
      ? articleCoverPageIds.get(createCoverKey(src, props.alt))
      : undefined
  const image = <Image {...props} />

  return pageId ? (
    <ArticleSharedElement pageId={pageId} part='hero'>
      {image}
    </ArticleSharedElement>
  ) : (
    image
  )
}

export function ArticleCardTextTransition({
  children,
  pageId,
  part
}: {
  children: React.ReactNode
  pageId: string
  part: Extract<ArticleTransitionPart, 'description' | 'title'>
}) {
  const { enabled } = React.useContext(ArticleTransitionContext)
  if (!enabled) return children

  return (
    <ArticleSharedElement pageId={pageId} part={part}>
      <span className={styles.cardText}>{children}</span>
    </ArticleSharedElement>
  )
}

export function ArticleSharedElement({
  children,
  pageId,
  part
}: {
  children: React.ReactNode
  pageId: string
  part: ArticleTransitionPart
}) {
  return (
    <React.ViewTransition
      name={getArticleTransitionName(pageId, part)}
      share={part === 'hero' ? 'morph' : 'text-morph'}
      default='none'
    >
      {children}
    </React.ViewTransition>
  )
}

function createArticleCoverPageIds(
  recordMap: ExtendedRecordMap
): Map<string, string | null> {
  const articleCoverPageIds = new Map<string, string | null>()

  for (const blockValue of Object.values(recordMap.block)) {
    const block = getBlockValue(blockValue)
    if (
      block?.type !== 'page' ||
      block.parent_table !== 'collection' ||
      !block.format?.page_cover
    ) {
      continue
    }

    const pageBlock = block as PageBlock
    const signedCoverUrl = getSignedFileUrl(
      pageBlock.format.page_cover,
      pageBlock,
      recordMap.signed_urls
    )
    const coverUrl = mapImageUrl(signedCoverUrl, pageBlock)
    const title = getBlockTitle(pageBlock, recordMap)
    if (!coverUrl || !title) continue

    const key = createCoverKey(coverUrl, title)
    articleCoverPageIds.set(
      key,
      articleCoverPageIds.has(key) ? null : pageBlock.id
    )
  }

  return articleCoverPageIds
}

function createCoverKey(src: string, alt: string): string {
  return `${src}\u0000${alt}`
}

function getImageSource(src: ImageProps['src']): string | undefined {
  if (typeof src === 'string') return src

  return 'src' in src ? src.src : src.default.src
}

function getArticleTransitionName(
  pageId: string,
  part: ArticleTransitionPart
): string {
  return `article-${part}-${uuidToId(pageId)}`
}
