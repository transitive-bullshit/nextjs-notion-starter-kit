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
    const hosts = [
      process.env.REDIRECT_DOMAIN,
      'bask.blog',
      'blog.bask.health',
      'blog.bask.bio'
    ].filter(Boolean)

    return sources.flatMap((s) =>
      hosts.map((host) => ({
        source: s,
        destination: `${process.env.ROOT_URL || 'https://bask.health'}/blog${
          s === '/' ? '' : s
        }`,
        has: [{ type: 'host', value: host }],
        statusCode: 302,
        basePath: false
      }))
    )
  }
})
