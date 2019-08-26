import '_/logger'
import getPluginApi from './plugin-api'
import appInit from './services/app-init'
import { addPlaces } from './integrations/places'
import { addButtons } from './integrations/buttons'

import 'patternfly-react/dist/css/patternfly-react.css'

// register event handlers
getPluginApi().register({

  UiInit: () => {
    addPlaces()
    addButtons()
  }

})

appInit.run().then(() => {
  // proceed with plugin initialization (UI plugin infra will call UiInit)
  getPluginApi().ready()
})
