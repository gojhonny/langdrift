'use client'

import { useStore } from 'jotai'
import { useEffect } from 'react'

import { subscribeToWebsiteAtoms } from '../state'

export function StateLogger() {
  const store = useStore()

  useEffect(() => subscribeToWebsiteAtoms(store), [store])

  return null
}
