import pMap from 'p-map'

import { getAllPages } from './get-all-pages'
import { getSites } from './get-sites'
import * as types from './types'

export async function getSiteMaps(): Promise<types.SiteMap[]> {
  const sites = await getSites()

  const siteMaps = await pMap(
    sites,
    async (site, index) => {
      try {
        console.log('getSiteMap', index, site)
        return {
          site,
          pageIds: await getAllPages(
            site.rootNotionPageId,
            site.rootNotionSpaceId
          )
        }
      } catch (err) {
        console.warn('site build error', index, site, err)
      }
    },
    {
      concurrency: 4
    }
  )

  return siteMaps.filter(Boolean)
}
