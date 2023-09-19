import { NextApiRequest, NextApiResponse } from 'next'

import * as types from '../../lib/types'
import { search } from '../../lib/notion'

// export const config = {
//   runtime: 'experimental-edge'
// }

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST' && req.method !== 'FETCH') {
    return res.status(405).send({ error: 'method not allowed' })
  }
  if (req.method === 'FETCH') {
    return res.status(200).send({ message: 'fetch' })
  }

  const searchParams: types.SearchParams = req.body

  console.log('<<< lambda search-notion', searchParams)
  try {
    const results = await search(searchParams)

    console.log('>>> lambda search-notion', results)

    res.setHeader(
      'Cache-Control',
      'public, s-maxage=60, max-age=60, stale-while-revalidate=60'
    )
    res.status(200).json(results)
  } catch (err) {
    console.log('>>> lambda search-notion error', err)
    res.status(500).json({ error: err.message })
  }
}
