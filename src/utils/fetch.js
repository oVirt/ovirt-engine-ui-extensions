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
    ...extraHeaders
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
  const response = await fetch(engineUrl(relativePath), {
    method: 'GET',
    headers: engineRequestHeaders(extraHeaders),
    credentials: 'same-origin'
  })
  return response.json()
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
  const response = await fetch(engineUrl(relativePath), {
    method: 'POST',
    headers: engineRequestHeaders(extraHeaders),
    credentials: 'same-origin',
    body
  })
  return response.json()
}
