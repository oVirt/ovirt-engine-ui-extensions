import React from 'react'
import PropTypes from 'prop-types'
import { msg } from '_/intl-messages'
import { scalarArrayEq } from '_/utils/equalityCheck'

import { Alert, Table } from 'patternfly-react'
import HostStatusIcon from './HostStatusIcon'

/**
 * Display an array of hosts as a table and allow selecting multiple hosts. The selection
 * will always be returned in the row order displayed on screen.
 *
 * The host selection is purely controlled.
 */
class SelectHosts extends React.Component {
  static reduceSelectedHosts (selectedHosts) {
    return (selectedHosts && selectedHosts.length > 0)
      ? selectedHosts.reduce((map, host) => { map[host.id] = true; return map }, {})
      : []
  }

  constructor (props) {
    super(props)
    this.state = {
      selectedHostIds: SelectHosts.reduceSelectedHosts(props.selectedHosts),
      sortedHosts: props.hosts.slice(0),
      filter: '',
    }

    this.onSelectRow = this.onSelectRow.bind(this)
    this.onSelectAllRows = this.onSelectAllRows.bind(this)

    // ----- Table Column Definitions
    // Header Formatters
    const headerFormatText = (label, { column }) => <Table.Heading {...column.header.props}>{label}</Table.Heading>
    const headerFormatSelect = (label, { column }, ...rest) =>
      Table.selectionHeaderCellFormatter({
        cellProps: {},
        column,
        rows: this.state.sortedHosts.map(host => ({
          id: host.id,
          selected: this.state.selectedHostIds[host.id],
        })),
        onSelectAllRows: this.onSelectAllRows,
      })

    // Cell Formatters
    const cellFormatText = value => <Table.Cell>{value}</Table.Cell>
    const cellFormatStatus = value => <Table.Cell className='statusColumn'><HostStatusIcon status={value} /></Table.Cell>
    const cellFormatVmInfo = vmSummary => <Table.Cell>{vmSummary.total}</Table.Cell>
    const cellFormatSelect = (value, { rowData, rowIndex }) =>
      Table.selectionCellFormatter(
        { rowData, rowIndex },
        this.onSelectRow,
        rowData.id
      )

    // Column Definitions
    this.columns = [
      {
        header: { formatters: [headerFormatSelect] },
        cell: { formatters: [cellFormatSelect] },
        property: 'selected',
      },
      {
        header: {
          label: msg.clusterUpgradeHostTableHeaderStatus(),
          formatters: [headerFormatText],
          props: {
            style: { width: 75, textAlign: 'center' },
          },
        },
        cell: { formatters: [cellFormatStatus] },
        property: 'status',
      },
      {
        header: { label: msg.clusterUpgradeHostTableHeaderName(), formatters: [headerFormatText] },
        cell: { formatters: [cellFormatText] },
        property: 'name',
      },
      {
        header: { label: msg.clusterUpgradeHostTableHeaderHostname(), formatters: [headerFormatText] },
        cell: { formatters: [cellFormatText] },
        property: 'address',
      },
      {
        header: {
          label: msg.clusterUpgradeHostTableHeaderVMs(),
          formatters: [headerFormatText],
          props: {
            style: { width: 140 },
          },
        },
        cell: { formatters: [cellFormatVmInfo] },
        property: 'vmInfo',
      },
    ]
  }

  componentDidUpdate (prevProps, prevState) {
    const { hosts, selectedHosts } = this.props
    let updates = null

    if (!scalarArrayEq(prevProps.hosts, hosts)) {
      updates = {
        selectedHostIds: {},
        sortedHosts: hosts.slice(0),
        filter: '',
      }
    }

    if (!scalarArrayEq(prevProps.selectedHosts, selectedHosts)) {
      updates = {
        ...updates,
        selectedHostIds: SelectHosts.reduceSelectedHosts(selectedHosts),
      }
    }

    if (updates) {
      this.setState(updates) // eslint-disable-line react/no-did-update-set-state
    }
  }

  onSelectRow (event, rowData) {
    const selectedHostIdsSorted = this.state.sortedHosts
      .filter(host => host.id === rowData.id ? !rowData.selected : this.state.selectedHostIds[host.id])
      .map(host => host.id)

    this.props.onChange(selectedHostIdsSorted)
  }

  onSelectAllRows (event) {
    const newSelected = event.target.checked
    this.props.onChange(newSelected ? this.state.sortedHosts.map(host => host.id) : [])
  }

  render () {
    const { hosts } = this.props

    if (!hosts || hosts.length === 0) {
      return (
        <div className='clusterUpgradeWizard-SelectHosts-NoHosts'>
          <h2>{msg.clusterUpgradeNoHostsMessage()}</h2>
        </div>
      )
    }

    return (
      <div className='clusterUpgradeWizard-SelectHosts'>
        <Alert type='info' style={{ margin: '0' }}>
          {msg.clusterUpgradeSelectHostsMessage()}
        </Alert>

        <div className='tableContainer'>
          <Table.PfProvider
            striped
            bordered
            hover
            columns={this.columns}
          >
            <Table.Header />
            <Table.Body
              rowKey='id'
              rows={hosts.map(host => ({
                id: host.id,
                selected: this.state.selectedHostIds[host.id],
                status: host.status,
                name: host.name,
                address: host.address,
                vmInfo: host.summary,
              }))}
            />
          </Table.PfProvider>
        </div>
      </div>
    )
  }
}

SelectHosts.propTypes = {
  hosts: PropTypes.arrayOf(PropTypes.object),
  selectedHosts: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func.isRequired,
}

SelectHosts.defaultProps = {
  hosts: [],
  selectedHosts: [],
}

export default SelectHosts
