const path = require('path')
const util = require('util')
const tty = require('tty')
const merge = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const common = require('./webpack.common.js')

// development mode
// @see https://github.com/patternfly/patternfly-react-seed/blob/master/webpack.dev.js
async function dev () {
  let cssToExtract

  const devConfig = merge(await common, {
    mode: 'development',
    devtool: 'eval-source-map',

    module: {
      rules: [
        {
          test: /\.css$/,
          include: cssToExtract = [
            path.resolve(__dirname, 'node_modules')
          ],
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: true
              }
            }
          ]
        },
        {
          test: /\.css$/,
          exclude: cssToExtract,
          use: ['style-loader', 'css-loader']
        }
      ]
    },

    plugins: [
      new MiniCssExtractPlugin({
        filename: 'css/[name].css',
        chunkFilename: 'css/[name].chunk.css'
      })
    ]
  })

  if (!process.env.Q) {
    const colors = tty.isatty(1)
    console.log('development webpack configuration:')
    console.log(util.inspect(devConfig, { compact: false, breakLength: 120, depth: null, colors }))
  }
  return devConfig
}
module.exports = dev()
