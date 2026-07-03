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
        return [tweetId, await getTweet(tweetId)]
      },
      {
        concurrency: 8
      }
    )
  )

  ;(recordMap as ExtendedTweetRecordMap).tweets = tweetsMap
}

async function getTweetImpl(tweetId: string): Promise<any> {
  if (!tweetId) return null

  const cacheKey = `tweet:${tweetId}`

  try {
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
  } catch (err: unknown) {
    console.warn('failed to get tweet', tweetId, getErrorMessage(err))
    return null
  }
}

export const getTweet = pMemoize(getTweetImpl)
