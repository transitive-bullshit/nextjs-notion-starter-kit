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

  async redirects() {
    return [
      {
        source: '/missions-donate',
        destination: 'https://renewalsv.churchcenter.com/giving/to/nathaniel-louis-tisuela-sunnyvale-vbs-2024',
        permanent: true,
      },
      {
        source: '/missions-subscribe',
        destination: 'https://forms.gle/NZvm9Cbooz3NWkqe7',
        permanent: true,
      },
      {
        source: '/alpha-mixers',
        destination: 'https://forms.gle/2CjNd8pRjuCqjRNh6',
        permanent: true,
      },
    ]
  },
})



