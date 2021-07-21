import {
  Bullseye,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Title,
} from '@patternfly/react-core'
import { SearchIcon } from '@patternfly/react-icons'
import {
  cellWidth,
  expandable,
  sortable,
  RowSelectVariant,
  SortByDirection,
  Table,
  TableBody,
  TableHeader,
  wrappable,
} from '@patternfly/react-table'
import PropTypes from 'prop-types'
import React from 'react'
import { msg } from '_/intl-messages'
import { stringWithNumberSuffixCompare } from '_/utils/compare'
import GpuTableRowDetail from './GpuTableRowDetail'
import { handleNonAvailableValue } from './handleNonAvailableValue'

const GpuTable = ({ gpus, selectedMDevTypes, onGpuSelectionChange }) => {
  const columns = [
    {
      title: msg.vmManageGpuTableMDevType(),
      transforms: [
        sortable,
        cellWidth(15),
      ],
      cellFormatters: [expandable],
    },
    {
      title: msg.vmManageGpuTableCardName(),
      transforms: [cellWidth(15)],
    },
    {
      title: msg.vmManageGpuTableNumberOfHeads(),
      transforms: [wrappable],
    },
    {
      title: msg.vmManageGpuTableFrameRateLimiter(),
      transforms: [wrappable, cellWidth(10)],
    },
    {
      title: msg.vmManageGpuTableMaxResolution(),
      transforms: [wrappable],
    },
    {
      title: msg.vmManageGpuTableFrameBuffer(),
      transforms: [wrappable],
    },
    {
      title: msg.vmManageGpuTableMaxInstances(),
      transforms: [wrappable],
    },
    {
      title: msg.vmManageGpuTableRequestedInstances(),
      transforms: [wrappable],
    },
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
        ),
      },
    ],
  }]

  const [sortBy, setSortBy] = React.useState({ index: 2, direction: SortByDirection.asc })

  const [openRows, setOpenRows] = React.useState(new Map())

  const compareRows = (a, b) => {
    const cellIndex = sortBy.index - 2
    return stringWithNumberSuffixCompare(a.cells[cellIndex], b.cells[cellIndex])
  }

  const createMDevTypeToGpusMap = (gpus) => {
    const mDevTypeToGpus = new Map()

    // group gpus by id
    gpus.forEach(gpu => {
      if (mDevTypeToGpus.get(gpu.mDevType) === undefined) {
        mDevTypeToGpus.set(gpu.mDevType, [])
      }

      mDevTypeToGpus.get(gpu.mDevType).push(gpu)
    })

    return mDevTypeToGpus
  }

  const createParentRow = (gpu) => {
    const isOpen = openRows.get(gpu.mDevType)
    const isSelected = !!selectedMDevTypes[gpu.mDevType]
    const requestedInstances = +selectedMDevTypes[gpu.mDevType] || 0
    return {
      isOpen: isOpen === true,
      selected: isSelected,
      cells: [
        gpu.mDevType,
        handleNonAvailableValue(gpu.name),
        handleNonAvailableValue(gpu.numberOfHeads),
        handleNonAvailableValue(gpu.frameRateLimiter),
        handleNonAvailableValue(gpu.maxResolution),
        handleNonAvailableValue(gpu.frameBuffer),
        handleNonAvailableValue(gpu.maxInstances),
        requestedInstances,
      ],
      gpu: gpu,
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
          props: { colSpan: columns.length + 2 }, // +1 for collapse, +1 for select
        },
      ],
    }
  }

  const createRows = (mDevTypesToGpus) => {
    let parentRows = []
    mDevTypesToGpus.forEach((gpus) => {
      parentRows.push(createParentRow(gpus[0]))
    })
    parentRows.sort(compareRows)
    parentRows = sortBy.direction === SortByDirection.asc ? parentRows : parentRows.reverse()

    const allRows = []
    parentRows.forEach(parentRow => {
      const parentIndex = allRows.length
      allRows.push(parentRow)
      allRows.push(createChildRow(mDevTypesToGpus.get(parentRow.gpu.mDevType), parentIndex))
    })
    return allRows
  }

  const onSort = (_event, index, direction) => {
    setSortBy({ index: index, direction: direction })
  }

  const onSelect = (_event, isSelected, _rowIndex, rowData) => {
    onGpuSelectionChange(rowData.gpu.mDevType, +isSelected)
  }

  const onCollapse = (_event, _rowIndex, isOpen, rowData) => {
    setOpenRows(openRows => new Map(openRows).set(rowData.gpu.mDevType, isOpen))
  }

  const actionResolver = (rowData, _) => {
    if (!rowData.gpu) {
      return
    }

    return [
      {
        title: msg.vmManageGpuAddActionButton(),
        isDisabled: selectedMDevTypes[rowData.gpu.mDevType] >= rowData.gpu.maxInstances,
        onClick: (_event, _rowId, rowData, _extra) => {
          onGpuSelectionChange(rowData.gpu.mDevType, selectedMDevTypes[rowData.gpu.mDevType] + 1)
        },
      },
      {
        title: msg.vmManageGpuRemoveActionButton(),
        isDisabled: selectedMDevTypes[rowData.gpu.mDevType] <= 0,
        onClick: (_event, _rowId, rowData, _extra) => {
          onGpuSelectionChange(rowData.gpu.mDevType, selectedMDevTypes[rowData.gpu.mDevType] - 1)
        },
      },
    ]
  }

  const areActionsDisabled = (rowData, _) => {
    return !rowData.gpu || !selectedMDevTypes[rowData.gpu.mDevType]
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
      rows={createRows(createMDevTypeToGpusMap(gpus))}
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
      mDevType: PropTypes.string,
      name: PropTypes.string,
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
      address: PropTypes.string,
    })),
  selectedMDevTypes: PropTypes.any,
  onGpuSelectionChange: PropTypes.func,
}

export default GpuTable
