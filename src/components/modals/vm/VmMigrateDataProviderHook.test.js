import { act, renderHook, cleanup } from '@testing-library/react-hooks'
import { engineGet } from '_/utils/fetch'
import { useVmMigrateDataProvider } from './VmMigrateDataProvider'

jest.mock('_/utils/fetch')

const respondToUrl = function ({hosts, hostsWithAffinity}) {
  return (url) => {
    if (url.includes('check_vms_in_affinity_closure=false')) {
      return hosts
    } else {
      return hostsWithAffinity
    }
  }
}

describe('Vm Migrate Data Provider Hook', () => {
  afterEach(cleanup)
  beforeEach(() => {
    jest.clearAllMocks()
    jest.fn().mockReset()
  })
  it('should mock the call', async () => {
    engineGet.mockImplementation(() => Promise.resolve('ok'))
    expect.assertions(1)
    return expect(engineGet('api/vms/')).resolves.toEqual('ok')
  })

  it('should load only vms', async () => {
    engineGet.mockImplementation(() => Promise.resolve({vm: [{name: 'A_name', id: 'A_id'}]}))
    const [affinity, vmIds] = [false, ['A_id']]
    const { result, waitForNextUpdate } = renderHook(() => useVmMigrateDataProvider(affinity, vmIds))
    await waitForNextUpdate()
    expect(result.current.vms).toEqual([{name: 'A_name', id: 'A_id'}])
    expect(result.current.suggestAffinity).toBe(false)
  })

  it('should load vms and hosts', async () => {
    const resultGenerator = (function * () {
      const respond = respondToUrl({
        hosts: Promise.resolve({host: [{name: 'B_name', id: 'B_id'}]}),
        hostsWithAffinity: Promise.resolve({host: [{name: 'C_name', id: 'C_id'}]})
      })
      yield () => Promise.resolve({vm: [{name: 'A_name', id: 'A_id'}]})
      yield respond
      yield respond
    })()

    engineGet.mockImplementation((url) => resultGenerator.next().value(url))
    const [affinity, vmIds] = [false, ['A_id']]
    const { result, waitForNextUpdate } = renderHook(() => useVmMigrateDataProvider(affinity, vmIds))

    await waitForNextUpdate()

    expect(result.current.vms).toEqual([{name: 'A_name', id: 'A_id'}])
    expect(result.current.targetHostItems).toEqual([{text: 'B_name', value: 'B_id'}])
    expect(result.current.suggestAffinity).toBe(false)
  })

  it('should load when no hosts are available', async () => {
    const resultGenerator = (function * () {
      const respond = respondToUrl({
        hosts: Promise.resolve({}),
        hostsWithAffinity: Promise.resolve({})
      })
      yield () => Promise.resolve({vm: [{name: 'A_name', id: 'A_id'}]})
      yield respond
      yield respond
    })()

    engineGet.mockImplementation((url) => resultGenerator.next().value(url))
    const [affinity, vmIds] = [false, ['A_id']]
    const { result, waitForNextUpdate } = renderHook(() => useVmMigrateDataProvider(affinity, vmIds))

    await waitForNextUpdate()

    expect(result.current.vms).toEqual([{name: 'A_name', id: 'A_id'}])
    expect(result.current.targetHostItems).toEqual([])
    expect(result.current.suggestAffinity).toBe(false)
  })

  it('should load vms and hosts with affinity', async () => {
    const resultGenerator = (function * () {
      const respond = respondToUrl({
        hosts: Promise.resolve({host: [{name: 'B_name', id: 'B_id'}]}),
        hostsWithAffinity: Promise.resolve({host: [{name: 'C_name', id: 'C_id'}]})
      })
      yield () => Promise.resolve({vm: [{name: 'A_name', id: 'A_id'}]})
      yield respond
      yield respond
    })()

    engineGet.mockImplementation((url) => resultGenerator.next().value(url))
    const [affinity, vmIds] = [true, ['A_id']]
    const { result, waitForNextUpdate } = renderHook(() => useVmMigrateDataProvider(affinity, vmIds))

    await waitForNextUpdate()

    expect(result.current.vms).toEqual([{name: 'A_name', id: 'A_id'}])
    expect(result.current.targetHostItems).toEqual([{text: 'C_name', value: 'C_id'}])
    expect(result.current.suggestAffinity).toBe(false)
  })

  it('should fail on fetching vms due to server error ', async () => {
    engineGet.mockImplementation(() => { throw new Error('some server error') })
    const [affinity, vmIds] = [false, ['A_id']]
    const { result, waitForNextUpdate } = renderHook(() => useVmMigrateDataProvider(affinity, vmIds))
    await waitForNextUpdate()
    expect(result.current.fetchError).toEqual(new Error('some server error'))
    expect(result.current.suggestAffinity).toBe(false)
  })

  it('fails to load virtual machines due to incorrect response', async () => {
    engineGet.mockImplementation(() => Promise.resolve({data: 'some incorrect data'}))
    const [affinity, vmIds] = [false, ['A_id']]
    const { result, waitForNextUpdate } = renderHook(() => useVmMigrateDataProvider(affinity, vmIds))
    await waitForNextUpdate()
    expect(result.current.fetchError).toEqual(new Error('VmMigrateDataProvider: Failed to fetch VMs'))
  })

  it('fails to load hosts due to incorrect response', async () => {
    const resultGenerator = (function * () {
      yield Promise.resolve({vm: [{name: 'A_name', id: 'A_id'}]})
      yield Promise.resolve({host: 'some incorrect data'})
      yield Promise.resolve({host: 'some incorrect data'})
    })()

    engineGet.mockImplementation(() => resultGenerator.next().value)
    const [affinity, vmIds] = [false, ['A_id']]
    const { result, waitForNextUpdate } = renderHook(() => useVmMigrateDataProvider(affinity, vmIds))
    await waitForNextUpdate()
    expect(result.current.fetchError).toEqual(new Error('VmMigrateDataProvider: Failed to fetch target hosts'))
    expect(result.current.suggestAffinity).toBe(false)
  })

  it('should switch to hosts with affinity without re-fetch', async () => {
    const resultGenerator = (function * () {
      const respond = respondToUrl({
        hosts: Promise.resolve({host: [{name: 'B_name', id: 'B_id'}]}),
        hostsWithAffinity: Promise.resolve({host: [{name: 'C_name', id: 'C_id'}]})
      })
      yield () => Promise.resolve({vm: [{name: 'A_name', id: 'A_id'}]})
      yield respond
      yield respond
    })()

    engineGet.mockImplementation((url) => resultGenerator.next().value(url))
    let affinity, vmIds
    [affinity, vmIds] = [false, ['A_id']]
    const { result, waitForNextUpdate, rerender } = renderHook(() => useVmMigrateDataProvider(affinity, vmIds))

    await waitForNextUpdate()

    expect(result.current.vms).toEqual([{name: 'A_name', id: 'A_id'}])
    expect(result.current.targetHostItems).toEqual([{text: 'B_name', value: 'B_id'}])

    affinity = true
    await rerender()

    expect(result.current.targetHostItems).toEqual([{text: 'C_name', value: 'C_id'}])
  })

  it('should re-fetch hosts with affinity after first failure', async () => {
    const resultGenerator = (function * () {
      const respondFirst = respondToUrl({
        hosts: Promise.resolve({host: [{name: 'B_name', id: 'B_id'}]}),
        hostsWithAffinity: undefined
      })
      const passOrThrow = (promise) => {
        if (promise) {
          return promise
        }
        throw new Error('1st call failed')
      }
      yield () => Promise.resolve({vm: [{name: 'A_name', id: 'A_id'}]})
      yield (url) => passOrThrow(respondFirst(url))
      yield (url) => passOrThrow(respondFirst(url))
      yield () => Promise.resolve({host: [{name: 'C_name', id: 'C_id'}]})
    })()

    engineGet.mockImplementation((url) => resultGenerator.next().value(url))
    let affinity, vmIds
    [affinity, vmIds] = [false, ['A_id']]
    const { result, waitForNextUpdate, rerender } = renderHook(() => useVmMigrateDataProvider(affinity, vmIds))

    await waitForNextUpdate()

    expect(result.current.vms).toEqual([{name: 'A_name', id: 'A_id'}])
    expect(result.current.targetHostItems).toEqual([{text: 'B_name', value: 'B_id'}])
    expect(result.current.suggestAffinity).toBe(false)

    affinity = true
    await act(async () => {
      await rerender()
    })

    expect(result.current.targetHostItems).toEqual([{text: 'C_name', value: 'C_id'}])
    expect(result.current.suggestAffinity).toBe(false)
  })

  it('should suggest enabling affinity when no hosts available and there are hosts with affinity', async () => {
    const resultGenerator = (function * () {
      const respond = respondToUrl({
        hosts: Promise.resolve({}),
        hostsWithAffinity: Promise.resolve({host: [{name: 'C_name', id: 'C_id'}]})
      })
      yield () => Promise.resolve({vm: [{name: 'A_name', id: 'A_id'}]})
      yield respond
      yield respond
    })()

    engineGet.mockImplementation((url) => resultGenerator.next().value(url))
    const [affinity, vmIds] = [false, ['A_id']]
    const { result, waitForNextUpdate } = renderHook(() => useVmMigrateDataProvider(affinity, vmIds))
    await waitForNextUpdate()
    expect(result.current.suggestAffinity).toBe(true)
  })
})
