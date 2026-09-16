import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import '@repo/react/styles.css'
import './globals.css'

export const metadata: Metadata = {
  title: 'LangDrift — we still in charge',
  description:
    'Visual product intelligence for understanding how products evolve relative to their vision.',
  applicationName: 'Lang Drift',
  icons: { icon: '/favicon.ico' }
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: '#0b0b0c'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
