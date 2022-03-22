// const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

module.exports = withBundleAnalyzer({
  reactStrictMode: false,
  images: {
    domains: ['pbs.twimg.com'],
    loader: 'akamai',
    path: '/'
  }
})
