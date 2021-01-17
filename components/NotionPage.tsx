import * as React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import cs from 'classnames'
import { useRouter } from 'next/router'
import { useLocalStorage, useSearchParam } from 'react-use'
import { IconContext } from 'react-icons'
import BodyClassName from 'react-body-classname'

// core notion renderer
import { NotionRenderer } from 'react-notion-x'

// utils
import { getBlockTitle } from 'notion-utils'
import * as types from 'lib/types'
import { mapPageUrl, getCanonicalPageUrl } from 'lib/map-page-url'
import { mapNotionImageUrl } from 'lib/map-image-url'
import { isDev } from 'lib/config'
import { searchNotion } from 'lib/search-notion'

// components
import { CustomFont } from './CustomFont'
import { CustomHtml } from './CustomHtml'
import { Loading } from './Loading'
import { Page404 } from './Page404'
import { PageHead } from './PageHead'
import { Footer } from './Footer'
import { ReactUtterances } from './ReactUtterances'

import styles from './styles.module.css'

const isServer = typeof window === 'undefined'

export const NotionPage: React.FC<types.PageProps> = ({
  site,
  recordMap,
  error,
  pageId
}) => {
  const router = useRouter()

  const dark = useSearchParam('dark')
  const lite = useSearchParam('lite')

  const params: any = {}
  if (dark) params.dark = dark
  if (lite) params.lite = lite

  const searchParams = new URLSearchParams(params)

  // TODO: add ability to toggle dark mode
  const [darkMode, setDarkMode] = useLocalStorage(
    'notionx-dark-mode',
    !!site?.darkMode
  )

  const isLiteMode = lite === 'true'
  const isDarkMode = dark !== null ? dark === 'true' : darkMode

  if (router.isFallback) {
    return <Loading />
  }

  const keys = Object.keys(recordMap?.block || {})
  const block = recordMap?.block?.[keys[0]]?.value

  if (error || !site || !keys.length || !block) {
    return <Page404 site={site} pageId={pageId} error={error} />
  }

  const title = getBlockTitle(block, recordMap) || site.name

  console.log('notion page', {
    isDev,
    title,
    pageId,
    rootNotionPageId: site.rootNotionPageId,
    recordMap
  })

  if (!isServer) {
    // add important objects global window for easy debugging
    ;(window as any).recordMap = recordMap
    ;(window as any).block = block
  }

  const siteMapPageUrl = mapPageUrl(site, recordMap, searchParams)

  const canonicalPageUrl =
    !isDev && getCanonicalPageUrl(site, recordMap)(pageId)

  let comments: React.ReactNode = null

  // only display comments on blog post pages
  if (block.type === 'page' && block.parent_table === 'collection') {
    comments = (
      <ReactUtterances
        repo='transitive-bullshit/transitivebullsh.it'
        issueMap='issue-term'
        issueTerm='title'
        label='blog post'
        theme='preferred-color-scheme'
      />
    )
  }

  return (
    <IconContext.Provider value={{ style: { verticalAlign: 'middle' } }}>
      <PageHead site={site} />

      <Head>
        <meta property='og:title' content={title} />
        <meta property='og:site_name' content={site.name} />

        {canonicalPageUrl && <link rel='canonical' href={canonicalPageUrl} />}

        <title>{title}</title>
      </Head>

      <CustomFont site={site} />

      {isLiteMode && <BodyClassName className='notion-lite' />}

      <NotionRenderer
        bodyClassName={cs(
          styles.notion,
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
              prefetch={prefetch}
              replace={replace}
              scroll={scroll}
              shallow={shallow}
              locale={locale}
            >
              <a {...props} />
            </Link>
          )
        }}
        recordMap={recordMap}
        rootPageId={site.rootNotionPageId}
        fullPage={!isLiteMode}
        darkMode={isDarkMode}
        previewImages={site.previewImages !== false}
        showCollectionViewDropdown={false}
        defaultPageIcon='https://ssfy.io/https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fs3-us-west-2.amazonaws.com%252Fsecure.notion-static.com%252F797768e4-f24a-4e65-bd4a-b622ae9671dc%252Fprofile-2020-280w-circle.png%3Ftable%3Dblock%26id%3D78fc5a4b-88d7-4b0e-824e-29407e9f1ec1%26cache%3Dv2'
        defaultPageCover='https://ssfy.io/https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fs3-us-west-2.amazonaws.com%252Fsecure.notion-static.com%252F9fc5ecae-2b4b-4e73-b0d4-918c829ba69f%252FIMG_0259-opt.jpg%3Ftable%3Dblock%26id%3D78fc5a4b-88d7-4b0e-824e-29407e9f1ec1%26cache%3Dv2'
        defaultPageCoverPosition={0.1862}
        mapPageUrl={siteMapPageUrl}
        mapImageUrl={mapNotionImageUrl}
        searchNotion={searchNotion}
        pageFooter={comments}
        footer={<Footer />}
      />

      <CustomHtml site={site} />
    </IconContext.Provider>
  )
}
