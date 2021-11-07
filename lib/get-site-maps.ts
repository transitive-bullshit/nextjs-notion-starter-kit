import pMap from 'p-map'

import { getAllPages } from './get-all-pages'
import { getSites } from './get-sites'
import * as types from './types'
import * as config from "./config"

export async function getSiteMaps(): Promise<types.SiteMap[]> {
  const sites = await getSites()

  const siteMaps = await pMap(
    sites,
    async (site, index) => {
      try {
        console.log(
          'getSiteMap',
          `${index + 1}/${sites.length}`,
          `(${(((index + 1) / sites.length) * 100) | 0}%)`,
          site
        )

        return {
          site,
          ...(await getAllPages(site.rootNotionPageId, site.rootNotionSpaceId))
        } as types.SiteMap
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

export async function getOnlyUrlOverriddenSiteMaps(): Promise<types.SiteMap[]> {
  return (await getSiteMaps()).map(sm => {
    return {
      ...sm,
      canonicalPageMap: Object.entries(sm.canonicalPageMap).reduce((acc, [cp_name, cp_value]) => {
        if (config.pageUrlOverrides[cp_name]) {
          acc[cp_name] = cp_value
        }
        return acc
      }, {})
    }
  })
}
