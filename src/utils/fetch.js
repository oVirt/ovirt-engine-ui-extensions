import getPluginApi from '../plugin-api'

function withTrailingSlash (path) {
  return path.endsWith('/') ? path : path + '/'
}

function withoutLeadingSlash (path) {
  return path.startsWith('/') ? path.slice(1) : path
}

function engineUrl (relativePath) {
  return withTrailingSlash(getPluginApi().engineBaseUrl()) + withoutLeadingSlash(relativePath)
}

function engineRequestHeaders (extraHeaders = {}) {
  return {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getPluginApi().ssoToken()}`,
    ...extraHeaders,
  }
}

/**
 * Initiate Engine HTTP `GET` request, expecting JSON response.
 *
 * @example
 * ```
 * const json = await engineGet(`api/vms/${vmId}`)
 * ```
 */
export async function engineGet (relativePath, extraHeaders) {
  return engineApiRequest('GET', relativePath, null, extraHeaders)
}

/**
 * Initiate Engine HTTP `POST` request, expecting JSON response.
 *
 * @example
 * ```
 * const body = JSON.stringify({ host: { id: targetHostId } })
 * const json = await enginePost(`api/vms/${vmId}/migrate`, body)
 * ```
 */
export async function enginePost (relativePath, body, extraHeaders) {
  return engineApiRequest('POST', relativePath, body, extraHeaders)
}

export async function engineDelete (relativePath) {
  return engineApiRequest('DELETE', relativePath)
}

/**
 * Initiate Engine HTTP `PUT` request, expecting JSON response.
 *
 * @example
 * ```
 * const body = JSON.stringify({ host: { id: targetHostId } })
 * const json = await enginePut(`api/vms/${vmId}/migrate`, body)
 * ```
 */
export async function enginePut (relativePath, body, extraHeaders) {
  return engineApiRequest('PUT', relativePath, body, extraHeaders)
}

/**
 * Initiate Engine HTTP request with the provided method, expecting JSON response.
 */
export async function engineApiRequest (method, relativePath, body, extraHeaders) {
  const response = await fetch(engineUrl(relativePath), {
    method: method,
    headers: engineRequestHeaders(extraHeaders),
    credentials: 'same-origin',
    body,
  })

  if (response.ok) {
    return response.json()
  }

  let jsonMessage
  try {
    // if server returned detailed error message, e.g. Vm with given ID does not exists,
    // it is stored in response.json()
    jsonMessage = await response.json()
  } catch (e) {
    // it is OK if json cannot be retrieved, we will throw error with basic
    // information
  }

  const details = jsonMessage?.fault || jsonMessage || {}
  throw new EngineError(method, response, details)
}

/**
 * Initiate Engine HTTP `POST` to the async ansible playbook execution service.
 *
 * @example
 * ```
 * ```
 *
 * @param {string} playbook The name of the ovirt playbook to execute
 * @param {string} variables Set of variables passed to the playbook
 */
export async function ansiblePlaybookPost (playbook, variables = '', executionTimeoutInMin = 0) {
  if (typeof playbook !== 'string' || !/[a-z]((-[a-z])*[a-z])?/.test(playbook)) {
    throw new Error(`Invalid playbook name: ${playbook}`)
  }
  const executionTimeoutParameter = executionTimeoutInMin > 0 ? `&execution_timeout=${executionTimeoutInMin}` : ''
  const response = await fetch(engineUrl(`services/ansible?playbook=${playbook}${executionTimeoutParameter}`), {
    method: 'POST',
    headers: engineRequestHeaders({
      'Content-Type': 'text/plain',
    }),
    credentials: 'same-origin',
    body: variables,
  })

  if (response.status !== 200) {
    return Promise.reject(new Error(`Problem running ansible playbook "${playbook}". Error: ${response.status}`))
  }

  return response.text()
}

class EngineError extends Error {
  constructor (method, { url, status, statusText }, { detail, reason }, ...params) {
    super(...params)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, EngineError)
    }

    this.name = 'EngineError'
    this.detail = detail
    this.message = `Method: ${method}, url: ${url}, status: ${status}, status text: ${statusText}`
    if (reason) {
      this.message = `${this.message}, reason: ${reason}`
    }
    if (detail) {
      if (this.detail.startsWith('[')) {
        this.detail = this.detail.substring(1)
      }
      if (this.detail.endsWith(']')) {
        this.detail = this.detail.substring(0, this.detail.length - 2)
      }
      this.message = `${this.message}, detailed message: ${this.detail}`
    }
  }
}
