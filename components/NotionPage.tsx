'use client'

import cs from 'classnames'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import {
  estimatePageReadTime,
  formatDate,
  getBlockTitle,
  getBlockValue,
  getPageProperty,
  getSignedFileUrl,
  // normalizeTitle,
  parsePageId
} from 'notion-utils'
import * as React from 'react'
import BodyClassName from 'react-body-classname'
import { type NotionComponents, NotionRenderer } from 'react-notion-x'

import type * as types from '@/lib/types'
import * as config from '@/lib/config'
import { mapImageUrl } from '@/lib/map-image-url'
import { mapPageUrl } from '@/lib/map-page-url'
import { searchNotion } from '@/lib/search-notion'

import { ArticleMasthead } from './ArticleMasthead'
import {
  ArticleCardTextTransition,
  ArticlePageLink,
  ArticleTransitionImage,
  ArticleTransitionProvider
} from './ArticleViewTransitions'
import { AuthorLetter } from './AuthorLetter'
import { Footer } from './Footer'
import { NotionPageHeader } from './NotionPageHeader'
import { PageAside } from './PageAside'
import { Page404 } from './Page404'
import { MainContentTarget } from './SkipLink'
import { SpecialPageShell } from './SpecialPageShell'
import { TableOfContentsBottomState } from './TableOfContentsBottomState'

// -----------------------------------------------------------------------------
// dynamic imports for optional components
// -----------------------------------------------------------------------------

const Code = dynamic(() =>
  import('react-notion-x/third-party/code').then(async (m) => {
    // add / remove any prism syntaxes here
    await Promise.allSettled([
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-markup-templating.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-markup.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-bash.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-cpp.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-js-templates.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-diff.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-git.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-go.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-markdown.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-python.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-rust.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-yaml.js')
    ])
    return m.Code
  })
)

const Modal = dynamic(
  () =>
    import('react-notion-x/third-party/modal').then((m) => {
      m.Modal.setAppElement('.notion-viewport')
      return m.Modal
    }),
  {
    ssr: false
  }
)

const Collection = dynamic(
  () =>
    import('react-notion-x/third-party/collection').then((m) => m.Collection),
  { ssr: false }
)

const Tweet = dynamic(() => import('./NotionTweet').then((m) => m.NotionTweet))

const propertyLastEditedTimeValue = (
  { block, pageHeader }: any,
  defaultFn: () => React.ReactNode
) => {
  if (pageHeader && block?.last_edited_time) {
    return `Last updated ${formatDate(block?.last_edited_time, {
      month: 'long'
    })}`
  }

  return defaultFn()
}

const propertyDateValue = (
  { data, schema, pageHeader }: any,
  defaultFn: () => React.ReactNode
) => {
  if (pageHeader && schema?.name?.toLowerCase() === 'published') {
    const publishDate = data?.[0]?.[1]?.[0]?.[1]?.start_date

    if (publishDate) {
      return `${formatDate(publishDate, {
        month: 'long'
      })}`
    }
  }

  return defaultFn()
}

const propertyTextValue = (
  { block, schema, pageHeader }: any,
  defaultFn: () => React.ReactNode
) => {
  const content = defaultFn()

  if (pageHeader && schema?.name?.toLowerCase() === 'author') {
    return <b>{content}</b>
  }

  if (
    !pageHeader &&
    block?.type === 'page' &&
    block.parent_table === 'collection' &&
    schema?.name?.toLowerCase() === 'description'
  ) {
    return (
      <ArticleCardTextTransition pageId={block.id} part='description'>
        {content}
      </ArticleCardTextTransition>
    )
  }

  return content
}

const propertyTitleValue = (
  { block, pageHeader }: any,
  defaultFn: () => React.ReactNode
) => {
  const content = defaultFn()

  if (
    !pageHeader &&
    block?.type === 'page' &&
    block.parent_table === 'collection'
  ) {
    return (
      <ArticleCardTextTransition pageId={block.id} part='title'>
        {content}
      </ArticleCardTextTransition>
    )
  }

  return content
}

// const propertySelectValue = (
//   { schema, value, key, pageHeader }: any,
//   defaultFn: () => React.ReactNode
// ) => {
//   value = normalizeTitle(value)

