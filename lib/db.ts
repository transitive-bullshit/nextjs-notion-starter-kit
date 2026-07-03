import Keyv from '@keyvhq/core'
import KeyvRedis from '@keyvhq/redis'

import { isRedisEnabled, redisNamespace, redisUrl } from './config'
import { getErrorMessage } from './utils'

let db: Keyv
if (isRedisEnabled) {
  const keyvRedis = new KeyvRedis(redisUrl!)
  db = new Keyv({ store: keyvRedis, namespace: redisNamespace || undefined })
} else {
  db = new Keyv()
}

export { db }

/**
 * Read from the cache, distinguishing a genuine miss (`ok: true`, no value)
 * from a backend error (`ok: false`). On a read error a caller can't tell
 * whether a good value already exists, so it shouldn't clobber it with a write.
 */
export async function dbGet<T>(
  key: string
): Promise<{ ok: true; value: T | undefined } | { ok: false }> {
  try {
    return { ok: true, value: (await db.get(key)) as T | undefined }
  } catch (err: unknown) {
    console.warn(`cache read error "${key}"`, getErrorMessage(err))
    return { ok: false }
  }
}

/** Write to the cache, swallowing (and logging) backend errors. */
export async function dbSet<T>(key: string, value: T): Promise<void> {
  try {
    await db.set(key, value)
  } catch (err: unknown) {
    console.warn(`cache write error "${key}"`, getErrorMessage(err))
  }
}
