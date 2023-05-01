import * as React from 'react'
import { GetStaticProps } from 'next'

import { domain, isDev } from '@/lib/config'
import { getSiteMap } from '@/lib/get-site-map'
import { resolveNotionPage } from '@/lib/resolve-notion-page'
import { PageProps, Params } from '@/lib/types'

export const getStaticProps: GetStaticProps<PageProps, Params> = async (
  context
) => {
  const rawPageId = context.params.pageId as string

  try {
    const props = await resolveNotionPage(domain, rawPageId)

    return {
      props,
      revalidate: 10
    }
  } catch (err) {
    console.error('page error', domain, rawPageId, err)

    // we don't want to publish the error version of this page, so
    // let next.js know explicitly that incremental SSG failed
    throw err
  }
}

export async function getStaticPaths() {
  if (isDev) {
    return {
      paths: [],
      fallback: true
    }
  }

  const siteMap = await getSiteMap()

  const staticPaths = {
    paths: Object.keys(siteMap.canonicalPageMap).map((pageId) => ({
      params: {
        pageId
      }
    })),
    // paths: [],
    fallback: true
  }

  console.log(staticPaths.paths)
  return staticPaths
}

// export default function NotionDomainDynamicPage(req, res, props) {
//   res.status(200).json(props)
// }
// export default function handler(req, res) {
//   res.status(200).json({ name: 'John Doe' })
// }
export default async function NotionDomainDynamicPage(req, res) {
  const rawPageId = req.query.pageId as string

  const props = await resolveNotionPage(domain, rawPageId)

  // console.log(req.query)
  res.status(200).json(props)

  // return <pre>{CircularJSON.stringify(props, null, 2)}</pre>
  // return <pre><code>{JSON.stringify(props, null, 2)}</code></pre>
  // return res.status(200).
}
