'use client'

import { cn } from '@/lib/cn'

interface ResponsiveContainerProps {
  children: React.ReactNode
  className?: string
}

/**
 * Container that switches between horizontal scroll on mobile
 * and grid/flex layout on desktop.
 */
export function ResponsiveCardGrid({
  children,
  className,
}: ResponsiveContainerProps) {
  return (
    <div
      className={cn(
        // Mobile: horizontal scroll
        'flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4',
        // Mobile: children sizing
        '[&>*]:min-w-[280px] [&>*]:max-w-[320px] [&>*]:snap-start [&>*]:shrink-0',
        // Desktop: grid
        'sm:grid sm:grid-cols-2 sm:overflow-visible sm:mx-0 sm:px-0 sm:pb-0',
        'sm:[&>*]:min-w-0 sm:[&>*]:max-w-none sm:[&>*]:snap-align-none sm:[&>*]:shrink',
        'lg:grid-cols-3',
        // Hide scrollbar on mobile
        'scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        className
      )}
    >
      {children}
    </div>
  )
}

/**
 * Responsive table wrapper that adds horizontal scroll on mobile.
 */
export function ResponsiveTable({
  children,
  className,
}: ResponsiveContainerProps) {
  return (
    <div
      className={cn(
        'overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0',
        'scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        className
      )}
    >
      {children}
    </div>
  )
}

/**
 * Stack that switches from horizontal on desktop to vertical on mobile.
 */
export function ResponsiveStack({
  children,
  className,
}: ResponsiveContainerProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-start',
        className
      )}
    >
      {children}
    </div>
  )
}
