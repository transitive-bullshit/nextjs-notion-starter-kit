import React from 'react'
import { isDemoMode, isDev } from 'lib/config'
import { getSiteMaps } from 'lib/get-site-maps'
import { resolveNotionPage } from 'lib/resolve-notion-page'
import { NotionPage } from 'components'

export const getStaticProps = async (context) => {
  const domain = context.params.domain as string
  const rawPageId = context.params.pageId as string
  const isDemo = isDemoMode(domain)

  try {
    const props = await resolveNotionPage(domain, rawPageId)

    return { props, unstable_revalidate: 10 }
  } catch (err) {
    console.error('page error', domain, rawPageId, err)

    return {
      props: {
        error: {
          statusCode: err.statusCode || 500,
          message: err.message
        },
        isDemo
      }
    }
  }
}

export async function getStaticPaths() {
  if (isDev) {
    return {
      paths: [],
      fallback: true
    }
  }

  const siteMaps = await getSiteMaps()

  const ret = {
    paths: siteMaps.flatMap((siteMap) =>
      siteMap.pageIds.map((pageId) => ({
        params: {
          domain: siteMap.site.domain,
          pageId
        }
      }))
    ),
    // paths: [],
    fallback: true
  }

  console.log(ret.paths)
  return ret
}

export default function NotionDomainDynamicPage(props) {
  return <NotionPage {...props} />
}
