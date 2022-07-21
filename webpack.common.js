const path = require('path')

const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const env = process.env.NODE_ENV || 'development'
const useFakeData = process.env.FAKE_DATA === 'true'
const packageInfo = require('./package.json')
const fetchGitInfo = require('./webpack.gitinfo.js')

// common modules required by all entry points, typically polyfills
//   NOTE: With @babel/preset-env in usage mode and webpack packing, they will take care
//         of any polyfills needed that derive from `core-js/stable`.  Only include
//         polyfills in the list that are NOT from `core-js/stable`.
const commonModules = []

// base Patternfly 4 package locations that hold fonts
// @see: https://github.com/patternfly/patternfly-react-seed/blob/master/webpack.common.js
const patternflyFontPaths = [
  path.resolve(__dirname, 'node_modules/patternfly/dist/fonts'),
  path.resolve(__dirname, 'node_modules/@patternfly/react-core/dist/styles/assets/fonts'),
  path.resolve(__dirname, 'node_modules/@patternfly/react-core/dist/styles/assets/pficon'),
  path.resolve(__dirname, 'node_modules/@patternfly/patternfly/assets/fonts'),
  path.resolve(__dirname, 'node_modules/@patternfly/patternfly/assets/pficon'),
]

// common webpack configuration applicable to all environments
// @see: https://github.com/patternfly/patternfly-react-seed/blob/master/webpack.common.js
async function common ({ mode, devtool }) {
  const gitInfo = await fetchGitInfo()
  const rpmInfo = process.env.RPM_PACKAGE_NAME && {
    packageName: process.env.RPM_PACKAGE_NAME,
    packageVersion: process.env.RPM_PACKAGE_VERSION,
    packageRelease: process.env.RPM_PACKAGE_RELEASE,
  }
  const banner = `/* @buildinfo [file]: ${[
    `${packageInfo.name} v${packageInfo.version}`,
    rpmInfo && `[rpm ${rpmInfo.packageName}-${rpmInfo.packageVersion}-${rpmInfo.packageRelease}]`,
    gitInfo && `[git ${gitInfo.headOid}${gitInfo.isHeadOidTagged ? `, tags: ${gitInfo.headTags}` : ''}]`,
    gitInfo && gitInfo.hasChanges && JSON.stringify(gitInfo),
  ].filter(Boolean).join(' ')} */`

  const commonConfig = {
    mode,
    devtool,
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

        // embed the woff2 fonts and any fonts that are used by the PF icons
        // directly in the CSS (to avoid lag applying fonts), export the rest
        // to be loaded seperately as needed
        {
          test: /\.woff2$/,
          include: patternflyFontPaths,
          type: 'asset/inline',
        },
        {
          test: /\.(svg|ttf|eot|woff)$/,
          include: patternflyFontPaths,
          type: 'asset',
          generator: {
            filename: 'fonts/[name].[hash:8][ext][query]',
          },
        },

        // inline base64 URLs for <= 8k images, direct URLs for the rest
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/,
          type: 'asset',
          generator: {
            filename: 'media/[name].[hash:8][ext][query]',
          },
          parser: {
            dataUrlCondition: {
              maxSize: 8192,
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
      extensions: ['.js', '.jsx', '.json'],
      fallback: {
        module: false,
        dgram: false,
        dns: false,
        fs: false,
        http2: false,
        net: false,
        tls: false,
        child_process: false,
      },
    },

    output: {
      path: path.resolve(__dirname, 'dist/ui-extensions-resources'),
      clean: true,

      filename: 'js/[name].js',
      chunkFilename: 'js/[name].[id].chunk.js',

      // UI plugin resources are served through Engine
      publicPath: '/ovirt-engine/webadmin/plugin/ui-extensions/',
    },

    optimization: {
      // Keep the vendor chunk id consistent between builds
      moduleIds: 'deterministic',

      // Keep the runtime chunk separated to enable long term caching
      // runtimeChunk: 'single',
      runtimeChunk: { name: 'webpack-manifest' },

      splitChunks: {
        cacheGroups: {
          vendor: {
            name: 'vendor',
            chunks: 'initial',
            test: /[\\/]node_modules[\\/]/,
          },
        },
      },
    },

    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(env),
        '__DEV__': JSON.stringify(env === 'development'),
      }),

      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'static/ui-extensions.json',
            to: '../',
            transform: (content) => content.toString().replace('"__FAKE_DATA__"', useFakeData),
          },
        ],
      }),

      new HtmlWebpackPlugin({
        filename: 'plugin.html',
        template: 'static/html/plugin.template.ejs',
        extraParams: { gitInfo, rpmInfo },
        inject: true,
        minify: false,
        chunks: ['webpack-manifest', 'vendor', 'plugin'],
      }),
      new HtmlWebpackPlugin({
        filename: 'dashboard.html',
        template: 'static/html/dashboard.template.ejs',
        extraParams: { gitInfo, rpmInfo },
        inject: true,
        minify: false,
        chunks: ['webpack-manifest', 'vendor', 'dashboard'],
      }),

      // emit banner comment at the top of each generated chunk
      new webpack.BannerPlugin({ banner, raw: true }),
    ],
  }

  return commonConfig
}
module.exports = common
