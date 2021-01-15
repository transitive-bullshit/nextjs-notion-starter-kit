import { NextApiRequest, NextApiResponse } from 'next'

import got from 'got'
import pMap from 'p-map'

import * as types from '../../lib/types'
import * as db from '../../lib/db'
import { getAllPages } from 'lib/get-all-pages'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).send({ error: 'method not allowed' })
  }

  const { siteId, concurrency = 8 } = req.body

  const doc = db.sites.doc(siteId)
  const site = await db.get<types.Site>(doc)
  const pages = await getAllPages(site.rootNotionPageId, site.rootNotionSpaceId)

  await pMap(
    pages,
    async (pageId) => {
      try {
        const url = `https://renderer.notionx.so/${site.domain}/${pageId}`
        console.log('preload', url)
        await got(url)
      } catch (err) {
        console.error('page preload error', site.domain, pageId, err)
      }
    },
    {
      concurrency
    }
  )

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=60, max-age=60, stale-while-revalidate=60'
  )

  res.status(200).json({
    site,
    numPages: pages.length
  })
}