//   if (pageHeader && schema.type === 'multi_select' && value) {
//     return (
//       <Link href={`/tags/${value}`} key={key} legacyBehavior>
//         <a>{defaultFn()}</a>
//       </Link>
//     )
//   }

//   return defaultFn()
// }

const HeroHeader = dynamic<{ className?: string }>(() =>
  import('./HeroHeader').then((m) => m.HeroHeader)
)

const LandingSignature = dynamic(() =>
  import('./LandingSignature').then((m) => m.LandingSignature)
)

const defaultNotionRendererComponents: Partial<NotionComponents> = {
  nextImage: ArticleTransitionImage,
  nextLink: Link,
  PageLink: ArticlePageLink,
  Code,
  Collection,
  Modal,
  Tweet,
  Header: NotionPageHeader,
  propertyLastEditedTimeValue,
  propertyTextValue,
  propertyTitleValue,
  propertyDateValue
  // propertySelectValue
}

export type NotionPageProps = Required<
  Pick<types.PageProps, 'site' | 'recordMap' | 'pageId'>
> &
  Pick<types.PageProps, 'error' | 'tagsPage' | 'propertyToFilterName'> & {
    components?: Partial<NotionComponents>
    isLiteMode?: boolean
  }

export function NotionPage({
  components,
  site,
  recordMap,
  pageId,
  error,
  tagsPage,
  propertyToFilterName,
  isLiteMode = false
}: NotionPageProps) {
  const notionRendererComponents = React.useMemo(
    () =>
      components
        ? { ...defaultNotionRendererComponents, ...components }
        : defaultNotionRendererComponents,
    [components]
  )
  const siteMapPageUrl = React.useMemo(() => {
    const params: any = {}
    if (isLiteMode) params.lite = 'true'

    const searchParams = new URLSearchParams(params)
    return mapPageUrl(site, recordMap, searchParams)
  }, [site, recordMap, isLiteMode])

  const keys = Object.keys(recordMap?.block || {})
  const block = getBlockValue(recordMap?.block?.[keys[0]!])!

  const isRootPage =
    parsePageId(block?.id) === parsePageId(site?.rootNotionPageId)
  const isBlogPost =
    block?.type === 'page' && block?.parent_table === 'collection'
  const isAboutPage =
    parsePageId(block?.id) === parsePageId('8d0062776d0c4afca96eb1ace93a7538')

  const showTableOfContents = !!isBlogPost
  const minTableOfContentsItems = 3
  const name = block
    ? getBlockTitle(block, recordMap) || site?.name || config.name
    : site?.name || config.name
  const title =
    tagsPage && propertyToFilterName ? `${propertyToFilterName} ${name}` : name

  const pageAside = React.useMemo(
    () => (
      <PageAside block={block!} recordMap={recordMap} isBlogPost={isBlogPost} />
    ),
    [block, recordMap, isBlogPost]
  )

  const pageCover = React.useMemo(() => {
    if (isLiteMode) return null

    if (isAboutPage) {
      return (
        <HeroHeader className='notion-page-cover-wrapper notion-page-cover-hero' />
      )
    }

    if (isBlogPost && block?.type === 'page') {
      const pageBlock = block as types.PageBlock
      const rawCoverUrl =
        pageBlock.format?.page_cover || config.defaultPageCover
      const signedCoverUrl = getSignedFileUrl(
        rawCoverUrl,
        pageBlock,
        recordMap.signed_urls
      )
      const coverUrl =
        mapImageUrl(signedCoverUrl, pageBlock) || '/page-cover.jpg'
      const rawIcon = pageBlock.format?.page_icon
      const iconIsImage = Boolean(
        rawIcon &&
        (rawIcon.includes('/') ||
          rawIcon.includes(':') ||
          rawIcon.startsWith('data:') ||
          rawIcon.startsWith('blob:'))
      )
      const iconUrl = iconIsImage
        ? mapImageUrl(
            getSignedFileUrl(rawIcon, pageBlock, recordMap.signed_urls),
            pageBlock
          )
        : undefined
      const publishedTimestamp = getPageProperty<number>(
        'Published',
        pageBlock,
        recordMap
      )
      const readTime = estimatePageReadTime(pageBlock, recordMap)
      const tags = (
        getPageProperty<string[]>('Tags', pageBlock, recordMap) || []
      ).filter(Boolean)

      return (
        <ArticleMasthead
          pageId={pageBlock.id}
          title={title}
          description={
            getPageProperty<string>('Description', pageBlock, recordMap) || ''
          }
          iconEmoji={!iconIsImage ? rawIcon : undefined}
          iconUrl={iconUrl}
          published={
            publishedTimestamp
              ? formatDate(publishedTimestamp, { month: 'long' })
              : 'Unpublished'
          }
          author={
            getPageProperty<string>('Author', pageBlock, recordMap) ||
            config.author
          }
          readingLength={`${Math.max(
            1,
            Math.ceil(readTime.totalReadTimeInMinutes)
          )} min read`}
          tags={tags}
          coverUrl={coverUrl}
          coverAlt=''
          coverPosition={
            pageBlock.format?.page_cover_position ??
            config.defaultPageCoverPosition
          }
        />
      )
    }

    return null
  }, [block, isAboutPage, isBlogPost, isLiteMode, recordMap, title])

  // for easier debugging
  React.useEffect(() => {
    if (error || !site || !block || !recordMap) return

    console.log('notion page', {
      isDev: config.isDev,
      title,
      pageId,
      rootNotionPageId: site.rootNotionPageId,
      recordMap
    })

    const g = window as any
    g.pageId = pageId
    g.recordMap = recordMap
    g.block = block
  }, [block, error, pageId, recordMap, site, title])

  if (error || !site || !block || !recordMap) {
    return (
      <SpecialPageShell sourceNotionPageId={pageId}>
        <Page404 site={site} pageId={pageId} error={error} />
      </SpecialPageShell>
    )
  }

  return (
    <>
      {isLiteMode && <BodyClassName className='notion-lite' />}

      <TableOfContentsBottomState enabled={showTableOfContents} />

      <ArticleTransitionProvider
        enabled={isRootPage && !isLiteMode}
        recordMap={recordMap}
      >
        <NotionRenderer
          bodyClassName={
            isLiteMode
              ? undefined
              : cs(
                  isRootPage && 'index-page landing-page',
                  isBlogPost && 'article-page',
                  !isRootPage && !isBlogPost && 'standard-page',
                  isAboutPage && 'about-page',
                  tagsPage && 'tags-page'
                )
          }
          className={
            isLiteMode
              ? undefined
              : cs(
                  isRootPage && 'landing-notion',
                  isBlogPost && 'article-notion',
                  !isRootPage && !isBlogPost && 'standard-notion'
                )
          }
          darkMode={true}
          components={notionRendererComponents}
          recordMap={recordMap}
          rootPageId={site.rootNotionPageId}
          rootDomain={site.domain}
          fullPage={!isLiteMode}
          previewImages={!!recordMap.preview_images}
          showCollectionViewDropdown={false}
          showTableOfContents={showTableOfContents}
          minTableOfContentsItems={minTableOfContentsItems}
          tableOfContentsTitle='On this page'
          defaultPageIcon={undefined}
          defaultPageCover={undefined}
          defaultPageCoverPosition={config.defaultPageCoverPosition}
          linkTableTitleProperties={false}
          mapPageUrl={siteMapPageUrl}
          mapImageUrl={mapImageUrl}
          searchNotion={config.isSearchEnabled ? searchNotion : undefined}
          disableHeader={false}
          header={isRootPage ? <LandingSignature /> : undefined}
          pageAside={isBlogPost ? pageAside : undefined}
          pageHeader={
            <>
              <MainContentTarget />

              {isRootPage ? (
                <>
                  <AuthorLetter />

                  <header className='landing-writing-header'>
                    <h2 id='writing'>Writing</h2>
                  </header>
                </>
              ) : null}
            </>
          }
          footer={
            <>
              {isBlogPost ? (
                <nav
                  className='article-end-navigation'
                  aria-label='Article navigation'
                >
                  <Link href='/'>
                    <span aria-hidden='true'>&larr;</span>
                    Back home
                  </Link>
                </nav>
              ) : null}

              <Footer sourceNotionPageId={pageId} />
            </>
          }
          pageTitle={tagsPage && propertyToFilterName ? title : undefined}
          pageCover={pageCover}
        />
      </ArticleTransitionProvider>
    </>
  )
}
