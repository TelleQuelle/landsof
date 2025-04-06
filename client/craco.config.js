// client/craco.config.js
const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Добавляем полифиллы для Node.js модулей
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "zlib": require.resolve("browserify-zlib"),
        "url": require.resolve("url/"),
        "assert": require.resolve("assert/"),
        "buffer": require.resolve("buffer/"),
        "process": require.resolve("process/browser"),
        "util": require.resolve("util/"),
        "path": require.resolve("path-browserify"),
        "fs": false,
        "os": require.resolve("os-browserify/browser")
      };

      // Добавляем необходимые плагины
      const webpack = require('webpack');
      webpackConfig.plugins.push(
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer'],
        })
      );

      return webpackConfig;
    },
  },
};