"use client"

import { useEffect, useState } from 'react'
import useBasketStore from '@/store/store'

export function useHydratedStore() {
  const [hydrated, setHydrated] = useState(false)
  const store = useBasketStore()

  useEffect(() => {
    // This forces a re-render once the store is hydrated on the client
    setHydrated(true)
  }, [])

  return {
    ...store,
    hydrated
  }
}