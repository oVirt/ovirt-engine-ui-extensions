const chalk = require('chalk')

const env = process.env.NODE_ENV || 'development'
const DEV = env === 'development'

// babel configs
module.exports = api => ({
  presets: [
    [
      '@babel/preset-env',
      {
        debug: !process.env.Q && DEV,

        targets: {
          node: 'current',
        },
        useBuiltIns: 'usage',
        corejs: '3.13',
        exclude: ['transform-typeof-symbol'],
      },
    ],

    [
      '@babel/preset-react',
      {
        runtime: 'classic',
        useBuiltIns: true,
      },
    ],
  ],

  plugins: [
    DEV && './babel-plugin/fancy-console',
    api.env('test') && [
      './babel-plugin/fancy-console',
      {
        loggers: [
          {
            object: 'console',
            methods: ['log', 'info', 'warn', 'error'],
            enhancements: {
              log: [chalk.bold.white.bgHex('#21409a')(' debug ')],
              info: [chalk.bold.white.bgHex('#01acac')(' info ')],
              warn: [chalk.bold.white.bgHex('#f8a51b')(' warn ')],
              error: [chalk.bold.white.bgHex('#ed403c')(' error ')],
            },
          },
        ],
      },
    ],
  ].filter(Boolean),
})
