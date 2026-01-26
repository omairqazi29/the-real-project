'use client'

import * as React from 'react'
import { cn } from '@/lib/cn'

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
  showLabel?: boolean
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, showLabel = false, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    return (
      <div className="w-full">
        {showLabel && (
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-neutral-400">Progress</span>
            <span className="text-neutral-300">{Math.round(percentage)}%</span>
          </div>
        )}
        <div
          ref={ref}
          className={cn(
            'relative h-2 w-full overflow-hidden rounded-full bg-neutral-800',
            className
          )}
          {...props}
        >
          <div
            className="h-full bg-brand-600 transition-all duration-300 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    )
  }
)
Progress.displayName = 'Progress'

export { Progress }
