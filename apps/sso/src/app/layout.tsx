import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import '@repo/react/styles.css'
import './globals.css'
import './flow.css'

export const metadata: Metadata = {
  title: 'LangDrift — Account',
  description: 'Access and set up your LangDrift organization.',
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
