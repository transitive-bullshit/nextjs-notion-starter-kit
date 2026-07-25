import * as React from 'react'
import { useNotionContext } from 'react-notion-x'
import { EmbeddedTweet, TweetNotFound, TweetSkeleton } from 'react-tweet'

import type * as types from '@/lib/types'

/**
 * The react-tweet boundary, split out of NotionPage so it can be `dynamic()`d.
 * Very few pages embed a tweet, but a static import put react-tweet (and its
 * styles) in the shared bundle for every Notion page on the site.
 */
export default function NotionTweet({ id }: { id: string }) {
  const { recordMap } = useNotionContext()
  // @wustep: id is a URL with a query string that includes spaceId, like [id]&spaceId=[spaceId]
  const tweetId = id.split('&')[0]
  const tweet = tweetId
    ? (recordMap as types.ExtendedTweetRecordMap)?.tweets?.[tweetId]
    : undefined

  return (
    <React.Suspense fallback={<TweetSkeleton />}>
      {tweet ? <EmbeddedTweet tweet={tweet} /> : <TweetNotFound />}
    </React.Suspense>
  )
}
