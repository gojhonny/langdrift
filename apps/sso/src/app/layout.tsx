import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import '@repo/react/styles.css'
import './globals.css'
import './flow.css'
import './polish.css'
import './responsive.css'

export const metadata: Metadata = {
  title: 'LangDrift — Account',
  description: 'Access and set up your LangDrift organization.',
  applicationName: 'LangDrift',
  icons: {
    icon: [{ url: '/favicon.ico', sizes: 'any' }]
  }
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
