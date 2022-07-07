import '@patternfly/react-core/dist/styles/base.css'
import '../static/css/plugin-pf4-overrides.css'
import '../static/css/dashboard.css'

import React from 'react'
import ReactDOM from 'react-dom'
import { dashboardPlaceToken } from '_/constants'
import getPluginApi from '_/plugin-api'
import appInit from '_/services/app-init'

import DashboardDataProvider from '_/dashboard/DashboardDataProvider'
import Dashboard from '_/dashboard/Dashboard'
import LoadingPlaceHolder from '_/dashboard/LoadingPlaceHolder'
import LoadingErrorPlaceHolder from '_/dashboard/LoadingErrorPlaceHolder'

const appRoot = document.getElementById('app')

appInit.run().then(() => {
  ReactDOM.render(
    <DashboardDataProvider loading={(<LoadingPlaceHolder/>)} error={(<LoadingErrorPlaceHolder/>)}>
      <Dashboard />
    </DashboardDataProvider>,
    appRoot
  )
})

getPluginApi().setPlaceUnloadHandler(dashboardPlaceToken, function () {
  ReactDOM.unmountComponentAtNode(appRoot)
})
