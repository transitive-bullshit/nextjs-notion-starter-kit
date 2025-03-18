import type { ExtendedRecordMap } from 'notion-types'
import pMap from 'p-map'
import { getTweet } from 'react-tweet/api'

export async function getTweetAstMap(recordMap: ExtendedRecordMap) {
  const blockIds = Object.keys(recordMap.block)
  const tweetIds: string[] = blockIds
    .map((blockId) => {
      const block = recordMap.block[blockId]?.value

      if (block) {
        if (block.type === 'tweet') {
          const src = block.properties?.source?.[0]?.[0]

          if (src) {
            const id = src.split('?')[0].split('/').pop()
            if (id) return id
          }
        }
      }

      return null
    })
    .filter(Boolean)

  const tweetData = await pMap(
    tweetIds,
    async (tweetId) => {
      try {
        return {
          tweetId,
          tweet: await getTweet(tweetId)
        }
      } catch (err) {
        console.error('error fetching tweet info', tweetId, err)
      }
    },
    {
      concurrency: 4
    }
  )

  const tweetMap = tweetData.reduce((acc, item) => {
    if (item?.tweet) {
      return {
        ...acc,
        [item.tweetId]: item.tweet
      }
    } else {
      return acc
    }
  }, {})

  return tweetMap
}
