import PropTypes from 'prop-types'
import React from 'react'
import { webadminToastTypes } from '_/constants'
import { msg } from '_/intl-messages'
import getPluginApi from '_/plugin-api'
import { engineDelete, engineGet, enginePost } from '_/utils/fetch'
import { isNumber } from '_/utils/type-validation'
import DataProvider from '_/components/helper/DataProvider'
import { createErrorMessage } from '_/utils/error-message'
import get from 'lodash/get'

const GpuDataProvider = ({ children, vmId }) => {
  const fetchVm = async () => {
    return engineGet(`api/vms/${vmId}`)
  }

  const fetchVmMdevDevices = async () => {
    return engineGet(`api/vms/${vmId}/mediateddevices`)
  }

  const fetchCluster = async (clusterId) => {
    return engineGet(`api/clusters/${clusterId}`)
  }

  const fetchHosts = async (clusterName) => {
    return engineGet(`api/hosts?search=cluster%3D${clusterName}`)
  }

  const fetchHostDevices = async (hostId) => {
    return engineGet(`api/hosts/${hostId}/devices`)
  }

  const fetchHostsMDevTypes = async (hostsEnvelope) => {
    if (!hostsEnvelope || !hostsEnvelope.host) {
      return []
    }
    const hostDevices = []
    const hosts = hostsEnvelope.host

    for (let i = 0; i < hosts.length; i++) {
      const devices = await fetchHostDevices(hosts[i].id)

      if (!devices || !Array.isArray(devices.host_device)) {
        continue
      }

      for (let y = 0; y < devices.host_device.length; y++) {
        const hostDevice = devices.host_device[y]
        if (get(hostDevice, ['m_dev_types', 'm_dev_type']) && hostDevice.m_dev_types.m_dev_type.length > 0) {
          const mdevs = []
          hostDevice.m_dev_types.m_dev_type.forEach(mDevType => mdevs.push(mDevType))
          hostDevices.push({
            host: hosts[i],
            product: get(hostDevice, ['product', 'name']),
            vendor: get(hostDevice, ['vendor', 'name']),
            address: hostDevice.name,
            mDevTypes: mdevs,
          })
        }
      }
    }

    return hostDevices
  }

  const getSelectedMdevs = (mdevDevices) => {
    const parsedMdevProperties = mdevDevices?.vm_mediated_device?.map(mdev => getMdevDeviceSpecParam(mdev, 'mdevType')) || []
    const selectedMdevs = []
    parsedMdevProperties.forEach(mDevType => {
      if (mDevType in selectedMdevs) {
        selectedMdevs[mDevType]++
      } else {
        selectedMdevs[mDevType] = 1
      }
    })
    return selectedMdevs
  }

  const isNoDisplay = (mdevDevices) => {
    return getMdevDeviceSpecParam(mdevDevices?.vm_mediated_device?.[0], 'nodisplay') === 'true'
  }

  const getMdevDeviceSpecParam = (mdevDevice, name) => {
    return mdevDevice?.spec_params?.property?.find(specParam => specParam.name === name)?.value
  }

  const createGpus = (hostMDevTypes, selectedMdevs) => {
    const gpus = []
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

  const countAggregatedMaxInstances = (gpus) => {
    // count how many instances of a mdev type has each host (host can have more cards)
    const aggregatedMaxInstances = {}
    gpus.forEach((gpu) => {
      if (gpu.maxInstances) {
        if (!(gpu.mDevType in aggregatedMaxInstances)) {
          aggregatedMaxInstances[gpu.mDevType] = {}
        }

        const aggregatedMaxInstancesPerHosts = aggregatedMaxInstances[gpu.mDevType]
        if (gpu.host in aggregatedMaxInstancesPerHosts) {
          aggregatedMaxInstancesPerHosts[gpu.host] += gpu.maxInstances
        } else {
          aggregatedMaxInstancesPerHosts[gpu.host] = gpu.maxInstances
        }
      }
    })

    // find the maximal number of instances of a given mdev type across all hosts
    gpus.forEach((gpu) => {
      if (gpu.mDevType in aggregatedMaxInstances && gpu.host in aggregatedMaxInstances[gpu.mDevType]) {
        const max = Math.max(...Object.values(aggregatedMaxInstances[gpu.mDevType]))
        gpu.aggregatedMaxInstances = Number.isFinite(max) ? max : undefined
      }
    })
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
      address: address,
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
    const vmMdevDevices = await fetchVmMdevDevices()
    const cluster = await fetchCluster(vm.cluster.id)
    const hosts = await fetchHosts(cluster.name)
    const hostMDevTypes = await fetchHostsMDevTypes(hosts)

    const selectedMdevs = getSelectedMdevs(vmMdevDevices)
    const gpus = createGpus(hostMDevTypes, selectedMdevs)
    countAggregatedMaxInstances(gpus)
    const noDisplay = isNoDisplay(vmMdevDevices)
    return { gpus: gpus, noDisplay: noDisplay }
  }

  const deleteAllMdevDevices = async () => {
    const mdevDevices = await fetchVmMdevDevices()
    if (mdevDevices?.vm_mediated_device) {
      return Promise.all(mdevDevices.vm_mediated_device.map((mdevDevice) => deleteMdevDevice(mdevDevice.id)))
    } else {
      return Promise.resolve()
    }
  }

  const deleteMdevDevice = async (deviceId) => {
    return engineDelete(`api/vms/${vmId}/mediateddevices/${deviceId}`)
  }

  const addAllMdevDevices = async (displayOn, allGpus) => {
    // the allGpus contains all gpus from all hosts, it can contain duplicate mdev type names
    const processedMdevs = new Set()

    return Promise.all(allGpus.map(gpu => {
      if (!processedMdevs.has(gpu.mDevType)) {
        processedMdevs.add(gpu.mDevType)
        return addMdevDevices(gpu, displayOn)
      } else {
        return Promise.resolve()
      }
    }))
  }

  const addMdevDevices = async (gpu, displayOn) => {
    const promises = []
    for (let i = 0; i < gpu.requestedInstances; i++) {
      promises.push(addMdevDevice(gpu.mDevType, displayOn))
    }
    return Promise.all(promises)
  }

  const addMdevDevice = async (mDevType, displayOn) => {
    const requestBody = {
      'spec_params': {
        'property': [
          {
            name: 'nodisplay',
            value: !displayOn,
          },
          {
            name: 'mdevType',
            value: mDevType,
          },
        ],
      },
    }
    return enginePost(`api/vms/${vmId}/mediateddevices`, JSON.stringify(requestBody))
  }

  const saveVm = async (displayOn, allGpus) => {
    try {
      await deleteAllMdevDevices()
      await addAllMdevDevices(displayOn, allGpus)

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
          onSelectButtonClick: saveVm,
        })
      }}

    </DataProvider>
  )
}

GpuDataProvider.propTypes = {
  children: PropTypes.element.isRequired,
  vmId: PropTypes.string.isRequired,
}

export default GpuDataProvider
