// const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV
const { v4 } = require('uuid');
const crypto = require('crypto');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

module.exports = withBundleAnalyzer(({
  serverRuntimeConfig:{
  nonceGenerator: () => {
    const hash = crypto.createHash('sha256');
    hash.update(v4());
    return hash.digest('base64');
  }},
  images: {
    domains: ['pbs.twimg.com']
  },
  future: {
    webpack5: true
  },
  compress:true,
  headers: async () => {
    return [
      {
        source: '/',
        headers: [
          {
            key: 'x-robots-tag',
            value: 'all',
          },
          {
            key: 'x-frame-options',
            value: 'sameorigin',
          },
        ],
      },
    ]
  }

}))
