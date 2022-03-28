import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  Table,
  TableBody,
  TableHeader,
  wrappable,
  EditableTextCell,
  cancelCellEdits,
  applyCellEdits,
  validateCellEdits,
  cellWidth,
} from '@patternfly/react-table'
import { msg } from '_/intl-messages'

const StorageConnectionsTable = ({
  type,
  connections,
  isNewConnectionOpened,
  setNewConnectionOpened,
  storageDomain,
  onCreate,
  onEdit,
  onDelete,
  onAttach,
  onDetach,
}) => {
  const columns = {
    iscsi: [
      {
        title: msg.storageConnectionsTableColAttached(),
        transforms: [wrappable, cellWidth(10)],
      },
      {
        title: msg.storageConnectionsTableColAddress(),
        transforms: [wrappable],
      },
      {
        title: msg.storageConnectionsTableColPort(),
        transforms: [wrappable, cellWidth(10)],
      },
      {
        title: msg.storageConnectionsTableColTarget(),
        transforms: [wrappable],
      },
    ],
    // add column definitions for other types of connections here
  }

  const getColumns = () => {
    return columns[type]
  }

  const createIScsiConnection = (row) => {
    return {
      address: getCellEditableValue(row.cells[1]),
      port: getCellEditableValue(row.cells[2]),
      target: getCellEditableValue(row.cells[3]),
      type: type,
    }
  }

  const connectionCreator = {
    iscsi: createIScsiConnection,
    // add implementations for connections creators here
  }

  const getConnectionFromRow = (row) => {
    return connectionCreator[type](row)
  }

  const deleteConnection = (connection) => {
    onDelete(connection.id)
  }

  const attachConnection = (connection) => {
    onAttach(connection.id, storageDomain.id)
  }

  const detachConnection = (connection) => {
    onDetach(connection.id, storageDomain.id)
  }

  const checkFieldsEdited = (row) => {
    return row.cells.some(cell => cell.props.value !== cell.props.editableValue)
  }

  const updateRows = (evt, type, isEditable, rowIndex, validationErrs) => {
    const newRows = Array.from(rows)
    const connection = newRows[rowIndex].connection

    switch (type) {
      case 'edit':
        replaceAttachedCellWithEmptyCell(newRows[rowIndex])
        newRows[rowIndex] = applyCellEdits(newRows[rowIndex], type)
        setRows(newRows)
        break
      case 'cancel':
        if (isNewConnectionOpened && rowIndex === 0) {
          setNewConnectionOpened(false)
        } else {
          newRows[rowIndex] = cancelCellEdits(newRows[rowIndex])
          replaceAttachedCellWithIconCell(newRows[rowIndex], connection)
          setRows(newRows)
        }
        break
      case 'save': {
        // Replacing the default PatternFly Table input validation mechanism
        const validationErrors = validateRow(newRows[rowIndex])
        if (validationErrors && Object.keys(validationErrors).length) {
          newRows[rowIndex] = validateCellEdits(newRows[rowIndex], type, validationErrors)
          setRows(newRows)
        } else {
          const newConnection = getConnectionFromRow(newRows[rowIndex])
          if (isNewConnectionOpened && rowIndex === 0) {
            setNewConnectionOpened(false)
            onCreate(newConnection)
          } else if (checkFieldsEdited(newRows[rowIndex])) {
            onEdit(newConnection, connection.id)
          } else {
            newRows[rowIndex] = cancelCellEdits(newRows[rowIndex])
            replaceAttachedCellWithIconCell(newRows[rowIndex], connection)
            setRows(newRows)
          }
        }
        break
      }
      default:
        break
    }
  }

  // This function replaces the regular PF Table input validation mechanism in Editable Cells, which
  // as for now doesn't have an option to apply rules on separate cells, but rather only on all the cells in a row
  // This function validates every cell according to cell.props.rules
  // returns map (rule name => array of cell names that failed validation)
  const validateRow = (row) => {
    const validationErrors = {}

    for (const cell of row.cells) {
      const testValue = cell.props.editableValue === '' ? '' : cell.props.editableValue || cell.props.value
      for (const rule of cell.props.rules) {
        if (!rule.validator(testValue)) {
          if (!validationErrors[rule.name]) {
            validationErrors[rule.name] = []
          }
          validationErrors[rule.name].push(cell.props.name)
        }
      }
    }

    return validationErrors
  }

  const replaceAttachedCellWithEmptyCell = (row) => {
    row.cells[0].props.value = ''
  }

  const replaceAttachedCellWithIconCell = (row, connection) => {
    row.cells[0].props.value = getIsAttachedIcon(connection)
  }

  const handleTextInputChange = (newValue, evt, rowIndex, cellIndex) => {
    setRows((oldRows) => {
      const newRows = Array.from(oldRows)
      newRows[rowIndex].cells[cellIndex].props.editableValue = newValue
      return newRows
    })
  }

  const createEditableTextCell = (val, isEditable, rules, rowIndex, cellIndex) => {
    return ({
      title: (value, rowIndex, cellIndex, props) => (
        <EditableTextCell
          value={value}
          rowIndex={rowIndex}
          cellIndex={cellIndex}
          props={props}
          isDisabled={!isEditable}
          handleTextInputChange={handleTextInputChange}
          inputAriaLabel='connection-property-input'
        />
      ),
      props: {
        value: val,
        name: `row${rowIndex}cell${cellIndex}`,
        rules: rules || [],
      },
    })
  }

  const getCellEditableValue = (cell) => {
    return cell.props.editableValue
  }

  const createIScsiCells = (connection, rowIndex) => {
    let cellIndex = 0
    if (!connection) {
      return [
        createEditableTextCell('', false, [], rowIndex, cellIndex++),
        createEditableTextCell('', true, [requiredRule], rowIndex, cellIndex++),
        createEditableTextCell('', true, [requiredRule, portRule], rowIndex, cellIndex++),
        createEditableTextCell('', true, [requiredRule], rowIndex, cellIndex++),
      ]
    }
    const isEditAllowed = canEditConnection(connection, storageDomain)
    return [
      createEditableTextCell(getIsAttachedIcon(connection), false, [], rowIndex, cellIndex++),
      createEditableTextCell(connection.address, isEditAllowed, [requiredRule], rowIndex, cellIndex++),
      createEditableTextCell(connection.port, isEditAllowed, [requiredRule, portRule], rowIndex, cellIndex++),
      createEditableTextCell(connection.target, isEditAllowed, [requiredRule], rowIndex, cellIndex++),
    ]
  }

  const cellsCreator = {
    iscsi: createIScsiCells,
    // add implementations for cells creators here
  }

  const getIsAttachedIcon = (connection) => {
    return connection.isAttachedToDomain ? <i className='fa fa-check' /> : ''
  }

  const createRows = (type, connections) => {
    const rows = []
    connections.forEach((connection, index) => {
      rows.push(createRow(type, connection, true, index + 1))
    })
    if (isNewConnectionOpened) {
      rows.unshift(createRow(type, null, false, 0))
      rows[0] = applyCellEdits(rows[0], 'edit', false)
    }
    return rows
  }

  const createRow = (type, connection, areActionsEnabled, rowIndex) => {
    const createCells = cellsCreator[type]
    return {
      cells: createCells(connection, rowIndex),
      connection: connection,
      isHoverable: true,
      disableActions: !areActionsEnabled,
      rowEditValidationRules: validationRules,
    }
  }

  const actionResolver = (rowData, _) => {
    return [
      {
        title: msg.storageConnectionsAttachConnectionButton(),
        onClick: (event, rowId, rowData, extra) => attachConnection(rowData.connection),
        isDisabled: rowData.connection && !canAttachConnection(rowData.connection, storageDomain),
      },
      {
        title: msg.storageConnectionsDetachConnectionButton(),
        onClick: (event, rowId, rowData, extra) => detachConnection(rowData.connection),
        isDisabled: rowData.connection && !canDetachConnection(rowData.connection, storageDomain),
      },
      {
        title: msg.storageConnectionsRemoveConnectionButton(),
        onClick: (event, rowId, rowData, extra) => deleteConnection(rowData.connection),
        isDisabled: rowData.connection && !canRemoveConnection(rowData.connection),
      },
    ]
  }

  const requiredRule = {
    name: 'required',
    validator: val => val.trim() !== '',
    errorText: msg.storageConnectionsFieldRequiredError(),
  }

  const portRule = {
    name: 'port',
    validator: val => val > 0 && val <= 0xFFFF,
    errorText: msg.storageConnectionsFieldPortError(),
  }

  const validationRules = [requiredRule, portRule]

  const [rows, setRows] = useState(createRows(type, connections))
  useEffect(() => {
    const newRows = createRows(type, connections)
    setRows(newRows)
  }, [connections, isNewConnectionOpened])

  return (
    <Table
      aria-label='Storage Connections Table'
      className='storage-connections-table'
      cells={getColumns()}
      rows={rows}
      onRowEdit={updateRows}
      variant='compact'
      actionResolver={actionResolver}
      areActionsDisabled={rowData => !!rowData.disableActions}
      dropdownPosition="left"
      dropdownDirection="down"
    >
      <TableHeader />
      <TableBody />
    </Table>
  )
}

const canEditConnection = (connection, storageDomain) => {
  return connection && (!connection.isAttachedToDomain || storageDomain.status === 'maintenance')
}

const canAttachConnection = (connection, storageDomain) => {
  return connection && (!connection.isAttachedToDomain && storageDomain.status === 'maintenance')
}

const canDetachConnection = (connection, storageDomain) => {
  return connection && (connection.isAttachedToDomain && storageDomain.status === 'maintenance')
}

const canRemoveConnection = (connection) => {
  return connection && (!connection.isAttachedToDomain)
}

StorageConnectionsTable.propTypes = {
  type: PropTypes.string,
  connections: PropTypes.array,
  isNewConnectionOpened: PropTypes.bool,
  setNewConnectionOpened: PropTypes.func,
  storageDomain: PropTypes.object,
  onCreate: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onAttach: PropTypes.func,
  onDetach: PropTypes.func,
}

export default StorageConnectionsTable
