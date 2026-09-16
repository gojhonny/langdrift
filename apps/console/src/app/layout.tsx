import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import '@repo/react/styles.css'
import './globals.css'

export const metadata: Metadata = {
  title: 'Dashboard · Lang Drift',
  description: 'Product Vision and Drift intelligence workspace.'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="light">
      <body>{children}</body>
    </html>
  )
}
