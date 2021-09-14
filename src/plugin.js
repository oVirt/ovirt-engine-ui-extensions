import '_/logger'
import getPluginApi from './plugin-api'
import appInit from './services/app-init'
import { addPlaces } from './integrations/places'
import { addButtons } from './integrations/buttons'
import { createErrorMessage } from '_/utils/error-message'

// ** patternfly3-react
import 'patternfly-react/dist/css/patternfly-react.css'

// ** patternfly4
//      This is the base PF4 style sheet with all styles for all componenets (including
//      more than is needed for pf4-react), but with the no-reset version so it doesn't
//      conflict with PF3.  Also, since the plugin is sitting in an iframe, and PF4-react
//      components don't know how to dynamically insert their styles to the iframe's
//      parent, we need to use the full css.  We insert it into the iframe's parent when
//      a modal is displayed.  The css bits pulled from @patternfly/react-styles can and
//      should be ignored (i.e. excluded by webpack).
//
//      See: https://github.com/patternfly/patternfly-react/pull/5166#pullrequestreview-546364469
//
import '@patternfly/patternfly/patternfly-no-reset.css'
import '@patternfly/patternfly/patternfly-addons.css'

// ** overrides
import '../static/css/plugin-pf4-overrides.css'

function addErrorHandler () {
  window.addEventListener('error', errorEvent => {
    if (errorEvent.error) {
      getPluginApi().reportFatalError(createErrorMessage(errorEvent.error, true))
    } else {
      getPluginApi().reportFatalError(createErrorMessage(errorEvent, true))
    }
  })
}

// register event handlers
getPluginApi().register({

  UiInit: () => {
    addErrorHandler()
    addPlaces()
    addButtons()
  },

})

appInit.run().then(() => {
  // proceed with plugin initialization (UI plugin infra will call UiInit)
  getPluginApi().ready()
})
