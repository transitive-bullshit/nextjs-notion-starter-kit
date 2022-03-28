import pMap from 'p-map'

import { getAllPages } from './get-all-pages'
import { getSites } from './get-sites'
import * as types from './types'

export async function getSiteMaps(): Promise<types.SiteMap[]> {
  const sites = await getSites()

  const siteMaps = await pMap(
    sites,
    async (site) => {
      try {
        return {
          site,
          ...(await getAllPages(site.rootNotionPageId, site.rootNotionSpaceId))
        } as types.SiteMap
        // eslint-disable-next-line no-empty
      } catch (err) {}
    },
    {
      concurrency: 4
    }
  )

  return siteMaps.filter(Boolean)
}
