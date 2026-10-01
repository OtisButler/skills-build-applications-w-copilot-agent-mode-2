import { useEffect, useState } from 'react'
import { fetchCollection } from '../lib/api.js'

export default function useCollection(endpoint) {
  const [result, setResult] = useState(() => ({ endpoint, items: [], loading: true, error: '' }))

  useEffect(() => {
    const controller = new AbortController()

    fetchCollection(endpoint, { signal: controller.signal })
      .then((items) => setResult({ endpoint, items, loading: false, error: '' }))
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') {
          setResult({ endpoint, items: [], loading: false, error: requestError.message })
        }
      })

    return () => controller.abort()
  }, [endpoint])

  if (result.endpoint !== endpoint) return { items: [], loading: true, error: '' }
  return result
}