import { getAllPages } from './get-all-pages'
import { getSiteForDomain } from './get-site-for-domain'
import * as config from './config'
import * as types from './types'

export async function getSiteMap({
  concurrency = 4,
  pageConcurrency = 3,
  full = false
}: {
  concurrency?: number
  pageConcurrency?: number
  full?: boolean
} = {}): Promise<types.SiteMap> {
  const site = await getSiteForDomain(config.domain)

  const siteMap = await getAllPages(
    site.rootNotionPageId,
    site.rootNotionSpaceId,
    {
      concurrency,
      pageConcurrency,
      full
    }
  )

  return {
    site,
    ...siteMap
  }
}
