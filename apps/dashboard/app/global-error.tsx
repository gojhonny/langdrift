'use client'

import { routeStateMessages } from '@i18n/route-state.messages'
import './globals.css'

interface GlobalErrorProps {
  retry: () => void
}

export default function GlobalError(props: GlobalErrorProps) {
  const { retry } = props

  // This boundary also handles a failed locale provider or root layout.
  const messages = routeStateMessages.en

  return (
    <html className="min-h-full" lang="en" data-theme="light">
      <body className="m-0 min-h-full bg-background font-sans text-ink [transition:background_180ms_ease,color_180ms_ease]">
        <title>{messages.globalErrorTitle}</title>
        <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col items-start justify-center gap-4 px-6 py-12">
          <div role="alert">
            <h1 className="m-0 text-2xl font-semibold tracking-tight">
              {messages.globalErrorTitle}
            </h1>
            <p className="mb-0 text-sm leading-relaxed">
              {messages.globalErrorDescription}
            </p>
          </div>
          <button
            className="min-h-11 cursor-pointer rounded-md border border-ink bg-ink px-4 py-2 text-sm font-medium text-surface focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-4 focus-visible:outline-ink"
            onClick={retry}
            type="button"
          >
            {messages.retry}
          </button>
          {/* AGENT: When using Next.js, use <Link> component instead of <a> */}
          <a
            className="inline-flex min-h-11 items-center rounded-md px-2 text-sm text-ink underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-4 focus-visible:outline-ink"
            href="/overview"
          >
            {messages.overview}
          </a>
        </main>
      </body>
    </html>
  )
}
