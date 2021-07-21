import { pluginBasePath, dashboardPlaceToken } from '../constants'
import getPluginApi from '../plugin-api'
import { msg } from '../intl-messages'

function addDashboardPlace () {
  getPluginApi().addPrimaryMenuPlace(msg.dashboardTitle(), dashboardPlaceToken, `${pluginBasePath}/dashboard.html`, {
    // place the menu item before existing ones
    priority: -1,
    // customize the prefix displayed in search bar
    searchPrefix: 'Dashboard',
    // make users land on this place by default
    defaultPlace: true,
    // make sure the menu item has the right icon
    icon: 'fa-tachometer',
  })
}

export function addPlaces () {
  addDashboardPlace()
}
