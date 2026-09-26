import type { ReactNode } from 'react'
import { cn } from '@repo/react/utilities'

/**
 * Adapted from SmoothUI's Skeleton by Eduardo Calvo:
 * https://smoothui.dev/docs/components/skeleton-loader
 * https://smoothui.dev/r/skeleton-loader.json
 *
 * MIT License — Copyright (c) 2024 Eduardo Calvo
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * Local adaptation: LangDrift tokens, explicit reduced-motion support, and
 * decorative blocks. The composition owns its single named loading status.
 */
export interface SkeletonLoaderProps {
  children?: ReactNode
  className?: string
  loading?: boolean
}

export function SkeletonLoader({
  children,
  className,
  loading = true
}: SkeletonLoaderProps) {
  if (!loading) return <>{children}</>

  if (children != null) {
    return (
      <div aria-hidden="true" className={cn('relative', className)}>
        <div className="invisible" inert>
          {children}
        </div>
        <div className="absolute inset-0 animate-pulse rounded-[inherit] bg-muted/20 motion-reduce:animate-none" />
      </div>
    )
  }

  return (
    <div
      aria-hidden="true"
      className={cn(
        'animate-pulse rounded-md bg-muted/20 motion-reduce:animate-none',
        className
      )}
    />
  )
}
