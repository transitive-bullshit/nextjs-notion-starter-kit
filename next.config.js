// import path from 'node:path'
// import { fileURLToPath } from 'node:url'

export default {
  staticPageGenerationTimeout: 300,
  images: {
    remotePatterns: [
      { hostname: 'www.notion.so' },
      { hostname: 'notion.so' },
      { hostname: 'images.unsplash.com' },
      { hostname: 'pbs.twimg.com' },
      { hostname: 'abs.twimg.com' },
      { hostname: 's3.us-west-2.amazonaws.com' },
      { hostname: 'transitivebullsh.it' }
    ],
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  },

  // webpack: (config) => {
  //   // Workaround for ensuring that `react` and `react-dom` resolve correctly
  //   // when using a locally-linked version of `react-notion-x`.
  //   // @see https://github.com/vercel/next.js/issues/50391
  //   const dirname = path.dirname(fileURLToPath(import.meta.url))
  //   config.resolve.alias.react = path.resolve(dirname, 'node_modules/react')
  //   config.resolve.alias['react-dom'] = path.resolve(
  //     dirname,
  //     'node_modules/react-dom'
  //   )
  //   return config
  // },

  // See https://react-tweet.vercel.app/next#troubleshooting
  transpilePackages: ['react-tweet']
}
