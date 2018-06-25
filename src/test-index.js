import appInit from './services/app-init'
import { defaultLocale, defaultTimeZone } from './constants'
import { resetApi } from './plugin-api'
import { clearMessageCache } from './utils/intl'

// TODO(vs) this fancy import is needed until we upgrade to Sinon 2
// https://github.com/webpack/webpack/issues/304#issuecomment-170883329
// eslint-disable-next-line import/no-webpack-loader-syntax
import sinon from 'imports-loader?define=>false,require=>false!sinon/pkg/sinon.js'

// require all modules ending in `-test` from the current directory and all subdirectories
const testContext = require.context('.', true, /-test$/)
testContext.keys().forEach(testContext)

beforeEach(function setupFakeEnv (done) {
  // all tests should use `this.sandbox` to create fakes
  const sandbox = this.sandbox = sinon.sandbox.create()

  // stubbed UI plugin API functions, exposed via `this.pluginApiStubs`
  const pluginApiStubs = this.pluginApiStubs = {}
  ;[
    'register',
    'ready',
    'addPrimaryMenuPlace',
    'setPlaceUnloadHandler',
    'revealPlace',
    'setSearchString',
    'engineBaseUrl',
    'currentLocale',
    'currentTimeZone' // TODO(vs) this API function isn't currently available
  ].forEach((apiMethod) => {
    pluginApiStubs[apiMethod] = sandbox.stub()
  })
  pluginApiStubs.currentLocale.returns(defaultLocale)
  pluginApiStubs.currentTimeZone.returns(defaultTimeZone)

  // ensure the global pluginApi function exists and is unique for each test
  window.top.pluginApi = () => pluginApiStubs
  resetApi()

  clearMessageCache()

  appInit.run()
    .then(() => { done() })
    .catch((error) => { done(error) })
})

afterEach(function disposeFakeEnv () {
  this.sandbox.restore()
  delete window.top.pluginApi
})
