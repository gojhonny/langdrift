'use client'

import { Moon, Sun } from '@phosphor-icons/react'

export interface ThemeToggleProps {
  onToggle: () => void
  theme: 'dark' | 'light'
}

export function ThemeToggle({ onToggle, theme }: ThemeToggleProps) {
  const next = theme === 'dark' ? 'light' : 'dark'

  return (
    <button
      aria-label={`Switch to ${next} theme`}
      className="ld-theme-toggle"
      onClick={onToggle}
      title={`Switch to ${next} theme`}
      type="button"
    >
      {theme === 'dark' ? <Sun aria-hidden="true" size={17} /> : <Moon aria-hidden="true" size={17} />}
    </button>
  )
}
