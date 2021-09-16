import * as React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import cs from 'classnames'
import { useRouter } from 'next/router'
import { useSearchParam } from 'react-use'
import BodyClassName from 'react-body-classname'
import { PageBlock } from 'notion-types'

//import { Tweet, TwitterContextProvider } from 'react-static-tweets'

// core notion renderer
const NotionRenderer = dynamic( () => import('react-notion-x/build/esm/renderer').then((renderer) => renderer.NotionRenderer));

// utils
import { getBlockTitle } from 'notion-utils'
import { mapPageUrl, getCanonicalPageUrl } from 'lib/map-page-url'
import { mapNotionImageUrl } from 'lib/map-image-url'
import { getPageDescription } from 'lib/get-page-description'
//import { getPageTweet } from 'lib/get-page-tweet'
import { searchNotion } from 'lib/search-notion'
import * as types from 'lib/types'
import * as config from 'lib/config'

// components
import { CustomFont } from './CustomFont'
import { Loading } from './Loading'
import { Page404 } from './Page404'
import { PageHead } from './PageHead'
import { Footer } from './Footer'
import { PageSocial } from './PageSocial'

const Code = dynamic(() =>
  import('react-notion-x/build/esm/components/code').then((code)=>code.Code)
)

const Collection = dynamic(() =>
  import('react-notion-x/build/esm/components/collection').then((notion) => {return notion.Collection})
)

const CollectionRow = dynamic(
  () => import('react-notion-x/build/esm/components/collection-row').then((notion) => {return notion.CollectionRow}),
)

// const Pdf = dynamic(() => import('react-notion-x').then((notion) => notion.Pdf))

// const Equation = dynamic(() =>
//   import('react-notion-x').then((notion) => notion.Equation)
// )

// we're now using a much lighter-weight tweet renderer react-static-tweets
// instead of the official iframe-based embed widget from twitter
// const Tweet = dynamic(() => import('react-tweet-embed'))

// const Modal = dynamic(
//   () => import('react-notion-x').then((notion) => notion.Modal),
//   { ssr: false }
// )

export const NotionPage: React.FC<types.PageProps> = ({
  site,
  recordMap,
  error,
  pageId
}) => {
  const router = useRouter()
  const lite = useSearchParam('lite')

  const params: any = {}
  if (lite) params.lite = lite

  // lite mode is for oembed
  const isLiteMode = lite === 'true'
  const searchParams = new URLSearchParams(params)

  const darkMode = true;
  if (router.isFallback) {
    return <Loading />
  }

  const keys = Object.keys(recordMap?.block || {})
  const block = recordMap?.block?.[keys[0]]?.value

  if (error || !site || !keys.length || !block) {
    return <Page404 site={site} pageId={pageId} error={error} />
  }

  const title = getBlockTitle(block, recordMap) || site.name

  // console.log('notion page', {
  //   isDev: config.isDev,
  //   title,
  //   pageId,
  //   rootNotionPageId: site.rootNotionPageId,
  //   recordMap
  // })

  if (!config.isServer) {
    // add important objects to the window global for easy debugging
    const g = window as any
    g.pageId = pageId
    g.recordMap = recordMap
    g.block = block
  }

  const siteMapPageUrl = mapPageUrl(site, recordMap, searchParams)

  const canonicalPageUrl =
    !config.isDev && getCanonicalPageUrl(site, recordMap)(pageId)

  // const isRootPage =
  //   parsePageId(block.id) === parsePageId(site.rootNotionPageId)
  const isBlogPost =
    block.type === 'page' && block.parent_table === 'collection'
  const showTableOfContents = !!isBlogPost
  const minTableOfContentsItems = 3

  const socialImage = mapNotionImageUrl(
    (block as PageBlock).format?.page_cover || config.defaultPageCover,
    block
  )

  const socialDescription =
    getPageDescription(block, recordMap) ?? config.description

  let pageAside: React.ReactChild = null

  // only display comments and page actions on blog post pages
  if (isBlogPost) {

    // const tweet = getPageTweet(block, recordMap)
    // if (tweet) {
    //   pageAside = <PageActions tweet={tweet} />
    // }
  } else {
    pageAside = <PageSocial />
  }
  return (
    <div>
      <PageHead site={site} />

      <Head>
        <meta property='og:title' content={title} />
        <meta property='og:site_name' content={site.name} />

        <meta name='twitter:title' content={title} />
        <meta property='twitter:domain' content={site.domain} />

        {config.twitter && (
          <meta name='twitter:creator' content={`@${config.twitter}`} />
        )}

        {socialDescription && (
          <>
            <meta name='description' content={socialDescription} />
            <meta property='og:description' content={socialDescription} />
            <meta name='twitter:description' content={socialDescription} />
          </>
        )}

        {socialImage ? (
          <>
            <meta name='twitter:card' content='summary_large_image' />
            <meta name='twitter:image' content={socialImage} />
            <meta property='og:image' content={socialImage} />
          </>
        ) : (
          <meta name='twitter:card' content='summary' />
        )}

        {canonicalPageUrl && (
          <>
            <link rel='canonical' href={canonicalPageUrl} />
            <meta property='og:url' content={canonicalPageUrl} />
            <meta property='twitter:url' content={canonicalPageUrl} />
          </>
        )}

        <title>{title}</title>
      </Head>

      <CustomFont site={site} />

      {isLiteMode && <BodyClassName className='notion-lite' />}
          <NotionRenderer
            bodyClassName={cs(
              "notion",
              pageId === site.rootNotionPageId && 'index-page'
            )}
            components={{
              pageLink: ({
                href,
                as,
                passHref,
                prefetch,
                replace,
                scroll,
                shallow,
                locale,
                ...props
              }) => (
                <Link
                  href={href}
                  as={as}
                  passHref={passHref}
                  prefetch={false}
                  replace={replace}
                  scroll={scroll}
                  shallow={shallow}
                  locale={locale}
                >
                  <a {...props} />
                </Link>
              ),
              collection: Collection,
              collectionRow: CollectionRow,
              //tweet: Tweet,
              //modal: Modal,
              // pdf: Pdf,
              // equation: Equation
            }}
            recordMap={recordMap}
            rootPageId={site.rootNotionPageId}
            fullPage={!isLiteMode}
            darkMode={darkMode}
            previewImages={site.previewImages !== false}
            showCollectionViewDropdown={false}
            showTableOfContents={showTableOfContents}
            minTableOfContentsItems={minTableOfContentsItems}
            defaultPageIcon={config.defaultPageIcon}
            defaultPageCover={config.defaultPageCover}
            defaultPageCoverPosition={config.defaultPageCoverPosition}
            mapPageUrl={siteMapPageUrl}
            mapImageUrl={mapNotionImageUrl}
            searchNotion={searchNotion}
            pageAside={pageAside}
            pageHeader={
              <div className='navbar'>
                <div className='nav-header navbar-contents'>
                  <div className='navbar-contents'>
                    <a href='/about'>
                      {' '}
                      <span>About</span>
                    </a>
                    <a href="/" className="header-nomad-image">
                    <img
                      src='/Scorpion.svg'
                      alt='NOMAD Home'
                      width="auto"
                      height="100%"
                    ></img>
                    </a>
                    <a href='/blog'>
                      {' '}
                      <span >Blog</span>
                    </a>
                    </div>
                </div>
              </div>
            }
            footer={
              <Footer
                isDarkMode={darkMode}
                toggleDarkMode={()=>{}}
            />
            }
          />
        </div>
  )
}
