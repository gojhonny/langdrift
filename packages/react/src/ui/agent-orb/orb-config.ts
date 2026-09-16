export const LANGDRIFT_ORB_CONFIG = {
  colors: {
    accent: '#EA580C',
    background: '#1B0D05',
    highlight: '#FFF0E6',
    primary: '#F97316',
    secondary: '#FB923C'
  },
  reducedMotion: 'system',
  speed: 0.82
} as const

export type LangDriftOrbColors = typeof LANGDRIFT_ORB_CONFIG.colors
