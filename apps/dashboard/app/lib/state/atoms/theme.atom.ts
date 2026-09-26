'use client'

import { atomWithImmer } from 'jotai-immer'

import type { DashboardTheme } from '@domain'

export const themeAtom = atomWithImmer<DashboardTheme>('light')
