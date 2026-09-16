export const colors = {
  brand: '#f97316',
  brandBright: '#ff9500',
  dark: {
    background: '#0b0b0c',
    surface: '#151517',
    elevated: '#1b1b1e',
    text: '#f5f5f5',
    muted: '#a1a1aa'
  },
  light: {
    background: '#fafafa',
    surface: '#ffffff',
    ink: '#171717',
    muted: '#6b6b6b',
    hairline: '#ebebeb'
  },
  semantic: {
    intentional: '#3b82f6',
    aligned: '#16a34a',
    unexplained: '#dc2626',
    review: '#a855f7'
  }
} as const

export const radii = {
  control: '6px',
  card: '12px',
  feature: '24px',
  pill: '999px'
} as const

export const spacing = {
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px'
} as const

export const typography = {
  product: 'Geist, Inter, ui-sans-serif, system-ui, sans-serif',
  editorial: 'Inter, ui-sans-serif, system-ui, sans-serif',
  mono: 'Geist Mono, SFMono-Regular, Consolas, monospace'
} as const
