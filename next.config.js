const withPlugins = require('next-compose-plugins')
// const withTM = require('next-transpile-modules')([
//   'react-notion-x',
//   'notion-client',
//   'notion-utils',
//   'notion-types'
// ])
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

module.exports = withPlugins([withBundleAnalyzer], {
  staticPageGenerationTimeout: 300,
  images: {
    domains: [
      'www.notion.so',
      'notion.so',
      'images.unsplash.com',
      'pbs.twimg.com'
    ],
    formats: ['image/avif', 'image/webp']
  }
})
