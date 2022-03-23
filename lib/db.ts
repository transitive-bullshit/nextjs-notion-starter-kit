import Keyv from 'keyv'

import {
  isPreviewImageSupportEnabled,
  redisUrl,
  redisNamespace
} from './config'

let db: Keyv
if (isPreviewImageSupportEnabled) {
  db = new Keyv(redisUrl, { namespace: redisNamespace || undefined })
}

export { db }
