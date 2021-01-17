import * as config from './config'
import * as types from './types'

export const getSiteForDomain = async (
  domain: string
): Promise<types.Site | null> => {
  return {
    domain,
    name: config.siteName,
    rootNotionPageId: config.rootNotionPageId,
    description: config.siteDescription
  } as types.Site
}
