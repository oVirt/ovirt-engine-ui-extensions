const path = require('path')

const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin')

const env = process.env.NODE_ENV || 'development'
const useFakeData = process.env.FAKE_DATA === 'true'
const packageInfo = require('./package.json')
const fetchGitInfo = require('./webpack.gitinfo.js')

// common modules required by all entry points, typically polyfills
//   NOTE: With @babel/preset-env in usage mode and webpack packing, they will take care
//         of any polyfills needed that derive from `core-js/stable`.  Only include
//         polyfills in the list that are NOT from `core-js/stable`.
const commonModules = []

// common webpack configuration applicable to all environments
// @see: https://github.com/patternfly/patternfly-react-seed/blob/master/webpack.common.js
async function common () {
  const gitInfo = await fetchGitInfo()
  const rpmInfo = process.env.RPM_PACKAGE_NAME && {
    packageName: process.env.RPM_PACKAGE_NAME,
    packageVersion: process.env.RPM_PACKAGE_VERSION,
    packageRelease: process.env.RPM_PACKAGE_RELEASE,
  }

  const banner =
    `${packageInfo.name} v${packageInfo.version}` +
    (rpmInfo ? ` [rpm ${rpmInfo.packageName}-${rpmInfo.packageVersion}-${rpmInfo.packageRelease}]` : '') +
    (gitInfo ? ` [git ${gitInfo.headOid}, change-id: ${gitInfo.changeId}, tags: ${gitInfo.headTags}]` : '') +
    (gitInfo && gitInfo.hasChanges ? ` ${JSON.stringify(gitInfo)}` : '')

  // define specific fonts to embed in CSS via data urls
  let fontsToEmbed

  const commonConfig = {
    bail: true,

    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          include: path.resolve(__dirname, 'src'),
          use: {
            loader: 'babel-loader', // options from __.babelrc.js__
          },
        },

        // inline base64 URLs for <= 8k images, direct URLs for the rest
        {
          test: /\.(png|jpg|jpeg|gif)$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'media/[name].[hash:8].[ext]',
            },
          },
        },

        // embed the woff2 fonts and any fonts that are used by the PF icons
        // directly in the CSS (to avoid lag applying fonts), export the rest
        // to be loaded seperately as needed
        {
          test: fontsToEmbed = [
            /\.woff2(\?v=[0-9].[0-9].[0-9])?$/,
            /PatternFlyIcons-webfont\.ttf/,
          ],
          use: {
            loader: 'url-loader',
            options: {},
          },
        },
        {
          test: /\.(ttf|eot|svg|woff(?!2))(\?v=[0-9].[0-9].[0-9])?$/,
          exclude: fontsToEmbed,
          use: {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[hash:8].[ext]',
            },
          },
        },
      ],
    },

    entry: {
      'plugin': [...commonModules, './src/plugin.js'],
      'dashboard': [...commonModules, './src/dashboard.js'],
    },

    resolve: {
      alias: {
        '_': path.join(__dirname, 'src'),
      },
      extensions: ['.js', '.jsx', '*'],
    },

    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist/ui-extensions-resources'),

      // UI plugin resources are served through Engine
      publicPath: '/ovirt-engine/webadmin/plugin/ui-extensions/',
    },

    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            name: 'vendor',
            chunks: 'initial',
            test: /[\\/]node_modules[\\/]/,
          },
        },
      },
      runtimeChunk: { name: 'webpack-manifest' },
    },

    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(env),
        },
        '__DEV__': JSON.stringify(env === 'development'),
      }),

      new CleanWebpackPlugin({
        verbose: false,
      }),
      new CopyWebpackPlugin([
        {
          from: 'static/ui-extensions.json',
          to: '../',
          transform: (content) => content.toString().replace('"__FAKE_DATA__"', useFakeData),
        },
      ]),

      new HtmlWebpackPlugin({
        filename: 'plugin.html',
        template: 'static/html/plugin.template.ejs',
        extraParams: { gitInfo, rpmInfo },
        inject: true,
        chunks: ['webpack-manifest', 'vendor', 'plugin'],
      }),
      new HtmlWebpackPlugin({
        filename: 'dashboard.html',
        template: 'static/html/dashboard.template.ejs',
        extraParams: { gitInfo, rpmInfo },
        inject: true,
        chunks: ['webpack-manifest', 'vendor', 'dashboard'],
      }),
      new InlineManifestWebpackPlugin('webpack-manifest'),

      // This pulls all of the depends on modules out of the entry chunks and puts them
      // together here.  Every entry then shares this chunk and it can be cached between
      // them.  The HtmlWebpackPlugins just need to reference it so the script tag is
      // written correctly.  HashedModuleIdsPlugin keeps the chunk id stable as long
      // as the contents of the chunk stay the same (i.e. no new modules are used).
      new webpack.HashedModuleIdsPlugin(),

      // emit banner comment at the top of each generated chunk
      new webpack.BannerPlugin({ banner }),
    ],
  }

  return commonConfig
}
module.exports = common()
