// const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV

const withPlugins = require('next-compose-plugins')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

module.exports = withPlugins([[withBundleAnalyzer]], {
  images: {
    domains: ['pbs.twimg.com']
  },
  future: {
    webpack5: true
  },
  webpack: (config, { isServer, dev }) => {
    if (isServer && !dev) {
      const originalEntry = config.entry
      config.entry = async () => {
        const entries = { ...(await originalEntry()) }

        // This script imports components from the Next app, so it's transpiled to `.next/server/scripts/*`
        entries['./scripts/generate-rss'] = './scripts/generate-rss.ts'
        entries['./scripts/generate-sitemap'] = './scripts/generate-sitemap.ts'
        return entries
      }
    }
    return config
  }
})
