import * as React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useLocalStorage, useSearchParam } from 'react-use'
import BodyClassName from 'react-body-classname'
import isUrl from 'is-url-superb'

// core notion renderer
import { NotionRenderer } from 'react-notion-x'

// utils
import { getBlockTitle } from 'notion-utils'
import * as types from 'lib/types'
import { mapPageUrl, getCanonicalPageUrl } from 'lib/map-page-url'
import { mapNotionImageUrl } from 'lib/map-image-url'
// import { isDev } from 'lib/config'

// components
import { CustomFont } from './CustomFont'
import { CustomHtml } from './CustomHtml'
import { Loading } from './Loading'
import { Page404 } from './Page404'
import { PageHead } from './PageHead'

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
  let notionIcon = (block.format as any)?.page_icon

  if (notionIcon && isUrl(notionIcon)) {
    notionIcon = mapNotionImageUrl(notionIcon, block)
  }

  const icon = notionIcon
  const iconUrl = (icon && isUrl(icon)) ?? icon

  console.log('notion page', {
    // isDev,
    rootNotionPageId: site.rootNotionPageId,
    pageId,
    recordMap
  })

  if (!isServer) {
    ;(window as any).recordMap = recordMap
    ;(window as any).block = block
  }

  const siteMapPageUrl = mapPageUrl(site, recordMap, searchParams)

  // const canonicalPageUrl =
  //   !isDev && getCanonicalPageUrl(site, recordMap)(pageId)

  return (
    <>
      <PageHead site={site} />

      <Head>
        {/* {iconUrl && <link rel='shortcut icon' href={iconUrl} />} */}

        <meta property='og:title' content={title} />
        <meta property='og:site_name' content={site.name} />

        {/* {canonicalPageUrl && <link rel='canonical' href={canonicalPageUrl} />} */}

        <title>{title}</title>
      </Head>

      <CustomFont site={site} />

      {isLiteMode && <BodyClassName className='notion-lite' />}

      <NotionRenderer
        bodyClassName={styles.notion}
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
        fullPage={!isLiteMode}
        darkMode={isDarkMode}
        previewImages={site.previewImages !== false}
        mapPageUrl={siteMapPageUrl}
        mapImageUrl={mapNotionImageUrl}
        rootPageId={site.rootNotionPageId}
      />

      <CustomHtml site={site} />
    </>
  )
}
