import * as config from './env'
import * as types from './types'

export const getSiteForDomain = async (
  domain: string
): Promise<types.Site | null> => {
  return {
    domain,
    name: config.siteName,
    rootNotionPageId: config.notionRootPageId,
    description: config.siteDesc,
    image: config.siteImage
  } as types.Site
}
