import path from 'node:path'
import { fileURLToPath } from 'node:url'

import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  // eslint-disable-next-line no-process-env
  enabled: process.env.ANALYZE === 'true'
})

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default withBundleAnalyzer({
  staticPageGenerationTimeout: 300,
  experimental: {
    // Notion's public API is rate-limited. Keep each route's static paths in a
    // single batch and render one at a time after the index crawl completes.
    staticGenerationMaxConcurrency: 1,
    staticGenerationMinPagesPerWorker: 100
  },
  turbopack: {
    root: dirname
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.notion.so' },
      { protocol: 'https', hostname: 'notion.so' },
      { protocol: 'https', hostname: 'file.notion.com' },
      { protocol: 'https', hostname: 'file.notion.so' },
      { protocol: 'https', hostname: 'img.notionusercontent.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'abs.twimg.com' },
      { protocol: 'https', hostname: 'pbs.twimg.com' },
      { protocol: 'https', hostname: 's3.us-west-2.amazonaws.com' }
    ],
    // Keep optimized copies around after Notion file URLs expire (~1h).
    minimumCacheTTL: 60 * 60 * 24,
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  },
  redirects: async () => {
    return [
      {
        source: '/about',
        destination: '/',
        permanent: true
      },
      {
        source: '/contact',
        destination:
          'https://wustep.notion.site/1425cb08cf2c80cc89d4f322774aa02b',
        permanent: true
      },
      {
        source: '/articles/:slug',
        destination: '/:slug',
        permanent: true
      },
      {
        source: '/projects/:slug',
        destination: '/:slug',
        permanent: true
      },
      {
        source: '/notes/:slug',
        destination: '/:slug',
        permanent: true
      }
    ]
  },
  headers: async () => {
    return [
      {
        source: '/giscus/:path',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://giscus.app' }
        ]
      }
    ]
  },
  rewrites: async () => {
    return [
      {
        source: '/feed.xml',
        destination: '/feed'
      },
      {
        source: '/feeds',
        destination: '/feed'
      },
      {
        source: '/feeds.xml',
        destination: '/feed'
      },
      {
        source: '/rss',
        destination: '/feed'
      },
      {
        source: '/rss.xml',
        destination: '/feed'
      }
    ]
  },
  webpack: (config) => {
    // Workaround for ensuring that `react` and `react-dom` resolve correctly
    // when using a locally-linked version of `react-notion-x`.
    // @see https://github.com/vercel/next.js/issues/50391
    config.resolve.alias.react = path.resolve(dirname, 'node_modules/react')
    config.resolve.alias['react-dom'] = path.resolve(
      dirname,
      'node_modules/react-dom'
    )
    return config
  },
  // See https://react-tweet.vercel.app/next#troubleshooting
  transpilePackages: ['react-tweet']
})
