import { createAiCatalog } from '../../../lib/ai-catalog'
import * as config from '../../../lib/config'

export const revalidate = 86_400

export function GET() {
  const catalog = createAiCatalog({
    authorName: config.author,
    domain: config.domain,
    siteName: config.name,
    siteUrl: config.host
  })

  return Response.json(catalog, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control':
        'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
      'Content-Type': 'application/json; charset=utf-8'
    }
  })
}
