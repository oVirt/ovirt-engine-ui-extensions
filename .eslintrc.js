module.exports = {
  'extends': ['standard', 'standard-react'],
  'env': {
    'browser': true,
    'mocha': true
  },

  'globals': {
    '__DEV__': false
  },

  'plugins': [
    'chai-friendly'
  ],
  'rules': {
    'react/jsx-no-bind': [
      1,
      {
        'ignoreRefs': true,
        'allowArrowFunctions': true
      }
    ],
    'no-unused-expressions': 0,
    'chai-friendly/no-unused-expressions': 2,
    'no-multi-spaces': ['error', { 'ignoreEOLComments': true }]
  }
}
