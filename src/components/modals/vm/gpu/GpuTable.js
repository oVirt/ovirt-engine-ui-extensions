import {
  Bullseye,
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
  EmptyStateIcon,
  Title
} from '@patternfly/react-core'
import {
  expandable,
  sortable,
  SortByDirection,
  Table,
  TableBody,
  TableHeader
} from '@patternfly/react-table'
import { SearchIcon } from '@patternfly/react-icons'
import PropTypes from 'prop-types'
import React from 'react'
import { msg } from '_/intl-messages'
import { stringWithNumberSuffixCompare } from '_/utils/compare'
import { handleNonAvailableValue } from './handleNonAvailableValue'
import GpuTableRowDetail from './GpuTableRowDetail'

const GpuTable = ({gpus, selectedGpus, onGpuSelectionChange}) => {
  const columns = [
    { title: msg.vmManageGpuTableCardName(), transforms: [sortable], cellFormatters: [expandable] },
    { title: msg.vmManageGpuTableHostName(), transforms: [sortable] },
    msg.vmManageGpuTableAvailableInstances(),
    msg.vmManageGpuTableMaxInstances(),
    msg.vmManageGpuTableMaxResolution()
  ]

  const emptyTableRows = [{
    heightAuto: true,
    cells: [
      {
        props: { colSpan: columns.length },
        title: (
          <Bullseye>
            <EmptyState variant={EmptyStateVariant.small}>
              <EmptyStateIcon icon={SearchIcon} />
              <Title headingLevel='h2' size='lg'>{msg.vmManageGpuTableEmptyStateTitle()}</Title>
              <EmptyStateBody>{msg.vmManageGpuTableEmptyStateBody()}</EmptyStateBody>
            </EmptyState>
          </Bullseye>
        )
      }
    ]
  }]

  const [sortBy, setSortBy] = React.useState({index: 2, direction: SortByDirection.asc})

  const [openRows, setOpenRows] = React.useState(new Map())

  const compareRows = (a, b) => {
    let cellIndex = sortBy.index - 2
    return stringWithNumberSuffixCompare(a.cells[cellIndex], b.cells[cellIndex])
  }

  const createRows = (gpus) => {
    let parentRows = gpus.map((gpu) => {
      const isOpen = openRows.get(gpu.id)
      const isSelected = selectedGpus.get(gpu.id)
      return {
        isOpen: isOpen === true,
        selected: isSelected === undefined ? gpu.selected : isSelected,
        cells: [
          gpu.cardName,
          gpu.host,
          handleNonAvailableValue(gpu.availableInstances),
          handleNonAvailableValue(gpu.maxInstances),
          handleNonAvailableValue(gpu.maxResolution)
        ],
        gpu: gpu
      }
    }).sort(compareRows)
    parentRows = sortBy.direction === SortByDirection.asc ? parentRows : parentRows.reverse()

    let allRows = []
    parentRows.forEach(parentRow => {
      let parentIndex = allRows.length
      allRows.push(parentRow)
      allRows.push({
        parent: parentIndex,
        cells: [
          {
            title: (
              <GpuTableRowDetail gpu={parentRow.gpu} />
            )
          }
        ]
      })
    })
    return allRows
  }

  const onSort = (_event, index, direction) => {
    setSortBy({index: index, direction: direction})
  }

  const onSelect = (_event, isSelected, _rowIndex, rowData) => {
    onGpuSelectionChange(rowData.gpu, isSelected)
  }

  const onCollapse = (_event, _rowIndex, isOpen, rowData) => {
    setOpenRows(openRows => new Map(openRows).set(rowData.gpu.id, isOpen))
  }

  if (gpus.length === 0) {
    return (
      <Table cells={columns} rows={emptyTableRows}>
        <TableHeader />
        <TableBody />
      </Table>
    )
  }

  return (
    <div className='vgpu-table-wrapper'>
      <Table
        aria-label='Simple Table'
        cells={columns}
        rows={createRows(gpus)}
        onSelect={onSelect}
        canSelectAll={false}
        onSort={onSort}
        sortBy={sortBy}
        onCollapse={onCollapse}
      >
        <TableHeader />
        <TableBody />
      </Table>
    </div>
  )
}

GpuTable.propTypes = {
  gpus: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      cardName: PropTypes.string,
      host: PropTypes.string,
      availableInstances: PropTypes.number,
      maxInstances: PropTypes.number,
      maxResolution: PropTypes.string,
      numberOfHeads: PropTypes.number,
      frameBuffer: PropTypes.string,
      frameRateLimiter: PropTypes.number,
      product: PropTypes.string,
      vendor: PropTypes.string,
      selected: PropTypes.bool
    })),
  selectedGpus: PropTypes.any,
  onGpuSelectionChange: PropTypes.func
}

export default GpuTable
