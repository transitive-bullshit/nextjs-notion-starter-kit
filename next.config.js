import withBundleAnalyzer from '@next/bundle-analyzer'

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
})({
  staticPageGenerationTimeout: 300,
  images: {
    domains: [
      'www.notion.so',
      'notion.so',
      'images.unsplash.com',
      'pbs.twimg.com',
      'abs.twimg.com'
    ],
    formats: ['image/avif', 'image/webp']
  }
})
