const babelConfig = require('../.babelrc')
const babelJest = require('babel-jest')

module.exports = babelJest.createTransformer(babelConfig)
