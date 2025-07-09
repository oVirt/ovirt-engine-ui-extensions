import { useEffect, useState, useMemo, useRef, useCallback } from 'react'

export function useDataProvider ({ fetchData, parameters = [], trigger, enabled = true, debugState = false }) {
  const [{ data, fetchError, fetchInProgress }, setState] = useState({
    data: undefined,
    fetchError: false,
    fetchInProgress: false,
  })
  const prevParams = useRef(null)
  const prevTrigger = useRef(null)
  const params = useMemo(() => ([...parameters]), [parameters])

  const debug = useCallback((msg) => {
    if (!debugState) {
      return
    }
    const state = {
      method: fetchData ? fetchData.toString().substring(0, 30) : '',
      parameters: !!parameters.length,
      trigger,
      data: !!data,
      fetchError,
      fetchInProgress,
    }
    console.log(`${msg} in state: ${JSON.stringify(state)}`)
  }, [data, debugState, fetchData, fetchError, fetchInProgress, parameters.length, trigger])

  debug('render')

  useEffect(() => {
    if (fetchInProgress || !enabled) {
      return
    }
    const paramsKey = JSON.stringify(params)

    if (data && !fetchError && prevParams.current === paramsKey) {
      // re-fetch when params changed
      return
    }

    if (fetchError && prevParams.current === paramsKey && prevTrigger.current === trigger) {
      // re-fetch when params or trigger changed
      return
    }

    setState({
      data: undefined,
      fetchError: false,
      fetchInProgress: true,
    })
    prevParams.current = paramsKey
    prevTrigger.current = trigger
    debug('start')
    fetchData(...params)
      .then(data => {
        debug('success')
        setState({
          data,
          fetchError: false,
          fetchInProgress: false,
        })
      })
      .catch(error => {
        debug('error')
        setState({
          data: undefined,
          fetchError: error,
          fetchInProgress: false,
        })
      })
  }, [fetchInProgress, enabled, data, fetchError, params, trigger, debug, fetchData])

  return useMemo(() => ({
    data,
    fetchError,
    fetchInProgress,
  }), [
    data,
    fetchError,
    fetchInProgress,
  ])
}
