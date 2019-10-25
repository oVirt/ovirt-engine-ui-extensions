import '@patternfly/react-core/dist/styles/base.css'
import {
  Bullseye,
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
  EmptyStateIcon,
  TextContent,
  TextList,
  TextListVariants,
  TextListItem,
  TextListItemVariants,
  Title
} from '@patternfly/react-core'
import { expandable, sortable, SortByDirection, Table, TableBody, TableHeader } from '@patternfly/react-table'
import { SearchIcon } from '@patternfly/react-icons'
import PropTypes from 'prop-types'
import React from 'react'
import { msg } from '_/intl-messages'

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

  const stringCompare = (a, b) => {
    return a < b ? -1 : a > b ? 1 : 0
  }

  const compareRows = (a, b) => {
    let cellIndex = sortBy.index - 2
    let aNumberPart = parseInt(a.cells[cellIndex].match(/[0-9]+$/))
    let aStringPart = a.cells[cellIndex].replace(/[0-9]+$/, '')
    let bNumberPart = parseInt(b.cells[cellIndex].match(/[0-9]+$/))
    let bStringPart = b.cells[cellIndex].replace(/[0-9]+$/, '')

    if (!isNaN(aNumberPart) && !isNaN(bNumberPart)) {
      if (aStringPart !== bStringPart) {
        return stringCompare(aStringPart, bStringPart)
      } else {
        let aNumber = parseInt(aNumberPart, 10)
        let bNumber = parseInt(bNumberPart, 10)
        return aNumber - bNumber
      }
    } else {
      return stringCompare(a.cells[cellIndex], b.cells[cellIndex])
    }
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
          gpu.availableInstances === undefined ? 'N/A' : gpu.availableInstances,
          gpu.maxInstances === undefined ? 'N/A' : gpu.maxInstances,
          gpu.maxResolution === undefined ? 'N/A' : gpu.maxResolution
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
              <React.Fragment>
                <TextContent>
                  <TextList component={TextListVariants.dl}>
                    <TextListItem component={TextListItemVariants.dt}>{msg.vmManageGpuTableVendor()}</TextListItem>
                    <TextListItem component={TextListItemVariants.dd}>{parentRow.gpu.vendor === undefined ? 'N/A' : parentRow.gpu.vendor}</TextListItem>
                    <TextListItem component={TextListItemVariants.dt}>{msg.vmManageGpuTableProduct()}</TextListItem>
                    <TextListItem component={TextListItemVariants.dd}>{parentRow.gpu.product === undefined ? 'N/A' : parentRow.gpu.product}</TextListItem>
                    <TextListItem component={TextListItemVariants.dt}>{msg.vmManageGpuTableNumberOfHeads()}</TextListItem>
                    <TextListItem component={TextListItemVariants.dd}>{parentRow.gpu.numberOfHeads === undefined ? 'N/A' : parentRow.gpu.numberOfHeads}</TextListItem>
                    <TextListItem component={TextListItemVariants.dt}>{msg.vmManageGpuTableFrameRateLimiter()}</TextListItem>
                    <TextListItem component={TextListItemVariants.dd}>{parentRow.gpu.frameRateLimiter === undefined ? 'N/A' : parentRow.gpu.frameRateLimiter}</TextListItem>
                    <TextListItem component={TextListItemVariants.dt}>{msg.vmManageGpuTableFrameBuffer()}</TextListItem>
                    <TextListItem component={TextListItemVariants.dd}>{parentRow.gpu.frameBuffer === undefined ? 'N/A' : parentRow.gpu.frameBuffer}</TextListItem>
                  </TextList>
                </TextContent>
              </React.Fragment>
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
    setOpenRows(openRows => {
      const tmp = new Map(openRows)
      tmp.set(rowData.gpu.id, isOpen)
      return tmp
    })
  }

  if (gpus.length === 0) {
    return (
      <Table cells={columns} rows={emptyTableRows}>
        <TableHeader />
        <TableBody />
      </Table>
    )
  } else {
    return (
      <Table
        aria-label='Simple Table'
        cells={columns}
        rows={createRows(gpus)}
        onSelect={onSelect}
        canSelectAll={false}
        onSort={onSort}
        sortBy={sortBy}
        onCollapse={onCollapse}>
        <TableHeader />
        <TableBody />
      </Table>
    )
  }
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
