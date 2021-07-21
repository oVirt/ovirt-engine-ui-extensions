import React from 'react'
import PropTypes from 'prop-types'
import { objectUtilization as objectUtilizationShape } from './dataShapes'
import { searchPrefixes, searchFields, webadminPlaces } from '_/constants'
import { msg } from '_/intl-messages'
import { applySearch } from '_/utils/webadmin-search'

import { Title } from '@patternfly/react-core'
import PluginApiModal from '_/components/modals/PluginApiModal'
import ObjectUtilizationList from './ObjectUtilizationList'

const UtilizationDialog = ({
  show = false,
  onClose = () => {},
  title,
  utilizationFooterLabel,
  hosts,
  storage,
  vms,
  unit,
  thresholds,
}) => (
  <PluginApiModal
    isOpen={show}
    onClose={onClose}
    title={title}
    className='overutilization-dialog'
    aria-label={`utilization dialog ${title}`}
    header={(
      <Title headingLevel='h1' size='xl'>
        {title}
      </Title>
    )}
  >
    {hosts && (
      <ObjectUtilizationList
        title={
          msg.dashboardUtilizationCardDialogHostListTitle({
            hostCount: hosts.length,
          })
        }
        data={hosts}
        unit={unit}
        emptyListText={msg.dashboardUtilizationCardDialogEmptyHostList()}
        thresholds={thresholds}
        utilizationFooterLabel={utilizationFooterLabel}
        onObjectNameClick={dataItem => {
          applySearch(webadminPlaces.host, searchPrefixes.host, [{
            name: searchFields.name,
            values: [dataItem.name],
          }])
        }}
      />
    )}

    {storage && (
      <ObjectUtilizationList
        title={
          msg.dashboardUtilizationCardDialogStorageListTitle({
            storageCount: storage.length,
          })
        }
        data={storage}
        unit={unit}
        emptyListText={msg.dashboardUtilizationCardDialogEmptyStorageList()}
        thresholds={thresholds}
        utilizationFooterLabel={utilizationFooterLabel}
        onObjectNameClick={dataItem => {
          applySearch(webadminPlaces.storage, searchPrefixes.storage, [{
            name: searchFields.name,
            values: [dataItem.name],
          }])
        }}
      />
    )}

    {vms && (
      <ObjectUtilizationList
        title={
          msg.dashboardUtilizationCardDialogVmListTitle({
            vmCount: vms.length,
          })
        }
        data={vms}
        unit={unit}
        emptyListText={msg.dashboardUtilizationCardDialogEmptyVmList()}
        thresholds={thresholds}
        utilizationFooterLabel={utilizationFooterLabel}
        onObjectNameClick={dataItem => {
          applySearch(webadminPlaces.vm, searchPrefixes.vm, [{
            name: searchFields.name,
            values: [dataItem.name],
          }])
        }}
      />
    )}
  </PluginApiModal>
)

UtilizationDialog.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string.isRequired,
  utilizationFooterLabel: ObjectUtilizationList.propTypes.utilizationFooterLabel,
  hosts: PropTypes.arrayOf(objectUtilizationShape),
  storage: PropTypes.arrayOf(objectUtilizationShape),
  vms: PropTypes.arrayOf(objectUtilizationShape),
  unit: PropTypes.string.isRequired,
  thresholds: ObjectUtilizationList.propTypes.thresholds.isRequired,
}

export default UtilizationDialog
