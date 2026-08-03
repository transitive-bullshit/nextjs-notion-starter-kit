import type { GetServerSideProps } from 'next'

import type { SiteMap } from '@/lib/types'
import { host } from '@/lib/config'
import { getSiteMap } from '@/lib/get-site-map'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  if (req.method !== 'GET') {
    res.statusCode = 405
    res.setHeader('Content-Type', 'application/json')
    res.write(JSON.stringify({ error: 'method not allowed' }))
    res.end()
    return { props: {} }
  }

  const siteMap = await getSiteMap()

  // Cache at CDN level — Notion data refreshes via KV TTL (24h)
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=14400, stale-while-revalidate=86400'
  )
  res.setHeader('Content-Type', 'text/xml')
  res.write(createSitemap(siteMap))
  res.end()

  return { props: {} }
}

const createSitemap = (siteMap: SiteMap) => {
  const urls = Object.keys(siteMap.canonicalPageMap)
    .map((path) => `  <url>\n    <loc>${host}/${path}</loc>\n  </url>`)
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${host}</loc>
  </url>
${urls}
</urlset>`
}

export default function noop() {
  return null
}
