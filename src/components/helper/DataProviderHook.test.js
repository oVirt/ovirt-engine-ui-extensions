import { renderHook, act, cleanup } from '@testing-library/react-hooks'
import { useDataProvider } from './DataProviderHook'

const createCondition = (returnValue) => {
  let blocked = true
  const isBlocked = () => blocked
  const blockFetchUntilCondition = async () => {
    while (isBlocked()) {
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
    return returnValue
  }
  const unblock = () => { blocked = false }
  return { blockFetchUntilCondition, unblock }
}

describe('Data Provider Hook', () => {
  afterEach(cleanup)
  beforeEach(cleanup)
  it('should report empty state when not triggered', async () => {
    const fetchData = () => Promise.reject(new Error('some server error'))
    const { result } = renderHook(() => useDataProvider({ fetchData, enabled: false }))

    expect(result.current.fetchError).toBe(false)
    expect(result.current.fetchInProgress).toBe(false)
    expect(result.current.data).toBeUndefined()
  })

  it('should return the same object on re-render', async () => {
    const fetchData = () => Promise.reject(new Error('some server error'))
    const { result, rerender } = renderHook(() => useDataProvider({ fetchData, enabled: false }))

    const firstResult = result.current

    await act(async () => {
      await rerender()
    })

    expect(result.current).toBe(firstResult)
  })

  it('should report error when fetch failed on re-render', async () => {
    const { blockFetchUntilCondition, unblock } = createCondition('some data')
    const fetchData = () => blockFetchUntilCondition().then(() => { throw new Error('some server error') })
    const { result, waitForNextUpdate } = renderHook(() => useDataProvider({ fetchData }))

    unblock()
    await waitForNextUpdate()

    expect(result.current.fetchError).toEqual(new Error('some server error'))
    expect(result.current.fetchInProgress).toBe(false)
    expect(result.current.data).toBeUndefined()
  })

  it('should retireve data via useEffect when immediate flag is set', async () => {
    const { blockFetchUntilCondition, unblock } = createCondition('some data')
    const fetchData = () => blockFetchUntilCondition()
    const { result, waitForNextUpdate } = renderHook(() => useDataProvider({ fetchData }))

    unblock()
    await waitForNextUpdate()

    expect(result.current.fetchError).toEqual(false)
    expect(result.current.fetchInProgress).toBe(false)
    expect(result.current.data).toBe('some data')
  })

  it('should cache data once fetched and skip subsequent fetches on re-render', async () => {
    const { blockFetchUntilCondition, unblock } = createCondition('1st response')
    const resultGenerator = (function* () {
      yield blockFetchUntilCondition()
      yield Promise.resolve('2nd response')
    }())
    const fetchData = () => resultGenerator.next().value
    const { result, rerender, waitForValueToChange } = renderHook(() => useDataProvider({ fetchData }))

    unblock()
    await waitForValueToChange(() => result.current.data)

    expect(result.current.fetchError).toEqual(false)
    expect(result.current.fetchInProgress).toBe(false)
    expect(result.current.data).toBe('1st response')

    await act(async () => {
      await rerender()
    })

    expect(result.current.fetchError).toEqual(false)
    expect(result.current.fetchInProgress).toBe(false)
    expect(result.current.data).toBe('1st response')
  })

  it('should not re-fetch (after first fetch failed) on re-rerender', async () => {
    const { blockFetchUntilCondition, unblock } = createCondition('1st response')
    const resultGenerator = (function* () {
      yield blockFetchUntilCondition().then(() => {
        throw new Error('1st call failed')
      })
      yield Promise.resolve('2nd response')
    }())
    const fetchData = () => resultGenerator.next().value
    const { result, rerender, waitForValueToChange } = renderHook(() => useDataProvider({ fetchData }))

    unblock()
    await waitForValueToChange(() => result.current.fetchError)

    expect(result.current.fetchError).toEqual(new Error('1st call failed'))
    expect(result.current.fetchInProgress).toBe(false)
    expect(result.current.data).toBeUndefined()

    await act(async () => {
      await rerender()
    })

    expect(result.current.fetchError).toEqual(new Error('1st call failed'))
    expect(result.current.fetchInProgress).toBe(false)
    expect(result.current.data).toBeUndefined()
  })

  it('should retrieve data when watched value has changed and first call has failed', async () => {
    let trigger = 'OFF'
    const { blockFetchUntilCondition, unblock } = createCondition('1st response')
    const resultGenerator = (function* () {
      yield blockFetchUntilCondition().then(() => {
        throw new Error('1st call failed')
      })
      yield Promise.resolve('2nd response')
    }())
    const fetchData = () => resultGenerator.next().value
    const { result, rerender, waitForValueToChange } = renderHook(() => useDataProvider({ fetchData, trigger, parameters: [true] }))

    unblock()
    await waitForValueToChange(() => result.current.fetchError)

    expect(result.current.fetchError).toEqual(new Error('1st call failed'))
    expect(result.current.fetchInProgress).toBe(false)
    expect(result.current.data).toBeUndefined()

    trigger = 'ON'

    await act(async () => {
      await rerender()
    })

    expect(result.current.fetchError).toEqual(false)
    expect(result.current.fetchInProgress).toBe(false)
    expect(result.current.data).toBe('2nd response')
  })

  it('should not retrieve data when watched value has changed and first call has succedded', async () => {
    let trigger = 'OFF'
    const { blockFetchUntilCondition, unblock } = createCondition('1st response')
    const resultGenerator = (function* () {
      yield blockFetchUntilCondition()
      yield Promise.resolve('2nd response')
    }())
    const fetchData = () => resultGenerator.next().value
    const { result, rerender, waitForValueToChange } = renderHook(() => useDataProvider({ fetchData, trigger, parameters: [true] }))

    unblock()
    await waitForValueToChange(() => result.current.data)

    expect(result.current.fetchError).toEqual(false)
    expect(result.current.fetchInProgress).toBe(false)
    expect(result.current.data).toBe('1st response')

    trigger = 'ON'

    await act(async () => {
      await rerender()
    })

    expect(result.current.fetchError).toEqual(false)
    expect(result.current.fetchInProgress).toBe(false)
    expect(result.current.data).toBe('1st response')
  })

  it('should retrieve data when watched value has changed and before both failure and success were reported', async () => {
    let trigger = 'OFF'
    const { blockFetchUntilCondition, unblock } = createCondition('2nd response')
    const resultGenerator = (function* () {
      yield Promise.resolve('1st response')
      yield blockFetchUntilCondition().then(() => {
        throw new Error('2nd call failed')
      })
      yield Promise.resolve('3rd response')
    }())
    const fetchData = () => resultGenerator.next().value
    let parameter = 'FIRST'
    const { result, rerender, waitForValueToChange } = renderHook(() => useDataProvider({ fetchData, trigger, parameters: [parameter] }))

    await waitForValueToChange(() => result.current.data)

    expect(result.current.fetchError).toEqual(false)
    expect(result.current.fetchInProgress).toBe(false)
    expect(result.current.data).toBe('1st response')

    unblock()
    parameter = 'SECOND'
    await act(async () => {
      await rerender()
    })

    expect(result.current.fetchError).toEqual(new Error('2nd call failed'))
    expect(result.current.fetchInProgress).toBe(false)
    expect(result.current.data).toBeUndefined()

    trigger = 'ON'
    await act(async () => {
      await rerender()
    })

    expect(result.current.fetchError).toEqual(false)
    expect(result.current.fetchInProgress).toBe(false)
    expect(result.current.data).toBe('3rd response')
  })

  it('should report fetch  in progress', async () => {
    const { blockFetchUntilCondition, unblock } = createCondition('some data')
    const fetchData = () => blockFetchUntilCondition()
    const { result, waitForNextUpdate } = renderHook(() => useDataProvider({ fetchData }))

    expect(result.current.fetchError).toEqual(false)
    // expect(result.current.fetchInProgress).toBe(true)
    expect(result.current.data).toBeUndefined()

    unblock()
    await waitForNextUpdate()

    expect(result.current.fetchError).toEqual(false)
    expect(result.current.fetchInProgress).toBe(false)
    expect(result.current.data).toBe('some data')
  })

  it('should skip 2nd fetch if first in progress', async () => {
    const { blockFetchUntilCondition, unblock } = createCondition('some data')

    const resultGenerator = (function* () {
      yield blockFetchUntilCondition()
      yield Promise.resolve('2nd response')
    }())
    const fetchData = () => resultGenerator.next().value
    const { result, waitForNextUpdate, rerender } = renderHook(() => useDataProvider({ fetchData }))

    expect(result.current.fetchError).toEqual(false)
    // expect(result.current.fetchInProgress).toBe(true)
    expect(result.current.data).toBeUndefined()

    // no fetch after hook re-render
    await act(async () => {
      await rerender()
    })

    expect(result.current.fetchError).toEqual(false)
    expect(result.current.fetchInProgress).toBe(true)
    expect(result.current.data).toBeUndefined()

    unblock()

    await waitForNextUpdate()
    expect(result.current.fetchError).toEqual(false)
    expect(result.current.fetchInProgress).toBe(false)
    expect(result.current.data).toBe('some data')
  })
})
