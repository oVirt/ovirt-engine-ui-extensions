'use strict'

const fs = require('fs')
const path = require('path')
const os = require('os')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin')
const appDirectory = fs.realpathSync(process.cwd())
const appSrc = path.resolve(appDirectory, 'src')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const packageInfo = require('./package.json')
const env = process.env.NODE_ENV || 'development'
const isProd = env === 'production'
const isDev = env === 'development'
const isTest = env === 'test'

const useFakeData = process.env.FAKE_DATA === 'true'

// common modules required by all entry points
const commonModules = ['core-js/stable']

// define specific TTF fonts to embed in CSS via data urls
let ttfFontsToEmbed

// start with common webpack configuration applicable to all environments
const config = module.exports = {
  bail: true,
  mode: 'development', // default
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: [ appSrc ],
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        include: /(node_modules)|(static\/css)/,
        use: isProd ? [
          {
            loader: MiniCssExtractPlugin.loader
          }, 'css-loader?sourceMap'
        ] : ['style-loader', 'css-loader']
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
      'react': path.join(__dirname, 'node_modules', 'react'),
      '_': path.join(__dirname, 'src')
    },
    extensions: ['.js', '.jsx', '*']
  },

  optimization: {},

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

// common build configuration
if (isDev || isProd) {
  config.entry = {
    'plugin': commonModules.concat(['./src/plugin.js']),
    'dashboard': commonModules.concat(['./src/dashboard.js'])
  }

  config.output = {
    filename: '[name].js',
    path: `${__dirname}/dist/ui-extensions-resources`,

    // UI plugin resources are served through Engine
    publicPath: '/ovirt-engine/webadmin/plugin/ui-extensions/'
  }

  config.optimization.splitChunks = {
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/]|^.*\.(css|scss)$/,
        chunks: 'initial',
        name: 'vendor',
        enforce: true
      }
    }
  }

  config.optimization.runtimeChunk = {
    name: 'manifest'
  }

  config.plugins.push(
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      {
        from: 'static/ui-extensions.json',
        to: '../',
        transform (content) {
          return content.toString().replace('"__FAKE_DATA__"', useFakeData)
        }
      }
    ]),
    new HtmlWebpackPlugin({
      filename: 'dashboard.html',
      template: 'static/html/dashboard.template.ejs',
      inject: true,
      chunks: ['vendor', 'dashboard', 'manifest']
    }),
    new HtmlWebpackPlugin({
      filename: 'plugin.html',
      template: 'static/html/plugin.template.ejs',
      inject: true,
      chunks: ['vendor', 'plugin', 'manifest']
    }),
    new InlineManifestWebpackPlugin({
      name: 'manifest'
    }),
    // This pulls all of the depends on modules out of the entry chunks and puts them
    // together here.  Every entry then shares this chunk and it can be cached between
    // them.  The HtmlWebpackPlugins just need to reference it so the script tag is
    // written correctly.  HashedModuleIdsPlugin keeps the chunk id stable as long
    // as the contents of the chunk stay the same (i.e. no new modules are used).
    new webpack.HashedModuleIdsPlugin()
  )
}

// production specific build configuration
if (isProd) {
  config.mode = 'production'
  // emit source map for each generated chunk
  config.devtool = 'source-map'

  // hash the output filenames
  config.output.filename = 'js/[name].[chunkhash:8].js'
  config.output.chunkFilename = 'js/[name].[chunkhash:8].chunk.js'
  config.optimization.minimizer = [
    new TerserPlugin({
      cache: true,
      parallel: true,
      sourceMap: true
    })
  ]
  config.plugins.push(
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css'
    }),
    // emit banner comment at the top of each generated chunk
    new webpack.BannerPlugin({
      banner: `${packageInfo.name} v${packageInfo.version}`
    })
  )
}

// add resonable source maps for dev builds
if (isDev) {
  config.mode = 'development'
  config.devtool = 'eval-source-map'
  config.optimization.minimizer = [
    new TerserPlugin({
      cache: true,
      parallel: os.cpus().length / 2,
      sourceMap: true
    })
  ]
}

// test specific build configuration
if (isTest) {
  config.devtool = 'inline-source-map'
  config.optimization.minimizer = [
    new TerserPlugin({
      sourceMap: true
    })
  ]
}
