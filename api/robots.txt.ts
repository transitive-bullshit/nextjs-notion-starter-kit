import { NextApiRequest, NextApiResponse } from 'next'

import { host } from '../lib/config'

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method !== 'GET') {
    return res.status(405).send({ error: 'method not allowed' })
  }

  // cache robots.txt for up to 60 seconds
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=60, max-age=60, stale-while-revalidate=60'
  )
  res.setHeader('Content-Type', 'text/plain')
  res.write(`User-agent: *
Sitemap: ${host}/api/sitemap.xml
`)
  res.end()
}
