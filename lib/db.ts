import Keyv from 'keyv'
import KeyvRedis from '@keyv/redis'

import { isRedisEnabled, redisUrl, redisNamespace } from './config'

let db: Keyv
if (isRedisEnabled) {
  const keyvRedis = new KeyvRedis(redisUrl)
  db = new Keyv({ store: keyvRedis, namespace: redisNamespace || undefined })
} else {
  db = new Keyv()
}

export { db }
