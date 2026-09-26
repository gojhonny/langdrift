'use client'

import { useStore } from 'jotai'
import { useEffect } from 'react'

import { subscribeToDashboardAtoms } from './state'

export function StateLogger() {
  const store = useStore()

  useEffect(() => subscribeToDashboardAtoms(store), [store])

  return null
}
