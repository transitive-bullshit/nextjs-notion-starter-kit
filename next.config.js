// const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

module.exports = withBundleAnalyzer({
  images: {
    domains: ['pbs.twimg.com']
  },
  future: {
    webpack5: true
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Important: return the modified config
    config.optimization.minimize= false;
    config.optimization.sideEffects = true;
    config.optimization.providedExports = true;
    config.optimization.usedExports = true;
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
      /react-notion-x$/,
      function(resource) {
        console.log("REGEX VALID", resource.request);
        resource.request = resource.request.replace(/react-notion-x/, "lib/react-notion-x-index")
        console.log(resource.request);
      }
    ));
    return config
  },
})
