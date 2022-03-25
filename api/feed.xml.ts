import { NextApiRequest, NextApiResponse } from 'next';
import RSS from 'rss';

import { host, name, description, author } from '../lib/config';
import { getSiteMaps } from '../lib/get-site-maps'
import * as types from 'lib/types'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  // Only allow GET requests.
  if (req.method !== 'GET') {
    return res.status(405).send({ error: 'method not allowed' })
  }

  // cache sitemap for up to one hour
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=3600, max-age=3600, stale-while-revalidate=3600'
  )
  res.setHeader('Content-Type', 'text/xml')
  const siteMaps = await getSiteMaps()
  const feed = new RSS({
    title: name,
    site_url: host,
    feed_url: `${host}/feed.xml`,
    description,
    copyright: `${new Date().getFullYear()} ${author}`,
    webMaster: author,
  })

  siteMaps.forEach((siteMap: types.SiteMap) => {
    // For each siteMap, add all the posts to the feed.
    const pageMap = siteMap.canonicalPageMap
    Object.keys(pageMap).map(pageURL => {
      const pageData = pageMap[pageURL] as types.CanonicalPageData
      feed.item({
        title: pageData.title,
        // description: pageData.description,
        url: `${host}/${pageURL}`,
        guid: pageData.pageID,
        date: pageData.createdTime,
        author,
      })
    })
  })

  res.write(feed.xml({ indent: true }))
  res.end()
}
