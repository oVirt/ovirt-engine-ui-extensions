import { pluginBasePath, dashboardPlaceToken } from './constants'
import getPluginApi from './plugin-api'
import { msg } from './intl-messages'
import appInit from './services/app-init'

// register event handlers
getPluginApi().register({

  UiInit () {
    // add Dashboard main tab
    getPluginApi().addPrimaryMenuPlace(msg.mainTabTitle(), dashboardPlaceToken, `${pluginBasePath}/main-tab.html`, {
      // position this tab before any standard ones
      priority: -1,
      // customize the prefix displayed in search bar
      searchPrefix: 'Dashboard',
      defaultPlace: true,
      icon: 'fa-tachometer'
    })
  }

})

appInit.run().then(() => {
  // proceed with plugin initialization (UiInit)
  getPluginApi().ready()
})
