'use client'

import { create } from 'zustand'

export type ConsoleTheme = 'dark' | 'light'
export type EvolutionClassification = 'all' | 'intentional' | 'review' | 'unexplained'
export type EvolutionGroup = 'event' | 'product-area' | 'team'

export interface ConsoleToast {
  message: string
  open: boolean
  tone: 'info' | 'success' | 'warning'
}

interface ConsoleState {
  accountMenuOpen: boolean
  classification: EvolutionClassification
  groupBy: EvolutionGroup
  notificationsOpen: boolean
  productMenuOpen: boolean
  range: '30d' | '90d' | '1y' | 'all'
  searchOpen: boolean
  searchQuery: string
  selectedPoint: number
  selectedProduct: string
  theme: ConsoleTheme
  toast: ConsoleToast
  voiceOpen: boolean
  closeToast: () => void
  notify: (message: string, tone?: ConsoleToast['tone']) => void
  setClassification: (classification: EvolutionClassification) => void
  setGroupBy: (groupBy: EvolutionGroup) => void
  setRange: (range: ConsoleState['range']) => void
  setSearchQuery: (query: string) => void
  setSelectedPoint: (point: number) => void
  setSelectedProduct: (product: string) => void
  setTheme: (theme: ConsoleTheme) => void
  toggleAccountMenu: () => void
  toggleNotifications: () => void
  toggleProductMenu: () => void
  toggleSearch: () => void
  toggleVoice: () => void
}

export const useConsoleStore = create<ConsoleState>((set) => ({
  accountMenuOpen: false,
  classification: 'all',
  groupBy: 'event',
  notificationsOpen: false,
  productMenuOpen: false,
  range: '90d',
  searchOpen: false,
  searchQuery: '',
  selectedPoint: 4,
  selectedProduct: 'Atlas Home Hub',
  theme: 'light',
  toast: { message: '', open: false, tone: 'info' },
  voiceOpen: false,
  closeToast: () => set((state) => ({ toast: { ...state.toast, open: false } })),
  notify: (message, tone = 'info') =>
    set({ toast: { message, open: true, tone } }),
  setClassification: (classification) => set({ classification }),
  setGroupBy: (groupBy) => set({ groupBy }),
  setRange: (range) => set({ range }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
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
  toggleSearch: () => set((state) => ({ searchOpen: !state.searchOpen })),
  toggleVoice: () => set((state) => ({ voiceOpen: !state.voiceOpen }))
}))

function snapshot(state: ConsoleState) {
  return Object.fromEntries(
    Object.entries(state).filter(([, value]) => typeof value !== 'function')
  )
}

let loggerConnected = false

export function connectConsoleStateLogger() {
  if (!loggerConnected) {
    loggerConnected = true
    console.log('LangDrift Zustand:', { updates: 0, state: snapshot(useConsoleStore.getState()) })
  }

  return useConsoleStore.subscribe((state, previous) => {
    console.log('LangDrift Zustand:', {
      previous: snapshot(previous),
      state: snapshot(state)
    })
  })
}
