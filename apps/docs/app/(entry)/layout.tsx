import type { ReactNode } from 'react'

export default function EntryLayout({
  children
}: Readonly<{ children: ReactNode }>) {
  return (
    <html dir="ltr" lang="en">
      <body>{children}</body>
    </html>
  )
}
