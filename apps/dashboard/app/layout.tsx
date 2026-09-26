import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import '@repo/react/styles.css'
import './globals.css'
import './product-experience.css'
import './polish.css'
import './responsive.css'
import { DashboardShell } from './_lib/components/dashboard-shell/dashboard-shell'

export const metadata: Metadata = {
  title: 'LangDrift Dashboard',
  description: 'Product Vision, Drift, decisions, people, and reports.',
  applicationName: 'LangDrift',
  icons: {
    icon: [{ url: '/favicon.ico', sizes: 'any' }]
  }
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: '#fafafa'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <DashboardShell>{children}</DashboardShell>
      </body>
    </html>
  )
}
