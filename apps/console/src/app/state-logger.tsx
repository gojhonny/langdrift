'use client'

import { useEffect } from 'react'

import { connectConsoleStateLogger } from './state'

export function StateLogger() {
  useEffect(() => connectConsoleStateLogger(), [])
  return null
}
