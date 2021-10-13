// Script to generate RSS feed.
// Should only be used in node side.
import fs from 'fs'
import RSS from 'rss'
import { getSiteMaps } from 'lib/get-site-maps'
import { resolveNotionPage } from 'lib/resolve-notion-page'
import { domain, name, rootNotionPageId } from 'lib/config'
import { getPageDescription } from 'lib/get-page-description'
import * as types from 'lib/types'
import { getBlockTitle, getPageProperty } from 'notion-utils'
import { getPagePropertyExtend } from 'lib/get-page-property'

async function generate() {
  const siteMaps = await getSiteMaps()
  const paths = siteMaps.flatMap((siteMap) =>
    Object.keys(siteMap.canonicalPageMap)
  )

  const url = domain.startsWith('http') ? domain : 'https://' + domain

  const feed = new RSS({
    title: name,
    site_url: url,
    feed_url: `${url}/feed.xml`
  })

  await Promise.all(
    paths.map(async (rawPageId) => {
      const { site, recordMap, error, pageId } = (await resolveNotionPage(
        domain,
        rawPageId
      )) as types.PageProps

      const keys = Object.keys(recordMap?.block || {})
      const block = recordMap?.block?.[keys[0]]?.value
      if (rawPageId === rootNotionPageId) {
        return
      }
      //console.log(block)
      const description = getPageDescription(block, recordMap)

      const title = getBlockTitle(block, recordMap) || site.name

      const date =
        getPagePropertyExtend('Created', block, recordMap) || undefined
      const fake_title =
        getPageProperty('SlugName', block, recordMap) || undefined
      console.log('slugName: ', fake_title)

      const item = {
        title,
        guid: rawPageId,
        url: `${url}/${rawPageId}`,
        date,
        description
      }
      console.log(item)

      feed.item(item)
    })
  )

  const rss = feed.xml({ indent: true })
  fs.writeFileSync('./.next/static/feed.xml', rss)

  console.log(`✅ feed.xml generated!`)
}

generate()
