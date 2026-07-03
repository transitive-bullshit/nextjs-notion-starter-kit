import { track } from '@vercel/analytics'
import dynamic from 'next/dynamic'
import Image from 'next/legacy/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { type PageBlock } from 'notion-types'
import {
  formatDate,
  getBlockTitle,
  getBlockValue,
  getPageProperty,
  parsePageId
} from 'notion-utils'
import * as React from 'react'
import BodyClassName from 'react-body-classname'
import {
  type NotionComponents,
  NotionRenderer,
  useNotionContext
} from 'react-notion-x'
import { EmbeddedTweet, TweetNotFound, TweetSkeleton } from 'react-tweet'

import type * as types from '@/lib/types'
import * as config from '@/lib/config'
import { getExternalUrlMap } from '@/lib/get-external-url-map'
import { mapImageUrl } from '@/lib/map-image-url'
import { getCanonicalPageUrl, mapPageUrl } from '@/lib/map-page-url'
import { searchNotion } from '@/lib/search-notion'
import { useDarkMode } from '@/lib/use-dark-mode'
import { useSearchParam } from '@/lib/use-search-param'
import { cn } from '@/lib/utils'

import { ErrorPage } from './ErrorPage'
import { Footer } from './Footer'
import { Loading } from './Loading'
import { NotionPageHeader } from './NotionPageHeader'
import { Page404 } from './Page404'
import { PageAside } from './PageAside'
import { PageHead } from './PageHead'
import styles from './styles.module.css'
import { Comments } from './wustep/Comments'
import { WustepFooter } from './wustep/WustepFooter'

// -----------------------------------------------------------------------------
// dynamic imports for optional components
// -----------------------------------------------------------------------------

const Code = dynamic(() =>
  import('react-notion-x/build/third-party/code').then(async (m) => {
    // add / remove any prism syntaxes here
    await Promise.allSettled([
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-markup-templating.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-markup.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-bash.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-c.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-cpp.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-csharp.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-docker.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-java.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-js-templates.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-coffeescript.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-diff.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-git.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-go.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-graphql.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-handlebars.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-less.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-makefile.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-markdown.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-objectivec.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-ocaml.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-python.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-reason.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-rust.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-sass.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-scss.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-solidity.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-sql.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-stylus.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-swift.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-wasm.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-yaml.js')
    ])
    return m.Code
  })
)

const Collection = dynamic(() =>
  import('react-notion-x/build/third-party/collection').then(
    (m) => m.Collection
  )
)
const Equation = dynamic(() =>
  import('react-notion-x/build/third-party/equation').then((m) => m.Equation)
)
const Pdf = dynamic(
  () => import('react-notion-x/build/third-party/pdf').then((m) => m.Pdf),
  {
    ssr: false
  }
)
const Modal = dynamic(
  () =>
    import('react-notion-x/build/third-party/modal').then((m) => {
      m.Modal.setAppElement('.notion-viewport')
      return m.Modal
    }),
  {
    ssr: false
  }
)

function Tweet({ id }: { id: string }) {
  const { recordMap } = useNotionContext()
  // @wustep: id is a URL with a query string that includes spaceId, like [id]&spaceId=[spaceId]
  const tweetId = id.split('&')[0]
  const tweet = tweetId
    ? (recordMap as types.ExtendedTweetRecordMap)?.tweets?.[tweetId]
    : undefined

  return (
    <React.Suspense fallback={<TweetSkeleton />}>
      {tweet ? <EmbeddedTweet tweet={tweet} /> : <TweetNotFound />}
    </React.Suspense>
  )
}

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

  /* [@wustep: For list view dates, format as "Dec 2016" instead of "Dec 31, 2016"] */
  if (!pageHeader && data?.[0]?.[1]?.[0]?.[1]?.start_date) {
    const dateStr = data[0][1][0][1].start_date
    const date = new Date(dateStr)
    const month = date.toLocaleString('en-US', { month: 'short' })
    const year = date.getFullYear()
    return `${month} ${year}`
  }

  return defaultFn()
}

