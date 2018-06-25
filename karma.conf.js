'use strict'

const webpackConfig = require('./webpack.config')

// TODO(sd): https://github.com/webpack-contrib/karma-webpack/issues/291
//           Sticking to karma-webpack =2.0.6 for now until that issue is resolved
//           and dynamic imports of webpack chunks from code splitting works again.

module.exports = function (config) {
  config.set({
    browsers: ['PhantomJS'],
    frameworks: ['mocha'],
    files: [
      './node_modules/babel-polyfill/dist/polyfill.js',
      './src/test-index.js'
    ],
    preprocessors: {
      'src/test-index.js': ['webpack', 'sourcemap']
    },
    reporters: ['mocha'],
    logLevel: config.LOG_INFO,
    webpack: webpackConfig
  })
}
