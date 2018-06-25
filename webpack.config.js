'use strict'

const webpack = require('webpack')
const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin')

const packageInfo = require('./package.json')
const env = process.env.NODE_ENV || 'development'
const isProd = env === 'production'
const isDev = env === 'development'
const isTest = env === 'test'

// define specific TTF fonts to embed in CSS via data urls
let ttfFontsToEmbed

// start with common webpack configuration applicable to all environments
const config = module.exports = {
  bail: true,

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)|(zanata)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['env', {
                targets: {
                  browsers: [ 'last 2 versions', 'not ie < 11', 'firefox esr' ]
                },
                debug: false
              }],
              'react'
            ],
            plugins: ['transform-object-rest-spread']
          }
        }
      },
      {
        test: /\.css$/,
        include: /(node_modules)|(static\/css)/,
        use: isProd
          ? ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader?sourceMap' })
          : [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.css$/,
        exclude: /(node_modules)|(static\/css)/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },

      // inline base64 URLs for <= 8k images, direct URLs for the rest
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        loader: 'url-loader',
        query: {
          limit: 8192,
          name: 'media/[name].[hash:8].[ext]'
        }
      },

      // embed the woff2 fonts directly in the CSS
      {
        test: /\.woff2(\?v=[0-9].[0-9].[0-9])?$/,
        loader: 'url-loader'
      },
      // PF icon font uses ttf, no woff2 is currently available
      {
        test: ttfFontsToEmbed = /PatternFlyIcons-webfont\.ttf/,
        loader: 'url-loader'
      },
      {
        test: /\.(ttf|eot|svg|woff(?!2))(\?v=[0-9].[0-9].[0-9])?$/,
        exclude: ttfFontsToEmbed,
        loader: 'file-loader?name=fonts/[name].[hash:8].[ext]'
      }
    ]
  },

  resolve: {
    alias: {
      // prevent multiple reacts loaded from various dependencies
      'react': path.join(__dirname, 'node_modules', 'react')
    },
    extensions: ['.js', '.jsx', '.json', '*']
  },

  plugins: [
    new webpack.ProvidePlugin({
      // Bootstrap's JavaScript implicitly requires jQuery global
      jQuery: 'jquery'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(env)
      },
      '__DEV__': JSON.stringify(isDev)
    })
  ]
}

// common development and production build configuration
if (isDev || isProd) {
  config.entry = {
    'plugin': ['babel-polyfill', './src/plugin.js'],
    'main-tab': ['babel-polyfill', './src/main-tab.jsx']
  }
  config.output = {
    filename: '[name].js',
    path: `${__dirname}/dist/dashboard-resources`,

    // an absolute path is necessary to properly rewrite css url paths
    publicPath: '/ovirt-engine/webadmin/plugin/dashboard/'
  }

  config.plugins.push(
    new CleanWebpackPlugin(['dist', 'extra']),
    new CopyWebpackPlugin([
      { from: 'static/dashboard.json', to: '../' }
    ]),
    new InlineManifestWebpackPlugin({
      name: 'webpackManifest'
    }),
    new HtmlWebpackPlugin({
      filename: 'main-tab.html',
      template: 'static/html/main-tab.template.ejs',
      inject: true,
      chunks: ['vendor', 'main-tab']
    }),
    new HtmlWebpackPlugin({
      filename: 'plugin.html',
      template: 'static/html/plugin.template.ejs',
      inject: true,
      chunks: ['vendor', 'plugin']
    }),

    // This pulls all of the depends on modules out of the entry chunks and puts them
    // together here.  Every entry then shares this chunk and it can be cached between
    // them.  The HtmlWebpackPlugins just need to reference it so the script tag is
    // written correctly.  HashedModuleIdsPlugin keeps the chunk id stable as long
    // as the contents of the chunk stay the same (i.e. no new modules are used).
    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module) {
        // This test keeps stylesheet resources (.css or .scss) the app imports from a
        // modules in the app's CSS chunk.  Otherwise they'd be moved to a vendor CSS.
        if (module.resource && (/^.*\.(css|scss)$/).test(module.resource)) {
          return false
        }

        return module.context && module.context.includes('node_modules')
      }
    }),

    // Put webpack's runtime and manifest in its own chunk to keep the 'vendor'
    // chunk more stable (and cacheable across builds).  A change to any entry point
    // chunk or to the vendor chunk will also cause this chunk to change.
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest'
    })
  )
}

// production specific build configuration
if (isProd) {
  // emit source map for each generated chunk
  config.devtool = 'source-map'

  // hash the output filenames
  config.output.filename = 'js/[name].[chunkhash:8].js'
  config.output.chunkFilename = 'js/[name].[chunkhash:8].chunk.js'

  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false // suppress warnings when dropping unreachable code, unused declarations etc.
      }
    }),
    new ExtractTextPlugin({
      filename: 'css/[name].[contenthash:8].css',
      allChunks: true
    }),
    // emit banner comment at the top of each generated chunk
    new webpack.BannerPlugin({
      banner: `${packageInfo.name} v${packageInfo.version}`
    })
  )
}

// test specific build configuration (via karma)
if (isTest) {
  // inline source map into generated JavaScript
  config.devtool = 'inline-source-map'
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({ // needed to have error stack traces with proper files/line numbers
      sourceMap: true
    })
  )
}
