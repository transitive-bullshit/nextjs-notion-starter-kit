import * as config from './config'
import * as types from './types'

export const getSiteForDomain = async (
  domain: string
): Promise<types.Site | null> => {
  return {
    domain,
    name: config.name,
    rootNotionPageId: config.rootNotionPageId,
    description: config.description
  } as types.Site
}
