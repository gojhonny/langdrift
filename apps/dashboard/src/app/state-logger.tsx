'use client'

import { useEffect } from 'react'

import { connectDashboardStateLogger } from './state'

export function StateLogger() {
  useEffect(() => connectDashboardStateLogger(), [])
  return null
}
