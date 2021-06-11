import PropTypes from 'prop-types'
import React from 'react'
import { webadminToastTypes } from '_/constants'
import { msg } from '_/intl-messages'
import getPluginApi from '_/plugin-api'
import { engineGet, enginePut } from '_/utils/fetch'
import { isNumber } from '_/utils/type-validation'
import DataProvider from '_/components/helper/DataProvider'
import { createErrorMessage } from '_/utils/error-message'
import get from 'lodash/get'

const GpuDataProvider = ({children, vmId}) => {
  let allCustomProperties = []

  const fetchVm = async () => {
    return engineGet(`api/vms/` + vmId)
  }

  const fetchCluster = async (clusterId) => {
    return engineGet(`api/clusters/` + clusterId)
  }

  const fetchHosts = async (clusterName) => {
    return engineGet('api/hosts?search=cluster%3D' + clusterName)
  }

  const fetchHostDevices = async (hostId) => {
    return engineGet(`api/hosts/` + hostId + '/devices')
  }

  const fetchHostsMDevTypes = async (hostsEnvelope) => {
    if (!hostsEnvelope || !hostsEnvelope.host) {
      return []
    }
    let hostDevices = []
    let hosts = hostsEnvelope.host

    for (let i = 0; i < hosts.length; i++) {
      let devices = await fetchHostDevices(hosts[i].id)

      if (!devices || !Array.isArray(devices.host_device)) {
        continue
      }

      for (let y = 0; y < devices.host_device.length; y++) {
        let hostDevice = devices.host_device[y]
        if (get(hostDevice, ['m_dev_types', 'm_dev_type']) && hostDevice.m_dev_types.m_dev_type.length > 0) {
          let mdevs = []
          hostDevice.m_dev_types.m_dev_type.forEach(mDevType => mdevs.push(mDevType))
          hostDevices.push({
            host: hosts[i],
            product: get(hostDevice, ['product', 'name']),
            vendor: get(hostDevice, ['vendor', 'name']),
            address: hostDevice.name,
            mDevTypes: mdevs
          })
        }
      }
    }

    return hostDevices
  }

  const getCustomProperties = (vm) => {
    if (vm.custom_properties && vm.custom_properties.custom_property) {
      return vm.custom_properties.custom_property
    }
    return []
  }

  const parseMdevCustomProperty = (customProperties) => {
    let mdevCustomProperty = customProperties.find(property => property.name === 'mdev_type')
    if (mdevCustomProperty !== undefined) {
      return mdevCustomProperty.value.split(',')
    }
    return []
  }

  const getSelectedMdevs = (customProperties) => {
    let parsedMdevProperties = parseMdevCustomProperty(customProperties)
    if (isNoDisplay(customProperties)) {
      parsedMdevProperties = parsedMdevProperties.slice(1)
    }

    let selectedMdevs = []
    parsedMdevProperties.forEach(mDevType => {
      if (mDevType in selectedMdevs) {
        selectedMdevs[mDevType]++
      } else {
        selectedMdevs[mDevType] = 1
      }
    })
    return selectedMdevs
  }

  const isNoDisplay = (customProperties) => {
    let parsedMdevProperties = parseMdevCustomProperty(customProperties)
    if (parsedMdevProperties.length > 0 && parsedMdevProperties[0] === 'nodisplay') {
      return true
    }
    return false
  }

  const createGpus = (hostMDevTypes, selectedMdevs) => {
    let gpus = []
    hostMDevTypes.forEach(hostMDevType => {
      hostMDevType.mDevTypes.forEach(mDevType => {
        gpus.push(
          createGpu(
            hostMDevType.host,
            hostMDevType.product,
            hostMDevType.vendor,
            hostMDevType.address,
            mDevType,
            selectedMdevs[mDevType.name]))
      })
    })
    return gpus
  }

  // See nVidia and kernel docs for explanation of the vGPU and mDev types data
  // Nvidia: https://docs.nvidia.com/grid/latest/grid-vgpu-user-guide/index.html#vgpu-information-in-sysfs-file-system
  // Kernel: https://www.kernel.org/doc/Documentation/vfio-mediated-device.txt
  const createGpu = (host, product, vendor, address, mDevType, requestedInstances = 0) => {
    const descriptionKeyValues = parseMDevDescription(mDevType.description)
    return {
      mDevType: mDevType.name,
      name: mDevType.human_readable_name,
      host: host.name,
      requestedInstances: requestedInstances,
      availableInstances: parseStringToIntSafely(mDevType.available_instances),
      maxInstances: parseStringToIntSafely(descriptionKeyValues.get('max_instance')),
      maxResolution: descriptionKeyValues.get('max_resolution'),
      numberOfHeads: parseStringToIntSafely(descriptionKeyValues.get('num_heads')),
      frameBuffer: descriptionKeyValues.get('framebuffer'),
      frameRateLimiter: parseStringToIntSafely(descriptionKeyValues.get('frl_config')),
      product: product,
      vendor: vendor,
      address: address
    }
  }

  const parseMDevDescription = (descriptionString) => {
    if (!descriptionString) {
      return new Map()
    }

    const keyValueMap = new Map()
    const descriptionsKeyValues = descriptionString.split(',')
    descriptionsKeyValues.forEach(keyValue => {
      const keyValueParsed = keyValue.split('=')
      if (keyValueParsed.length === 2) {
        keyValueMap.set(keyValueParsed[0].trim(), keyValueParsed[1].trim())
      }
    })
    return keyValueMap
  }

  const parseStringToIntSafely = (stringValue) => {
    const parsedValue = parseInt(stringValue)
    if (isNumber(parsedValue)) {
      return parsedValue
    }
    return undefined
  }

  const fetchData = async () => {
    const vm = await fetchVm()
    const cluster = await fetchCluster(vm.cluster.id)
    const hosts = await fetchHosts(cluster.name)
    const hostMDevTypes = await fetchHostsMDevTypes(hosts)

    allCustomProperties = getCustomProperties(vm)
    const selectedMdevs = getSelectedMdevs(allCustomProperties)
    const gpus = createGpus(hostMDevTypes, selectedMdevs)
    const noDisplay = isNoDisplay(allCustomProperties)
    return {gpus: gpus, noDisplay: noDisplay}
  }

  const updateCustomProperties = (displayOn, selectedGpus) => {
    let mdevCustomProperty = allCustomProperties.find(property => property.name === 'mdev_type')
    if (mdevCustomProperty === undefined) {
      mdevCustomProperty = {name: 'mdev_type'}
      allCustomProperties.push(mdevCustomProperty)
    }

    let mDevTypes = []

    selectedGpus.forEach(gpu => {
      if (!mDevTypes.includes(gpu.mDevType)) {
        for (var i = 0; i < gpu.requestedInstances; i++) {
          mDevTypes.push(gpu.mDevType)
        }
      }
    })

    if (mDevTypes.length > 0 && !displayOn) {
      mDevTypes.unshift('nodisplay')
    }
    mdevCustomProperty.value = mDevTypes.join(',')
    if (mdevCustomProperty.value.length === 0) {
      allCustomProperties.pop(mdevCustomProperty)
    }
  }

  const saveVm = async (displayOn, selectedGpus) => {
    updateCustomProperties(displayOn, selectedGpus)
    const requestBody = {
      'custom_properties': {
        'custom_property': allCustomProperties
      }
    }

    try {
      await enginePut(`api/vms/${vmId}`, JSON.stringify(requestBody))
      getPluginApi().showToast(webadminToastTypes.success, msg.vmManageGpuSaveDataOK())
    } catch (error) {
      getPluginApi().logger().severe('Error while saving the VM. ' + createErrorMessage(error))
      getPluginApi().showToast(webadminToastTypes.danger, msg.vmManageGpuSaveDataError())
    }
  }

  return (
    <DataProvider fetchData={fetchData}>

      {({ data, fetchError, fetchInProgress, fetchAndUpdateData }) => {
        // expecting single child component
        const child = React.Children.only(children)

        // handle data loading and error scenarios
        if (fetchError) {
          getPluginApi().showToast(webadminToastTypes.danger, msg.vmManageGpuDataError())
          return null
        }

        if (fetchInProgress || !data) {
          return React.cloneElement(child, { isLoading: true })
        }

        // pass relevant data and operations to child component
        return React.cloneElement(child, {
          gpus: data.gpus,
          displayOn: !data.noDisplay,
          onSelectButtonClick: saveVm
        })
      }}

    </DataProvider>
  )
}

GpuDataProvider.propTypes = {
  children: PropTypes.element.isRequired,
  vmId: PropTypes.string.isRequired
}

export default GpuDataProvider
