import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import '@repo/react/styles.css'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sign in · Lang Drift',
  description: 'Continue to your Lang Drift product intelligence workspace.'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
