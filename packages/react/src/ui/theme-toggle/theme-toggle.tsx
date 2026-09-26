'use client'

import { Moon, Sun } from '@phosphor-icons/react'
import { Tooltip } from '@repo/react/vendors/shadcn/tooltip'

export interface ThemeToggleProps {
  label?: string
  onToggle: () => void
  theme: 'dark' | 'light'
}

export function ThemeToggle({
  label: translatedLabel,
  onToggle,
  theme
}: ThemeToggleProps) {
  const next = theme === 'dark' ? 'light' : 'dark'
  const label = translatedLabel ?? `Switch to ${next} mode`

  return (
    <Tooltip content={label}>
      <button
        aria-label={label}
        className="inline-flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent p-0 text-inherit hover:bg-[color-mix(in_srgb,currentColor_7%,transparent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current!"
        onClick={onToggle}
        type="button"
      >
        {theme === 'dark' ? (
          <Sun aria-hidden="true" size={17} />
        ) : (
          <Moon aria-hidden="true" size={17} />
        )}
      </button>
    </Tooltip>
  )
}
