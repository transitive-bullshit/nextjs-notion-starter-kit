import type { GetServerSideProps } from 'next'

import { host } from '@/lib/config'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  if (req.method !== 'GET') {
    res.statusCode = 405
    res.setHeader('Content-Type', 'application/json')
    res.write(JSON.stringify({ error: 'method not allowed' }))
    res.end()

    return {
      props: {}
    }
  }

  // cache for up to one day
  res.setHeader('Cache-Control', 'public, max-age=86400, immutable')
  res.setHeader('Content-Type', 'text/plain')

  // Disable SEO if DISABLE_SEO env var is set, or if not production
  const disableSeo = process.env.DISABLE_SEO === 'true' || process.env.VERCEL_ENV !== 'production'
  
  if (disableSeo) {
    res.write(`User-agent: *
Disallow: /
`)
  } else {
    res.write(`User-agent: *
Allow: /
Disallow: /api/get-tweet-ast/*
Disallow: /api/search-notion

Sitemap: ${host}/sitemap.xml
`)
  }

  res.end()

  return {
    props: {}
  }
}

export default function noop() {
  return null
}
