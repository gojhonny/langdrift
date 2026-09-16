import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import '@repo/react/styles.css'
import './globals.css'
import './followup.css'

export const metadata: Metadata = {
  title: 'LangDrift — we still in charge',
  description:
    'Visual product intelligence for understanding how products evolve relative to their vision.',
  applicationName: 'LangDrift',
  icons: { icon: '/favicon.ico' }
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: '#f7f6f2'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
