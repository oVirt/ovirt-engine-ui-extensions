const path = require('path')
const util = require('util')
const tty = require('tty')
const { merge } = require('webpack-merge')

const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const common = require('./webpack.common.js')

// productions mode
// @see https://github.com/patternfly/patternfly-react-seed/blob/master/webpack.prod.js
async function prod () {
  const prodConfig = merge(await common({
    mode: 'production',
    devtool: 'source-map',
  }), {
    module: {
      rules: [
        {
          test: /\.css$/,
          oneOf: [
            {
              // For prod, extract our css AND vendor css
              include: [
                path.resolve(__dirname, 'src'),
                path.resolve(__dirname, 'static'),
                path.resolve(__dirname, 'node_modules'),
              ],
              use: [
                MiniCssExtractPlugin.loader,
                { loader: 'css-loader', options: { sourceMap: true } },
              ],
            },
            {
              use: ['style-loader', 'css-loader'],
            },
          ],
        },
      ],
    },

    output: {
      filename: 'js/[name].[chunkhash:8].js',
      chunkFilename: 'js/[name].[chunkhash:8].chunk.js',
    },

    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({ // minify JS with source maps (via value of `devtool`)
          parallel: true,
          terserOptions: {
            keep_classnames: true,
            keep_fnames: true,
            format: {
              comments: /@buildinfo/i, // keep our build info banner comment in the JS
            },
          },
          extractComments: 'some',
        }),
        new CssMinimizerPlugin({ // minify CSS with source maps (via value of `devtool`)
          include: [
            path.resolve(__dirname, 'src'),
            path.resolve(__dirname, 'static'),
          ],
        }),
      ],
    },

    plugins: [
      new MiniCssExtractPlugin({
        ignoreOrder: true,
        filename: 'css/[name].[contenthash:8].css',
        chunkFilename: 'css/[name].[contenthash:8].chunk.css',
      }),
    ],
  })

  if (!process.env.Q) {
    const colors = tty.isatty(1)
    console.log('production webpack configuration:')
    console.log(util.inspect(prodConfig, { compact: false, breakLength: 120, depth: null, colors }))
  }
  return prodConfig
}
module.exports = prod()
