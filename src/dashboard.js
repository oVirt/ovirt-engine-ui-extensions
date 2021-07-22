import '_/logger'
import React from 'react'
import ReactDOM from 'react-dom'
import { dashboardPlaceToken } from '_/constants'
import getPluginApi from '_/plugin-api'
import { msg } from '_/intl-messages'
import appInit from '_/services/app-init'

import DashboardDataProvider from '_/dashboard/DashboardDataProvider'
import Dashboard from '_/dashboard/Dashboard'

// patternfly3-react and standard patternfly3
import 'patternfly-react/dist/css/patternfly-react.css'
import 'patternfly/dist/css/patternfly.min.css'
import 'patternfly/dist/css/patternfly-additions.min.css'

// patternfly4 (no-reset so we can use PF3 and PF4 at the same time)
import '@patternfly/patternfly/patternfly-no-reset.css'

// TODO: Move component-specific CSS next to the relevant React component and
// have that React component import the CSS. Once we update our code to use only
// patternfly-react components, remove dependency on PatternFly as well as related
// dependencies like jQuery and C3/D3.
import '../static/css/dashboard.css'
import '../static/css/plugin-pf4-overrides.css'

// TODO: For now, we use Bootstrap JavaScript library providing interactive
// components via jQuery plugins. Eventually, we should use only patternfly-react
// components and remove Bootstrap & jQuery dependencies. (Note: jQuery is loaded
// automatically through webpack ProvidePlugin, no explicit import needed here.)
import 'bootstrap'

// Bootstrap 3.3.7 Tooltip.getPosition() function has a bug, this override fixes
// the problem.
import './bootstrap-overrides/tooltip-fix'

const appRoot = document.getElementById('app')

appInit.run().then(() => {
  const loadingPlaceholder = ( // TODO: Better "Data Loading" spinner layout ... view port horizontal and vertical centering
    <div className='text-center'>
      <h2>{msg.dashboardDataLoading()}</h2>
      <div className='spinner spinner-lg' />
    </div>
  )

  const errorPlaceholder = ( // TODO: Better "Data Error" spinner layout ... view port horizontal and vertical centering
    <div className='text-center'>
      <h2>{msg.dashboardDataError()}</h2>
      <span style={{ fontSize: 15 }}>
        {msg.dashboardDataErrorDetail()}
      </span>
    </div>
  )

  ReactDOM.render(
    <DashboardDataProvider loading={loadingPlaceholder} error={errorPlaceholder}>
      <Dashboard />
    </DashboardDataProvider>,
    appRoot
  )
})

getPluginApi().setPlaceUnloadHandler(dashboardPlaceToken, function () {
  ReactDOM.unmountComponentAtNode(appRoot)
})
