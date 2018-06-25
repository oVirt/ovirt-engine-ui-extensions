import React from 'react'
import ReactDOM from 'react-dom'
import { dashboardPlaceToken } from './constants'
import getPluginApi from './plugin-api'
import { msg } from './intl-messages'
import appInit from './services/app-init'
import DashboardDataProvider from './components/DashboardDataProvider'
import GlobalDashboard from './components/GlobalDashboard'

import 'patternfly/dist/css/patternfly.min.css'
import 'patternfly/dist/css/patternfly-additions.min.css'

// TODO(vs): Move component-specific CSS next to the relevant React component and
// have that React component import the CSS. Once we update our code to use only
// patternfly-react components, remove dependency on PatternFly as well as related
// dependencies like jQuery and C3/D3.
import '../static/css/main-tab.css'

// TODO(vs): For now, we use Bootstrap JavaScript library providing interactive
// components via jQuery plugins. Eventually, we should use only patternfly-react
// components and remove Bootstrap & jQuery dependencies. (Note: jQuery is loaded
// automatically through webpack ProvidePlugin, no explicit import needed here.)
import 'bootstrap'

// Note: Bootstrap 3.3.7 Tooltip.getPosition() function has a bug, this override
// fixes the problem.
import '../static/js/bootstrap-tooltip-override'

const appRoot = document.getElementById('app')

appInit.run().then(() => {
  const loadingPlaceholder = (
    <div className='text-center'>
      <h2>{msg.dataLoading()}</h2>
      <div className='spinner spinner-lg' />
    </div>
  )

  const errorPlaceholder = (
    <div className='text-center'>
      <h2>{msg.dataError()}</h2>
      <span style={{ fontSize: 15 }}>
        {msg.dataErrorDetail()}
      </span>
    </div>
  )

  ReactDOM.render(
    <DashboardDataProvider loading={loadingPlaceholder} error={errorPlaceholder}>
      <GlobalDashboard data={{}} lastUpdated={new Date(0)} />
    </DashboardDataProvider>,
    appRoot
  )
})

getPluginApi().setPlaceUnloadHandler(dashboardPlaceToken, function () {
  ReactDOM.unmountComponentAtNode(appRoot)
})
