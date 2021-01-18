import * as acl from './acl'
import * as types from './types'
import { parsePageId } from 'notion-utils'
import { getPage } from './notion'
import { getSiteMaps } from './get-site-maps'
import { getSiteForDomain } from './get-site-for-domain'

export async function resolveNotionPage(domain: string, rawPageId?: string) {
  let site: types.Site
  let pageId: string
  let recordMap: types.ExtendedRecordMap

  if (rawPageId && rawPageId !== 'index') {
    pageId = parsePageId(rawPageId)

    if (pageId) {
      const resources = await Promise.all([
        getSiteForDomain(domain),
        getPage(pageId)
      ])

      site = resources[0]
      recordMap = resources[1]
    } else {
      // handle mapping of user-friendly canonical page paths to Notion page IDs
      // e.g., /developer-x-entrepreneur versus /71201624b204481f862630ea25ce62fe
      const siteMaps = await getSiteMaps()
      const siteMap = siteMaps[0]
      pageId = siteMap.canonicalPageMap[rawPageId]

      if (pageId) {
        site = await getSiteForDomain(domain)
        recordMap = siteMap.pageMap[pageId]

        // TODO: we can't re-use the recordMap because our wrapper adds
        // additional preview_images data to the recordMap...
        // const resources = await Promise.all([
        //   getSiteForDomain(domain),
        //   getPage(pageId)
        // ])
      } else {
        return {
          error: {
            message: `Not found "${rawPageId}"`,
            statusCode: 404
          }
        }
      }
    }
  } else {
    site = await getSiteForDomain(domain)
    pageId = site.rootNotionPageId

    console.log(site)
    recordMap = await getPage(pageId)
  }

  const props = { site, recordMap, pageId }
  return { ...props, ...(await acl.pageAcl(props)) }
}
