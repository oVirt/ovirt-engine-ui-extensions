const path = require('path')
const util = require('util')
const tty = require('tty')
const merge = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const common = require('./webpack.common.js')

// development mode
// @see https://github.com/patternfly/patternfly-react-seed/blob/master/webpack.dev.js
async function dev () {
  const devConfig = merge(await common, {
    mode: 'development',
    devtool: 'source-map', // 'eval-source-map' doesn't give us much in our usecase

    module: {
      rules: [
        {
          test: /\.css$/,
          oneOf: [
            {
              // We import @patternfly/patternfly/patternfly-no-reset.css in all
              // entry points.  It includes ALL of the css necessary for ALL PF4
              // components.   We do not need to import any PF4 component only style
              // sheets.  This null-loader will make sure those css files are excluded.
              test: /@patternfly\/react-styles\/css/,
              use: 'null-loader',
            },
            {
              // For dev, ONLY extract vendor css
              include: [
                path.resolve(__dirname, 'node_modules'),
              ],
              use: [
                MiniCssExtractPlugin.loader,
                {
                  loader: 'css-loader',
                  options: {
                    sourceMap: true,
                  },
                },
              ],
            },
            {
              use: ['style-loader', 'css-loader'],
            },
          ],
        },
      ],
    },

    plugins: [
      new MiniCssExtractPlugin({
        filename: 'css/[name].css',
        chunkFilename: 'css/[name].chunk.css',
      }),
    ],
  })

  if (!process.env.Q) {
    const colors = tty.isatty(1)
    console.log('development webpack configuration:')
    console.log(util.inspect(devConfig, { compact: false, breakLength: 120, depth: null, colors }))
  }
  return devConfig
}
module.exports = dev()
