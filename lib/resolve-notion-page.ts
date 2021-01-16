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

    // handle mapping user-friendly canonical page paths to Notion page IDs
    // e.g., /developer-x-entrepreneur versus /71201624b204481f862630ea25ce62fe
    if (!pageId) {
      const siteMaps = await getSiteMaps()
      const siteMap = siteMaps[0]
      console.log(siteMap)
      pageId = siteMap.canonicalPageMap[pageId]?.pageId

      if (!pageId) {
        return {
          error: {
            message: `Invalid notion page ID "${rawPageId}"`,
            statusCode: 404
          }
        }
      }
    }

    if (!pageId) {
      return {
        error: {
          message: `Invalid notion page ID "${rawPageId}"`,
          statusCode: 404
        }
      }
    }

    const resources = await Promise.all([
      getSiteForDomain(domain),
      getPage(pageId)
    ])

    site = resources[0]
    recordMap = resources[1]
  } else {
    site = await getSiteForDomain(domain)
    pageId = site.rootNotionPageId

    console.log(site)
    recordMap = await getPage(pageId)
  }

  const props = { site, recordMap, pageId }
  return { ...props, ...(await acl.pageAcl(props)) }
}
