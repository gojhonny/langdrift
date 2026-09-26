'use client'

import { atomWithImmer } from 'jotai-immer'

import type { DashboardRange } from '@domain'

export const rangeAtom = atomWithImmer<DashboardRange>('90d')
