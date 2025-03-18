import { type NextApiRequest, type NextApiResponse } from 'next'
import { getTweet } from 'react-tweet/api'

export default async function getTweetHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== 'GET') {
    return res.status(405).send({ error: 'method not allowed' })
  }

  const tweetId = req.query.tweetId as string

  if (!tweetId) {
    return res
      .status(400)
      .send({ error: 'missing required parameter "tweetId"' })
  }

  console.log('getTweet', tweetId)
  const tweet = await getTweet(tweetId)
  console.log('tweet', tweetId, tweet)

  res.status(200).json(tweet)
}
