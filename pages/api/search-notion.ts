import { type NextApiRequest, type NextApiResponse } from 'next'

import type * as types from '../../lib/types'
import { search } from '../../lib/notion'

export default async function searchNotion(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).send({ error: 'method not allowed' })
  }

  const searchParams: types.SearchParams = req.body

  const results = await search(searchParams)

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=300, max-age=60, stale-while-revalidate=3600'
  )
  res.status(200).json(results)
}
