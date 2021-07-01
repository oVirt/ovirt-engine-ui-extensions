const env = process.env.NODE_ENV || 'development'

// babel configs
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        debug: !process.env.Q && env === 'development',

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
}
