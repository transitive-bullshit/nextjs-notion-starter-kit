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

  if (process.env.NODE_ENV === 'development') {
    console.log('<<< lambda search-notion', searchParams)
  }
  const results = await search(searchParams)
  if (process.env.NODE_ENV === 'development') {
    console.log('>>> lambda search-notion', {
      query: searchParams?.query,
      total: results?.total
    })
  }

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=60, max-age=60, stale-while-revalidate=300, stale-if-error=86400'
  )
  res.status(200).json(results)
}
