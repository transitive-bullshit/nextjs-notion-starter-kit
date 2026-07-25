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
 * The cache is an optimization, never a source of truth — so it must never be
 * able to hold up a render. Keyv/Redis surfaces connection *errors*, but a
 * genuinely hung socket just never settles, and these calls sit on the render
 * path (getPreviewImageMap / getTweetsMap → getPage), so one unresponsive
 * Redis could stall ISR for the route's full 60s maxDuration. Bound every
 * call and fall back to treating it as a miss.
 */
const DB_TIMEOUT_MS = 1000

const TIMED_OUT = Symbol('cache-timeout')

function withTimeout<T>(
  operation: Promise<T>,
  label: string
): Promise<T | typeof TIMED_OUT> {
  return Promise.race([
    operation,
    new Promise<typeof TIMED_OUT>((resolve) =>
      setTimeout(() => {
        console.warn(`cache ${label} timed out after ${DB_TIMEOUT_MS}ms`)
        resolve(TIMED_OUT)
      }, DB_TIMEOUT_MS).unref?.()
    )
  ])
}

/**
 * Read from the cache, distinguishing a genuine miss (`ok: true`, no value)
 * from a backend error (`ok: false`). On a read error a caller can't tell
 * whether a good value already exists, so it shouldn't clobber it with a write.
 */
export async function dbGet<T>(
  key: string
): Promise<{ ok: true; value: T | undefined } | { ok: false }> {
  try {
    const value = await withTimeout(db.get(key), `read "${key}"`)
    // A timeout is indistinguishable from a backend error for our purposes:
    // we can't tell whether a good value exists, so report it as not-ok and
    // let the caller skip the write-back rather than clobber.
    if (value === TIMED_OUT) return { ok: false }
    return { ok: true, value: value as T | undefined }
  } catch (err: unknown) {
    console.warn(`cache read error "${key}"`, getErrorMessage(err))
    return { ok: false }
  }
}

/** Write to the cache, swallowing (and logging) backend errors. */
export async function dbSet<T>(key: string, value: T): Promise<void> {
  try {
    await withTimeout(db.set(key, value), `write "${key}"`)
  } catch (err: unknown) {
    console.warn(`cache write error "${key}"`, getErrorMessage(err))
  }
}
