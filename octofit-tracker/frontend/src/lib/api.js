const configuredCodespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()

export const API_BASE_URL = configuredCodespaceName
  ? `https://${configuredCodespaceName}-8000.app.github.dev/api`
  : 'http://localhost:8000/api'

export function normalizeCollection(payload) {
  if (Array.isArray(payload)) return payload
  if (!payload || typeof payload !== 'object') return []

  const data = payload.data
  const candidates = [
    payload.results,
    payload.items,
    data,
    data?.results,
    data?.items,
    data?.data,
  ]

  return candidates.find(Array.isArray) ?? []
}

export async function fetchCollection(resource, { signal } = {}) {
  const response = await fetch(`${API_BASE_URL}/${resource}/`, { signal })

  if (!response.ok) {
    throw new Error(`Could not load ${resource} (${response.status})`)
  }

  return normalizeCollection(await response.json())
}

export function displayName(value) {
  if (typeof value === 'string') return value
  return value?.displayName || value?.username || value?.name || 'OctoFit member'
}

export function formatDate(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Date unavailable'
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(date)
}