import getPluginApi from '../plugin-api'

function engineUrl (relativePath) {
  return getPluginApi().engineBaseUrl() + relativePath
}

function engineRequestHeaders (extraHeaders = {}) {
  return {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getPluginApi().ssoToken()}`,
    ...extraHeaders
  }
}

export async function engineGet (relativePath, extraHeaders) {
  const response = await fetch(engineUrl(relativePath), {
    method: 'GET',
    headers: engineRequestHeaders(extraHeaders),
    credentials: 'same-origin'
  })
  return response.json()
}

export async function enginePost (relativePath, body, extraHeaders) {
  const response = await fetch(engineUrl(relativePath), {
    method: 'POST',
    headers: engineRequestHeaders(extraHeaders),
    credentials: 'same-origin',
    body
  })
  return response.json()
}
