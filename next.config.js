// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

module.exports = withBundleAnalyzer({
  staticPageGenerationTimeout: 300,
  images: {
    domains: [
      'www.notion.so',
      'notion.so',
      'images.unsplash.com',
      'pbs.twimg.com',
      'abs.twimg.com',
      's3.us-west-2.amazonaws.com',
      'transitivebullsh.it'
    ],
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  },
  basePath: '/blog',
  async redirects() {
    const sources = ['/', '/:path']
    return sources.map((s) => ({
      source: s,
      destination: `${process.env.ROOT_URL || 'https://bask.health'}/blog${
        s === '/' ? '' : s
      }`,
      has: [
        {
          type: 'host',
          value: process.env.REDIRECT_DOMAIN || 'bask.blog'
        },
        { type: 'host', value: 'blog.bask.health' },
        { type: 'host', value: 'blog.bask.bio' }
      ],
      statusCode: 302,
      basePath: false
    }))
  }
})
