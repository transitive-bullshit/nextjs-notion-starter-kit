import { getSiteForDomain } from './get-site-for-domain'
import * as config from './config'
import * as types from './types'

export async function getSites(): Promise<types.Site[]> {
  return [await getSiteForDomain(config.domain)]
}
