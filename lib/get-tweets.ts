import ExpiryMap from 'expiry-map'
import { type ExtendedRecordMap } from 'notion-types'
import { getPageTweetIds } from 'notion-utils'
import pMap from 'p-map'
import pMemoize from 'p-memoize'
import { getTweet as getTweetData } from 'react-tweet/api'

import type { ExtendedTweetRecordMap } from './types'
import { dbGet, dbSet } from './db'
import { getErrorMessage } from './utils'

/**
 * react-tweet's enrichTweet iterates entities.hashtags, .urls, etc. without
 * guarding against missing arrays — some tweets (e.g. media-only posts) omit them.
 */
function normalizeTweetEntities(
  tweet: Record<string, any> | null | undefined
): Record<string, any> | null | undefined {
  if (!tweet) return tweet

  const entities = tweet.entities ?? {}
  return {
    ...tweet,
    entities: {
      hashtags: entities.hashtags ?? [],
      user_mentions: entities.user_mentions ?? [],
      urls: entities.urls ?? [],
      symbols: entities.symbols ?? [],
      ...(entities.media ? { media: entities.media } : {})
    },
    ...(tweet.quoted_tweet
      ? { quoted_tweet: normalizeTweetEntities(tweet.quoted_tweet) }
      : {})
  }
}

export async function getTweetsMap(
  recordMap: ExtendedRecordMap
): Promise<void> {
  const tweetIds = getPageTweetIds(recordMap)

  const tweetsMap = Object.fromEntries(
    await pMap(
      tweetIds,
      async (tweetId: string) => {
        // Contain per-tweet failures here rather than in getTweetImpl, so a
        // transient error stays uncached (see getTweetImpl) while still not
        // failing the whole page render over one flaky embed.
        try {
          return [tweetId, await getTweet(tweetId)]
        } catch (err: unknown) {
          console.warn('failed to get tweet', tweetId, getErrorMessage(err))
          return [tweetId, null]
        }
      },
      {
        concurrency: 8
      }
    )
  )

  ;(recordMap as ExtendedTweetRecordMap).tweets = tweetsMap
}

/**
 * Fetch a single tweet, or `null` if it is genuinely gone.
 *
 * This deliberately does *not* catch. `react-tweet`'s `getTweet` distinguishes
 * the two failure modes for us, and conflating them is what makes tweet
 * caching brittle:
 *
 * - Deleted / private / 404 → resolves `undefined`. That's a durable fact, so
 *   we normalize it to `null` and cache it (in-process and in Redis) as a
 *   "known missing" hit.
 * - Rate limit, 5xx, network error → throws. That's transient, so we let it
 *   propagate: `pMemoize` never caches a rejection, and we never reach the
 *   `dbSet` below. Previously both paths returned `null`, so a single 429 was
 *   memoized for the life of the process *and* persisted to Redis with no TTL
 *   — permanently blanking an embed that was perfectly fine.
 *
 * `getTweetsMap` is responsible for catching, so one flaky embed can't fail a
 * whole page render.
 */
async function getTweetImpl(tweetId: string): Promise<any> {
  if (!tweetId) return null

  const cacheKey = `tweet:${tweetId}`

  // A cached `null` means "known missing" — keep it as a hit to avoid refetch.
  const cached = await dbGet<Record<string, any> | null>(cacheKey)
  if (cached.ok && (cached.value || cached.value === null)) {
    return normalizeTweetEntities(cached.value)
  }

  const tweetData = normalizeTweetEntities(
    (await getTweetData(tweetId)) || null
  )

  // Only write back when the read succeeded (don't clobber on a read error).
  if (cached.ok) {
    await dbSet(cacheKey, tweetData)
  }

  return tweetData
}

// TTL-bounded so a long-lived server doesn't retain every tweet it has ever
// rendered, and so a "known missing" verdict is eventually re-checked.
const TWEET_CACHE_TTL_MS = 25 * 60 * 1000

export const getTweet = pMemoize(getTweetImpl, {
  cache: new ExpiryMap<string, any>(TWEET_CACHE_TTL_MS)
})
