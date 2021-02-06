import React from 'react'

import { SiteMap } from 'lib/types'
import { host } from 'lib/config'
import { getSiteMaps } from 'lib/get-site-maps'

const createSitemap = (
  siteMap: SiteMap
) => `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${host}</loc>
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

export default class Sitemap extends React.Component {
  static async getInitialProps({ res }) {
    const siteMaps = await getSiteMaps()

    res.setHeader('Content-Type', 'text/xml')
    res.write(createSitemap(siteMaps[0]))
    res.end()
  }
}
