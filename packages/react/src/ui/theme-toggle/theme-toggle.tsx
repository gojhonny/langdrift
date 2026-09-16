'use client'

import { Moon, Sun } from '@phosphor-icons/react'

export interface ThemeToggleProps {
  onToggle: () => void
  theme: 'dark' | 'light'
}

export function ThemeToggle({ onToggle, theme }: ThemeToggleProps) {
  const next = theme === 'dark' ? 'light' : 'dark'
  const label = `Switch to ${next} mode`

  return (
    <span className="ld-theme-toggle-wrap">
      <button
        aria-label={label}
        className="ld-theme-toggle"
        onClick={onToggle}
        type="button"
      >
        {theme === 'dark' ? <Sun aria-hidden="true" size={17} /> : <Moon aria-hidden="true" size={17} />}
      </button>
      <span className="ld-theme-tooltip" role="tooltip">{label}</span>
    </span>
  )
}
