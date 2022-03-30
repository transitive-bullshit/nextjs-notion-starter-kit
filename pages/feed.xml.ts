import { GetServerSideProps } from 'next'
import RSS from 'rss';

import { host, name, description, author } from '../lib/config';
import { getSiteMaps } from '../lib/get-site-maps'
import * as types from 'lib/types'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {

  if (req.method !== 'GET') {
    res.statusCode = 405
    res.setHeader('Content-Type', 'application/json')
    res.write(JSON.stringify({ error: 'method not allowed' }))
    res.end()
    return {
      props: {}
    }
  }

  const siteMaps = await getSiteMaps()

  // cache for up to 8 hours
  res.setHeader(
    'Cache-Control',
    'public, max-age=28800, stale-while-revalidate=28800'
  )
  res.setHeader('Content-Type', 'text/xml')

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
  return {
    props: {}
  }
}

export default () => null
