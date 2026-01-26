'use client'

import * as React from 'react'
import { cn } from '@/lib/cn'

type SwitchProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, ...props }, ref) => {
    return (
      <label className="relative inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          className="peer sr-only"
          ref={ref}
          {...props}
        />
        <div
          className={cn(
            'h-6 w-11 rounded-full bg-neutral-700 transition-colors',
            'peer-checked:bg-brand-600',
            'peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-neutral-900',
            'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
            'after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform',
            'peer-checked:after:translate-x-5',
            className
          )}
        />
      </label>
    )
  }
)
Switch.displayName = 'Switch'

export { Switch }
