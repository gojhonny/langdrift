export const LANGDRIFT_ORB_CONFIG = {
  colors: {
    accent: '#FB923C',
    background: '#FFF7ED',
    highlight: '#FFF1E6',
    primary: '#FDBA8C',
    secondary: '#FED7AA'
  },
  reducedMotion: 'system',
  speed: 0.82
} as const

export type LangDriftOrbColors = typeof LANGDRIFT_ORB_CONFIG.colors
