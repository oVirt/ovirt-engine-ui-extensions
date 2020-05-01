module.exports = {
  verbose: true,
  bail: true,

  globals: {
    '__DEV__': false
  },

  moduleFileExtensions: [
    'jsx',
    'js'
  ],
  moduleDirectories: [
    'node_modules'
  ],
  moduleNameMapper: {
    '^_/(.*)$': '<rootDir>/src/$1',
    '^.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/jest/fileMock.js',
    '^.+\\.(css|less)$': 'identity-obj-proxy'
  },

  setupFiles: [
    '<rootDir>/jest/polyfills.js',
    '<rootDir>/jest/chalk.logger.js'
  ],
  setupFilesAfterEnv: [
    '<rootDir>/src/test-index.js'
  ],

  testPathIgnorePatterns: [
    '<rootDir>/dist',
    '<rootDir>/exported-artifacts',
    '<rootDir>/node_modules',
    '<rootDir>/packaging',
    '<rootDir>/rpmbuild',
    '<rootDir>/zanata'
  ],
  testRegex: '(/__tests__/.*|[.-]test)\\.jsx?$'
}