const propertyTextValue = (
  { schema, pageHeader }: any,
  defaultFn: () => React.ReactNode
) => {
  if (pageHeader && schema?.name?.toLowerCase() === 'author') {
    return <b>{defaultFn()}</b>
  }

  return defaultFn()
}

interface NotionPageWrapperProps extends types.PageProps {
  componentOverrides?: Partial<NotionComponents>
}

export function NotionPage({
  site,
  recordMap,
  error,
  pageId,
  notionFallbackUrl,
  componentOverrides
}: NotionPageWrapperProps) {
  const router = useRouter()
  const lite = useSearchParam('lite')

  // lite mode is for oembed
  const isLiteMode = lite === 'true'

  const { isDarkMode } = useDarkMode()

  const externalUrlMap = React.useMemo(
    () =>
      recordMap ? getExternalUrlMap(recordMap) : new Map<string, string>(),
    [recordMap]
  )

  const siteMapPageUrl = React.useMemo(() => {
    const params: Record<string, string> = {}
    if (lite) params.lite = lite

    const searchParams = new URLSearchParams(params)
    if (!site) return undefined
    const baseMapPageUrl = mapPageUrl(site, recordMap!, searchParams)
    return (pageId = '') => {
      const externalUrl = externalUrlMap.get(
        parsePageId(pageId, { uuid: false })!
      )
      if (externalUrl) return externalUrl
      return baseMapPageUrl(pageId)
    }
  }, [site, recordMap, lite, externalUrlMap])

  const ExternalAwarePageLink = React.useMemo(() => {
    function PageLinkComponent(props: any) {
      const { href, ...rest } = props
      if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
        return (
          <a
            href={href}
            target='_blank'
            rel='noopener noreferrer'
            data-external-link
            {...rest}
          />
        )
      }
      return <a href={href} {...rest} />
    }
    PageLinkComponent.displayName = 'ExternalAwarePageLink'
    return PageLinkComponent
  }, [])

  const components = React.useMemo<Partial<NotionComponents>>(
    () => ({
      nextLegacyImage: Image,
      nextLink: Link,
      Code,
      Collection,
      Equation,
      Pdf,
      Modal,
      Tweet,
      Header: NotionPageHeader,
      PageLink: ExternalAwarePageLink,
      propertyLastEditedTimeValue,
      propertyTextValue,
      propertyDateValue,
      ...componentOverrides
    }),
    [componentOverrides, ExternalAwarePageLink]
  )

  const keys = Object.keys(recordMap?.block || {})
  const block = getBlockValue(recordMap?.block?.[keys[0]!])

  const isRootPage =
    parsePageId(block?.id) === parsePageId(site?.rootNotionPageId)

  const auxiliaryPageIds = new Set(Object.values(config.pageUrlOverrides))
  const isAuxiliaryPage =
    !isRootPage &&
    auxiliaryPageIds.has(parsePageId(block?.id, { uuid: false })!)

  const isBlogPost =
    block?.type === 'page' && block?.parent_table === 'collection'

  const showTableOfContents =
    !!isBlogPost &&
    !getPageProperty<string>('Disable Table of Contents', block, recordMap!)
  const minTableOfContentsItems = 3

  const pageAside = React.useMemo(
    () => (
      <PageAside
        block={block!}
        recordMap={recordMap!}
        isBlogPost={isBlogPost}
      />
    ),
    [block, recordMap, isBlogPost]
  )

  const footer = React.useMemo(() => <Footer />, [])

  // Redirect to external URL if the page has one configured
  const externalRedirectUrl = React.useMemo(() => {
    if (!block || !recordMap) return null
    const isExternal = getPageProperty<boolean>('External', block, recordMap)
    if (!isExternal) return null
    return getPageProperty<string>('External URL', block, recordMap) || null
  }, [block, recordMap])

  React.useEffect(() => {
    if (externalRedirectUrl) {
      window.location.replace(externalRedirectUrl)
    }
  }, [externalRedirectUrl])

  React.useEffect(() => {
    if (notionFallbackUrl) {
      track('notion-fallback-redirect', {
        page: pageId ?? 'unknown',
        destination: notionFallbackUrl
      })
      window.location.replace(notionFallbackUrl)
    }
  }, [notionFallbackUrl, pageId])

  if (router.isFallback) {
    return <Loading />
  }

  if (externalRedirectUrl || notionFallbackUrl) {
    return <Loading />
  }

  if (error || !site || !block || !recordMap) {
    if (error && error.statusCode !== 404) {
      return <ErrorPage statusCode={error.statusCode} />
    }

    return <Page404 site={site} pageId={pageId} error={error} />
  }

  const title = getBlockTitle(block, recordMap) || site.name

  if (config.isDev) {
    // @wustep: only do this if in dev
    console.log('notion page', {
      title,
      pageId,
      rootNotionPageId: site.rootNotionPageId,
      recordMap
    })
  }

  if (!config.isServer) {
    // add important objects to the window global for easy debugging
    const g = window as unknown as Record<string, unknown>
    g.pageId = pageId
    g.recordMap = recordMap
    g.block = block
  }

  const canonicalPageUrl = config.isDev
    ? undefined
    : getCanonicalPageUrl(site, recordMap)(pageId)

  const socialImage = mapImageUrl(
    getPageProperty<string>('Social Image', block, recordMap) ||
      (block as PageBlock).format?.page_cover ||
      config.defaultPageCover,
    block
  )

  const socialDescription =
    getPageProperty<string>('Description', block, recordMap) ||
    config.description

  const shouldDisableCollectionLinks = getPageProperty<string>(
    'Disable Collection Links',
    block,
    recordMap
  )

  // @wustep: Show post comments!
  const postComments =
    !isRootPage &&
    getPageProperty<string>('Author', block, recordMap) === 'Stephen Wu' &&
    getPageProperty<boolean>('Disable Comments', block, recordMap) !== true ? (
      <Comments />
    ) : undefined

  // @wustep: Custom post footers based on author
  const postFooter =
    !isRootPage &&
    getPageProperty<string>('Author', block, recordMap) === 'Stephen Wu' ? (
      <WustepFooter />
    ) : undefined

  // @wustep: Allow showing property names normally
  const enablePagePropertyNames = getPageProperty<boolean>(
    'Enable Page Property Names',
    block,
    recordMap
  )

  return (
    <>
      <PageHead
        pageId={pageId}
        site={site}
        title={title}
        description={socialDescription}
        image={socialImage}
        url={canonicalPageUrl}
        isBlogPost={isBlogPost}
      />

      {isLiteMode && <BodyClassName className='notion-lite' />}
      {isDarkMode && <BodyClassName className='dark-mode' />}

      <NotionRenderer
        bodyClassName={cn(
          styles.notion,
          pageId === site.rootNotionPageId && 'index-page',
          isAuxiliaryPage && 'auxiliary-page',
          shouldDisableCollectionLinks && 'disable-collection-links',
          enablePagePropertyNames && 'enable-page-property-names'
        )}
        darkMode={isDarkMode}
        components={components}
        recordMap={recordMap}
        rootPageId={site.rootNotionPageId}
        rootDomain={site.domain}
        fullPage={!isLiteMode}
        previewImages={!!recordMap.preview_images}
        showCollectionViewDropdown={false}
        showTableOfContents={showTableOfContents}
        minTableOfContentsItems={minTableOfContentsItems}
        defaultPageIcon={config.defaultPageIcon}
        defaultPageCover={config.defaultPageCover}
        defaultPageCoverPosition={config.defaultPageCoverPosition}
        mapPageUrl={siteMapPageUrl}
        mapImageUrl={mapImageUrl}
        searchNotion={config.isSearchEnabled ? searchNotion : undefined}
        pageAside={pageAside}
        pageFooter={
          <>
            {postFooter}
            {postComments}
          </>
        }
        footer={footer}
      />
    </>
  )
}
