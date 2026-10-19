import { host } from '@/lib/config'

export const dynamic = 'force-dynamic'

export function GET() {
  const body =
    process.env.VERCEL_ENV === 'production'
      ? `User-agent: *
Allow: /
Disallow: /api/get-tweet-ast/*
Disallow: /api/search-notion

Sitemap: ${host}/sitemap.xml
`
      : `User-agent: *
Disallow: /

Sitemap: ${host}/sitemap.xml
`

  return new Response(body, {
    headers: {
      'Cache-Control': 'public, max-age=86400, immutable',
      'Content-Type': 'text/plain'
    }
  })
}
