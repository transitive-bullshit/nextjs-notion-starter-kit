// Script to generate RSS feed.
// Should only be used in node side.
import fs from 'fs'
import RSS from 'rss'
import { getSiteMaps } from 'lib/get-site-maps'
import { resolveNotionPage } from 'lib/resolve-notion-page'
import { domain, name } from 'lib/config'
import { getPageDescription } from 'lib/get-page-description'
import * as types from 'lib/types'
import { getBlockTitle, getPageProperty } from 'notion-utils'

async function generate() {
  const siteMaps = await getSiteMaps()
  const paths = siteMaps.flatMap((siteMap) =>
    Object.keys(siteMap.canonicalPageMap)
  )

  const feed = new RSS({
    title: name,
    site_url: domain,
    feed_url: `${domain}/feed.xml`
  })

  paths.map(async (rawPageId) => {
    const { site, recordMap, error, pageId } = (await resolveNotionPage(
      domain,
      rawPageId
    )) as types.PageProps

    const keys = Object.keys(recordMap?.block || {})
    const block = recordMap?.block?.[keys[0]]?.value
    const description = getPageDescription(block, recordMap)

    const title = getBlockTitle(block, recordMap) || site.name

    const date = getPageProperty('Created', block, recordMap) || undefined

    feed.item({
      title,
      guid: rawPageId,
      url: `${domain}/${rawPageId}`,
      date,
      description
    })
  })

  const rss = feed.xml({ indent: true })
  fs.writeFileSync('./.next/static/feed.xml', rss)
}

generate()

console.log(`✅ feed.xml generated!`)
