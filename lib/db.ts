import Keyv from 'keyv'

import { isRedisEnabled, redisUrl, redisNamespace } from './config'

let db: Keyv
if (isRedisEnabled) {
  db = new Keyv(redisUrl, { namespace: redisNamespace || undefined })
} else {
  db = new Keyv()
}

export { db }
