// const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV

const withPlugins = require('next-compose-plugins')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

module.exports = withPlugins([[withBundleAnalyzer]], {
  images: {
    domains: ['pbs.twimg.com']
  },
})
