module.exports = {
  'extends': [
    'standard',
    'standard-react'
  ],
  'env': {
    'browser': true,
    'jest': true
  },
  'globals': {
    '__DEV__': false
  },
  'plugins': [
    'react-hooks'
  ],
  'rules': {
    'no-multi-spaces': [ 'error', { 'ignoreEOLComments': true } ],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn'
  }
}
