import { GetServerSideProps } from 'next'

import { CanonicalPageMap, SiteMap } from '../lib/types'
import { host, removeApiPrefixFromSitemapAndRobotsTxtPages, sitemapOnlyPageUrlOverridden } from '../lib/config'
import { getOnlyUrlOverriddenSiteMaps, getSiteMaps } from '../lib/get-site-maps'
import * as types from '../lib/types'

export const getServerSideProps: GetServerSideProps = async (
  { req,
    res }
    ) => {
  if (!removeApiPrefixFromSitemapAndRobotsTxtPages) {
    return {
      redirect: {
        destination: `/api/sitemap.xml`,
        statusCode: 301,
      }
    }
  }

  if (req.method !== 'GET') {
    res.statusCode = 405
    res.setHeader("Content-Type", "application/json")
    res.write(JSON.stringify({ error: "method not allowed" }))
    res.end()
    return {
      props: {}
    }
  }

  let siteMaps: types.SiteMap[]
  if (sitemapOnlyPageUrlOverridden) {
    siteMaps = await getOnlyUrlOverriddenSiteMaps()
  } else {
    siteMaps = await getSiteMaps()
  }

  // cache sitemap for up to one hour
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=3600, max-age=3600, stale-while-revalidate=3600'
  )
  res.setHeader('Content-Type', 'text/xml')
  res.write(createSitemap(siteMaps[0].canonicalPageMap))
  res.end()

  return {
    props: {}
  }
}

const createSitemap = (
  canonicalPageMap: CanonicalPageMap
) => `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${host}</loc>
      </url>

      <url>
        <loc>${host}/</loc>
      </url>

      ${Object.keys(canonicalPageMap)
        .map((canonicalPagePath) =>
          `
            <url>
              <loc>${host}/${canonicalPagePath}</loc>
            </url>
          `.trim()
        )
        .join('')}
    </urlset>
    `

const SiteMapXml: React.FC = () => null

export default SiteMapXml
