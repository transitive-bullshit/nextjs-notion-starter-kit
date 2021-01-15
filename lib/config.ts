/**
 * All app config that should be available client-side.
 *
 * @see env.ts for server-side version.
 */

import { getEnv } from './get-env'

export const isDev =
  process.env.NODE_ENV === 'development' || !process.env.NODE_ENV

export const defaultSiteImage = '/social.jpg'
export const defaultSiteFavicon = '/favicon.ico'

export const fathomId = isDev ? null : getEnv('FATHOM_ID', null)

export const fathomConfig = fathomId
  ? {
      excludedDomains: ['localhost', 'localhost:3000']
    }
  : undefined
