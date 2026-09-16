import { useStore } from 'jotai'
import { useEffect } from 'react'

import { subscribeToAtoms } from './state'

export function StateLogger() {
  const store = useStore()
  useEffect(() => subscribeToAtoms(store), [store])
  return null
}
