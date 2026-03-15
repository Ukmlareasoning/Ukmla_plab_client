// Centralized API client for the frontend.
// Usage example:
//   import apiClient from './server'
//   const data = await apiClient('/auth/register', 'POST', { ...payload })

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://127.0.0.1:8000/api/'

async function apiClient(path, method = 'GET', body = null, extraHeaders = {}) {
  const url = `${API_BASE_URL.replace(/\/+$/, '/')}${path.replace(/^\/+/, '')}`

  const signal = extraHeaders.signal
  const headerEntries = { ...extraHeaders }
  if ('signal' in headerEntries) delete headerEntries.signal

  const headers = {
    'Content-Type': 'application/json',
    ...headerEntries,
  }

  const token = localStorage.getItem('authToken')
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const options = {
    method: method.toUpperCase(),
    headers,
    ...(signal ? { signal } : {}),
  }

  if (body && method.toUpperCase() !== 'GET') {
    options.body = body instanceof FormData ? body : JSON.stringify(body)
    if (body instanceof FormData) {
      delete options.headers['Content-Type']
    }
  }

  const response = await fetch(url, options)

  let data
  try {
    data = await response.json()
  } catch {
    data = null
  }

  return {
    ok: response.ok,
    status: response.status,
    data,
  }
}

export default apiClient

