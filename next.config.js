// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})
const withPWA = require('next-pwa')

/** @type {import('next').NextConfig} */
const config = {
  staticPageGenerationTimeout: 300,
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
    disable: process.env.NODE_ENV !== 'production',
    register: false
  }
}

module.exports = withPWA(withBundleAnalyzer(config))
