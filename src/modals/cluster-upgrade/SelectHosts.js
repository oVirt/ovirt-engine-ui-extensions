import React from 'react'
import PropTypes from 'prop-types'
import { msg } from '_/intl-messages'
import { currentLocale } from '_/utils/intl'

import { Alert, Title } from '@patternfly/react-core'
import { TableComposable, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table'

import HostStatusIcon from './HostStatusIcon'

/**
 * Display an array of hosts as a table and allow selecting multiple hosts.
 *
 * The host selection is purely controlled.
 */
const SelectHosts = ({
  hosts = [],
  selectedHostIds = [],
  onChange, // note: the function takes the complete set of selected host ids every time
}) => {
  if (!hosts || hosts.length === 0) {
    return (
      <div className='clusterUpgradeWizard-SelectHosts-NoHosts'>
        <Title headingLevel='h2'>{msg.clusterUpgradeNoHostsMessage()}</Title>
      </div>
    )
  }

  const onSelectRow = (host, event, isSelected) => {
    onChange(isSelected
      ? [host.id, ...selectedHostIds]
      : selectedHostIds.filter(id => id !== host.id)
    )
  }

  const onSelectAll = (event, isSelected) => {
    onChange(isSelected ? hosts.map(host => host.id) : [])
  }

  const allRowsSelected = hosts.every(host => selectedHostIds.includes(host.id))
  const isThisHostSelected = host => allRowsSelected || selectedHostIds.includes(host.id)
  const hostSortCompare = (host1, host2) => host1.name.localeCompare(host2.name, currentLocale())

  return (
    <div className='clusterUpgradeWizard-SelectHosts'>
      <Alert variant='info' isInline title={msg.clusterUpgradeSelectHostsMessage()} />

      <div className='tableContainer'>
        <TableComposable>
          <Thead>
            <Tr>
              <Th
                select={{
                  isSelected: allRowsSelected,
                  onSelect: onSelectAll,
                }}
              />
              <Th modifier='fitContent'>{msg.clusterUpgradeHostTableHeaderStatus()}</Th>
              <Th>{msg.clusterUpgradeHostTableHeaderName()}</Th>
              <Th>{msg.clusterUpgradeHostTableHeaderHostname()}</Th>
              <Th modifier='fitContent'>{msg.clusterUpgradeHostTableHeaderVMs()}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {hosts.sort(hostSortCompare).map((host, rowIndex) => (
              <Tr
                key={`${rowIndex}_0`}
                // TODO: Newer version of @patternfly/react-table have row selection built in -- would be nice to use!
                // onRowClick={(event) => onSelectRow(host, event, !isThisHostSelected(host))}
                // isHoverable
                // isRowSelected={isThisHostSelected(host)}
              >
                <Td
                  key={`${rowIndex}_1`}
                  select={{
                    rowIndex,
                    isSelected: isThisHostSelected(host),
                    onSelect: (event, isSelected) => onSelectRow(host, event, isSelected),
                  }}
                />
                <Td key={`${rowIndex}_2`} className='statusColumn'><HostStatusIcon status={host.status} /></Td>
                <Td key={`${rowIndex}_3`}>{host.name}</Td>
                <Td key={`${rowIndex}_4`}>{host.address}</Td>
                <Td key={`${rowIndex}_5`}>{host.summary.total}</Td>
              </Tr>
            ))}
          </Tbody>
        </TableComposable>
      </div>
    </div>
  )
}

SelectHosts.propTypes = {
  hosts: PropTypes.arrayOf(PropTypes.object),
  selectedHostIds: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
}

export default SelectHosts
