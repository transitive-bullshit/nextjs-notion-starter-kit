// eslint-disable-next-line @typescript-eslint/no-var-requires
const withPWA = require('next-pwa')

/** @type {import('next').NextConfig} */
const config = {
  staticPageGenerationTimeout: 300,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false
    }
    return config
  },
  images: {
    domains: [
      'www.notion.so',
      'notion.so',
      'images.unsplash.com',
      'pbs.twimg.com',
      'abs.twimg.com',
      's3.us-west-2.amazonaws.com',
      'anhgerel.ml',
      'transitivebullsh.it'
    ],
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    loader: 'akamai',
    path: '',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  },

  poweredByHeader: false,
  reactStrictMode: true,
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development'
  }
}

module.exports = withPWA(config)
