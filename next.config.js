// const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV
const { v4 } = require('uuid');
const crypto = require('crypto');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

module.exports = withBundleAnalyzer({
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
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Important: return the modified config
    config.optimization.sideEffects = true;
    config.optimization.providedExports = true;
    config.optimization.usedExports = true;
    config.resolve.modules = require("./package.json")._moduleDirectories || {}
    // config.plugins.push(
    //   new webpack.NormalModuleReplacementPlugin(
    //   /react-notion-x$/,
    //   function(resource) {
    //     resource.request = resource.request.replace(/react-notion-x/, "lib/react-notion-x-index")
    //   }
    // ));
    // config.plugins.push(
    //   new webpack.NormalModuleReplacementPlugin(
    //   /react-notion-x\/$/,
    //   function(resource) {
    //     resource.request = resource.request.replace(/react-notion-x/, "lib/react-notion-x-index")
    //   }
    // ));
    return config
  },
})
