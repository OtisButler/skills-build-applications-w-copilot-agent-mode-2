import { useEffect, useState } from 'react'
import { fetchCollection } from '../lib/api.js'

export default function useCollection(resource) {
  const [result, setResult] = useState(() => ({ resource, items: [], loading: true, error: '' }))

  useEffect(() => {
    const controller = new AbortController()

    fetchCollection(resource, { signal: controller.signal })
      .then((items) => setResult({ resource, items, loading: false, error: '' }))
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') {
          setResult({ resource, items: [], loading: false, error: requestError.message })
        }
      })

    return () => controller.abort()
  }, [resource])

  if (result.resource !== resource) return { items: [], loading: true, error: '' }
  return result
}