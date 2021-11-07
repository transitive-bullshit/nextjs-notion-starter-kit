import { NextApiRequest, NextApiResponse } from 'next'

import { SiteMap } from '../lib/types'
import { host, sitemapOnlyPageUrlOverridden } from '../lib/config'
import { getOnlyUrlOverriddenSiteMaps, getSiteMaps } from '../lib/get-site-maps'
import * as config  from '../lib/config'
import * as types from '../lib/types'

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method !== 'GET') {
    return res.status(405).send({ error: 'method not allowed' })
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
  res.write(createSitemap(siteMaps[0]))
  res.end()
}

const createSitemap = (
  siteMap: SiteMap
) => `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${host}</loc>
      </url>

      <url>
        <loc>${host}/</loc>
      </url>

      ${Object.keys(siteMap.canonicalPageMap)
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
