import { pluginName } from './constants'
import { getWebAdminWindow } from './utils/webadmin-dom'

let api

const getPluginApi = () => {
  api = api || getWebAdminWindow().pluginApi(pluginName)
  return api
}

function resetApi () {
  api = undefined
}

export { getPluginApi as default, resetApi }
