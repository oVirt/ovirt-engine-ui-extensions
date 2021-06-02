import {
  Bullseye,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Title
} from '@patternfly/react-core'
import { SearchIcon } from '@patternfly/react-icons'
import {
  expandable,
  sortable,
  RowSelectVariant,
  SortByDirection,
  Table,
  TableBody,
  TableHeader
} from '@patternfly/react-table'
import PropTypes from 'prop-types'
import React from 'react'
import { msg } from '_/intl-messages'
import { stringWithNumberSuffixCompare } from '_/utils/compare'
import GpuTableRowDetail from './GpuTableRowDetail'
import { handleNonAvailableValue } from './handleNonAvailableValue'

const GpuTable = ({gpus, selectedGpus, onGpuSelectionChange}) => {
  const columns = [
    { title: msg.vmManageGpuTableCardName(), transforms: [sortable], cellFormatters: [expandable] },
    msg.vmManageGpuTableNumberOfHeads(),
    msg.vmManageGpuTableFrameRateLimiter(),
    msg.vmManageGpuTableMaxResolution(),
    msg.vmManageGpuTableFrameBuffer(),
    msg.vmManageGpuTableMaxInstances(),
    msg.vmManageGpuTableRequestedInstances()
  ]

  const emptyTableRows = [{
    heightAuto: true,
    cells: [
      {
        props: { colSpan: columns.length },
        title: (
          <Bullseye>
            <EmptyState variant={EmptyStateVariant.small} className='vgpu-table-empty-state'>
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

  const createCardNameToGpusMap = (gpus) => {
    const cardNameToGpus = new Map()

    // group gpus by card name
    gpus.forEach(gpu => {
      if (cardNameToGpus.get(gpu.cardName) === undefined) {
        cardNameToGpus.set(gpu.cardName, [])
      }

      cardNameToGpus.get(gpu.cardName).push(gpu)
    })

    return cardNameToGpus
  }

  const createParentRow = (gpu) => {
    const isOpen = openRows.get(gpu.cardName)
    const isSelected = !!selectedGpus[gpu.cardName]
    const requestedInstances = +selectedGpus[gpu.cardName] || 0
    return {
      isOpen: isOpen === true,
      selected: isSelected,
      cells: [
        gpu.cardName,
        handleNonAvailableValue(gpu.numberOfHeads),
        handleNonAvailableValue(gpu.frameRateLimiter),
        handleNonAvailableValue(gpu.maxResolution),
        handleNonAvailableValue(gpu.frameBuffer),
        handleNonAvailableValue(gpu.maxInstances),
        requestedInstances
      ],
      gpu: gpu
    }
  }

  const createChildRow = (gpus, parentIndex) => {
    return {
      parent: parentIndex,
      fullWidth: true,
      noPadding: true,
      cells: [
        {
          title: (
            <GpuTableRowDetail gpus={gpus} />
          ),
          props: { colSpan: columns.length + 2 } // +1 for collapse, +1 for select
        }
      ]
    }
  }

  const createRows = (cardNameToGpus) => {
    let parentRows = []
    cardNameToGpus.forEach((gpus) => {
      parentRows.push(createParentRow(gpus[0]))
    })
    parentRows.sort(compareRows)
    parentRows = sortBy.direction === SortByDirection.asc ? parentRows : parentRows.reverse()

    const allRows = []
    parentRows.forEach(parentRow => {
      const parentIndex = allRows.length
      allRows.push(parentRow)
      allRows.push(createChildRow(cardNameToGpus.get(parentRow.gpu.cardName), parentIndex))
    })
    return allRows
  }

  const onSort = (_event, index, direction) => {
    setSortBy({index: index, direction: direction})
  }

  const onSelect = (_event, isSelected, _rowIndex, rowData) => {
    onGpuSelectionChange(rowData.gpu.cardName, +isSelected)
  }

  const onCollapse = (_event, _rowIndex, isOpen, rowData) => {
    setOpenRows(openRows => new Map(openRows).set(rowData.gpu.cardName, isOpen))
  }

  const actionResolver = (rowData, _) => {
    if (!rowData.gpu) {
      return
    }

    return [
      {
        title: msg.vmManageGpuAddActionButton(),
        isDisabled: selectedGpus[rowData.gpu.cardName] >= rowData.gpu.maxInstances,
        onClick: (_event, _rowId, rowData, _extra) => {
          onGpuSelectionChange(rowData.gpu.cardName, selectedGpus[rowData.gpu.cardName] + 1)
        }
      },
      {
        title: msg.vmManageGpuRemoveActionButton(),
        isDisabled: selectedGpus[rowData.gpu.cardName] <= 0,
        onClick: (_event, _rowId, rowData, _extra) => {
          onGpuSelectionChange(rowData.gpu.cardName, selectedGpus[rowData.gpu.cardName] - 1)
        }
      }
    ]
  }

  const areActionsDisabled = (rowData, _) => {
    return !rowData.gpu || !selectedGpus[rowData.gpu.cardName]
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
    <Table
      aria-label='Simple Table'
      className='vgpu-table'
      cells={columns}
      rows={createRows(createCardNameToGpusMap(gpus))}
      selectVariant={RowSelectVariant.radio}
      onSelect={onSelect}
      canSelectAll={false}
      onSort={onSort}
      sortBy={sortBy}
      onCollapse={onCollapse}
      actionResolver={actionResolver}
      areActionsDisabled={areActionsDisabled}
    >
      <TableHeader />
      <TableBody />
    </Table>
  )
}

GpuTable.propTypes = {
  gpus: PropTypes.arrayOf(
    PropTypes.shape({
      cardName: PropTypes.string,
      host: PropTypes.string,
      availableInstances: PropTypes.number,
      requestedInstances: PropTypes.number,
      maxInstances: PropTypes.number,
      maxResolution: PropTypes.string,
      numberOfHeads: PropTypes.number,
      frameBuffer: PropTypes.string,
      frameRateLimiter: PropTypes.number,
      product: PropTypes.string,
      vendor: PropTypes.string,
      address: PropTypes.string
    })),
  selectedGpus: PropTypes.any,
  onGpuSelectionChange: PropTypes.func
}

export default GpuTable
