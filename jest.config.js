module.exports = {
  verbose: true,
  bail: true,

  globals: {
    '__DEV__': false,
  },

  moduleFileExtensions: [
    'js',
    'jsx',
    'ts',
    'tsx',
    'json',
    'node',
  ],
  moduleDirectories: [
    'node_modules',
  ],
  moduleNameMapper: {
    '^_/(.*)$': '<rootDir>/src/$1',
  },

  setupFiles: [
    '<rootDir>/jest/polyfills.js',
  ],
  setupFilesAfterEnv: [
    '<rootDir>/src/test-index.js',
  ],

  transform: {
    '^.+\\.(js|jsx|mjs|cjs|ts|tsx)$': 'babel-jest',
    '^.+\\.css$': '<rootDir>/jest/cssTransform.js',
    '^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|json)$)': '<rootDir>/jest/fileTransform.js',
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$',
    '^.+\\.module\\.(css|sass|scss)$',
  ],

  testEnvironment: 'jsdom',
  testMatch: [
    '<rootDir>/**/*.test.{js,jsx,ts,tsx}',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/dist',
    '<rootDir>/exported-artifacts',
    '<rootDir>/node_modules',
    '<rootDir>/packaging',
    '<rootDir>/tmp.repos',
    '<rootDir>/rpmbuild',
    '<rootDir>/zanata',
  ],
}
