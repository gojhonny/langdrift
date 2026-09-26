'use client'

import { routeStateMessages } from '@i18n/route-state.messages'
import './globals.css'

export default function GlobalError({ retry }: { retry: () => void }) {
  // This boundary also handles a failed locale provider or root layout.
  const messages = routeStateMessages.en

  return (
    <html lang="en" data-theme="light">
      <body className="m-0 bg-[#fafafa] font-sans text-[#171717]">
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
            className="min-h-11 cursor-pointer rounded-md border border-[#171717] bg-[#171717] px-4 py-2 text-sm font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#171717]"
            onClick={retry}
            type="button"
          >
            {messages.retry}
          </button>
          <a
            className="inline-flex min-h-11 items-center rounded-md px-2 text-sm text-[#171717] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#171717]"
            href="/overview"
          >
            {messages.overview}
          </a>
        </main>
      </body>
    </html>
  )
}
