'use client'

import { create } from 'zustand'

export type DashboardTheme = 'dark' | 'light'
export type EvolutionClassification =
  | 'all'
  | 'intentional'
  | 'review'
  | 'unexplained'
export type EvolutionGroup = 'event' | 'product-area' | 'team'

interface DashboardState {
  accountMenuOpen: boolean
  classification: EvolutionClassification
  groupBy: EvolutionGroup
  notificationsOpen: boolean
  productMenuOpen: boolean
  range: '30d' | '90d' | '1y' | 'all'
  selectedPoint: number
  selectedProduct: string
  theme: DashboardTheme
  voiceOpen: boolean
  setClassification: (classification: EvolutionClassification) => void
  setGroupBy: (groupBy: EvolutionGroup) => void
  setRange: (range: DashboardState['range']) => void
  setSelectedPoint: (point: number) => void
  setSelectedProduct: (product: string) => void
  setTheme: (theme: DashboardTheme) => void
  toggleAccountMenu: () => void
  toggleNotifications: () => void
  toggleProductMenu: () => void
  toggleVoice: () => void
}

export const useDashboardStore = create<DashboardState>((set) => ({
  accountMenuOpen: false,
  classification: 'all',
  groupBy: 'event',
  notificationsOpen: false,
  productMenuOpen: false,
  range: '90d',
  selectedPoint: 4,
  selectedProduct: 'Atlas Home Hub',
  theme: 'light',
  voiceOpen: false,
  setClassification: (classification) => set({ classification }),
  setGroupBy: (groupBy) => set({ groupBy }),
  setRange: (range) => set({ range }),
  setSelectedPoint: (selectedPoint) => set({ selectedPoint }),
  setSelectedProduct: (selectedProduct) =>
    set({ productMenuOpen: false, selectedProduct }),
  setTheme: (theme) => set({ theme }),
  toggleAccountMenu: () =>
    set((state) => ({ accountMenuOpen: !state.accountMenuOpen })),
  toggleNotifications: () =>
    set((state) => ({ notificationsOpen: !state.notificationsOpen })),
  toggleProductMenu: () =>
    set((state) => ({ productMenuOpen: !state.productMenuOpen })),
  toggleVoice: () => set((state) => ({ voiceOpen: !state.voiceOpen }))
}))

function snapshot(state: DashboardState) {
  return Object.fromEntries(
    Object.entries(state).filter(([, value]) => typeof value !== 'function')
  )
}

let loggerConnected = false

export function connectDashboardStateLogger() {
  if (!loggerConnected) {
    loggerConnected = true
    console.log('LangDrift Zustand:', {
      updates: 0,
      state: snapshot(useDashboardStore.getState())
    })
  }

  return useDashboardStore.subscribe((state, previous) => {
    console.log('LangDrift Zustand:', {
      previous: snapshot(previous),
      state: snapshot(state)
    })
  })
}
