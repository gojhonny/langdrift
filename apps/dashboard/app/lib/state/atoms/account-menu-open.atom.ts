'use client'

// AGENT: atomWithImmer only for complex types like objects or arrays
import { atomWithImmer } from 'jotai-immer'

export const accountMenuOpenAtom = atomWithImmer(false)
