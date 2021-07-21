import '_/logger'
import getPluginApi from './plugin-api'
import appInit from './services/app-init'
import { addPlaces } from './integrations/places'
import { addButtons } from './integrations/buttons'
import { createErrorMessage } from '_/utils/error-message'

// ** patternfly3-react
import 'patternfly-react/dist/css/patternfly-react.css'

// ** patternfly4 (no reset version so it doesn't conflict with PF3, but it includes
//                 more than is needed for pf4-react)
import '@patternfly/patternfly/patternfly-no-reset.css'

/*
  NOTE: Once https://github.com/patternfly/patternfly-react/pull/5166 is merged and
        released, we can use this import of PF4-react instead
 */
// ** patternfly4-react (no reset version so it doesn't break PF3)
// import '@patternfly/react-core/dist/style/base-no-reset.css'

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
