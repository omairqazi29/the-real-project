'use client'

import { useState } from 'react'
import { cn } from '@/lib/cn'
import type { DataPointConfig, DataInput } from '@/types/transparency'
import { SourceBadge, ConfidenceDot } from './source-badge'
import { FormulaBreakdown } from './formula-breakdown'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { formatCurrency, formatPercent, formatNumber, formatMonths, formatYears } from '@/lib/format'
import { Info, ChevronDown } from 'lucide-react'

interface DataPointProps {
  label: string
  value: number | null | undefined
  format?: 'currency' | 'percent' | 'number' | 'months' | 'years'
  formula?: string
  inputs?: DataInput[]
  confidence?: 'high' | 'medium' | 'low'
  helpText?: string
  size?: 'sm' | 'md' | 'lg'
  showConfidenceDot?: boolean
  className?: string
  valueClassName?: string
  onClick?: () => void
}

export function DataPoint({
  label,
  value,
  format = 'number',
  formula,
  inputs,
  confidence = 'medium',
  helpText,
  size = 'md',
  showConfidenceDot = true,
  className,
  valueClassName,
  onClick,
}: DataPointProps) {
  const [dialogOpen, setDialogOpen] = useState(false)

  const formattedValue = (() => {
    if (value == null) return '-'
    switch (format) {
      case 'currency':
        return formatCurrency(value)
      case 'percent':
        return formatPercent(value)
      case 'months':
        return formatMonths(value)
      case 'years':
        return formatYears(value)
      default:
        return formatNumber(value, { decimals: 2 })
    }
  })()

  const hasDetails = formula || (inputs && inputs.length > 0)

  const sizeClasses = {
    sm: {
      label: 'text-xs',
      value: 'text-lg font-semibold',
    },
    md: {
      label: 'text-sm',
      value: 'text-2xl font-bold',
    },
    lg: {
      label: 'text-base',
      value: 'text-3xl font-bold',
    },
  }

  const content = (
    <div className={cn('space-y-1', className)}>
      <div className="flex items-center gap-1.5">
        <span className={cn('text-neutral-400', sizeClasses[size].label)}>
          {label}
        </span>
        {showConfidenceDot && <ConfidenceDot confidence={confidence} />}
        {helpText && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-3.5 w-3.5 text-neutral-500 cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{helpText}</p>
            </TooltipContent>
          </Tooltip>
        )}
        {hasDetails && (
          <ChevronDown className="h-3.5 w-3.5 text-neutral-500" />
        )}
      </div>
      <div
        className={cn(
          'font-mono tracking-tight text-neutral-100',
          sizeClasses[size].value,
          valueClassName
        )}
      >
        {formattedValue}
      </div>
    </div>
  )

  if (!hasDetails) {
    return content
  }

  return (
    <>
      <button
        onClick={() => setDialogOpen(true)}
        className={cn(
          'text-left transition-colors hover:bg-neutral-800/50 rounded-lg p-2 -m-2',
          onClick && 'cursor-pointer'
        )}
      >
        {content}
      </button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {label}
              <ConfidenceDot confidence={confidence} />
            </DialogTitle>
            <DialogDescription>
              <span className="font-mono text-2xl text-neutral-100">
                {formattedValue}
              </span>
            </DialogDescription>
          </DialogHeader>

          {(formula || inputs) && (
            <FormulaBreakdown
              formula={formula || 'No formula specified'}
              inputs={inputs || []}
            />
          )}

          {helpText && (
            <p className="text-sm text-neutral-400 border-t border-neutral-800 pt-3">
              {helpText}
            </p>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

/**
 * Inline data point for use in text
 */
export function InlineDataPoint({
  value,
  format = 'number',
  confidence = 'medium',
  tooltip,
}: {
  value: number | null | undefined
  format?: 'currency' | 'percent' | 'number'
  confidence?: 'high' | 'medium' | 'low'
  tooltip?: string
}) {
  const formattedValue = (() => {
    if (value == null) return '-'
    switch (format) {
      case 'currency':
        return formatCurrency(value)
      case 'percent':
        return formatPercent(value)
      default:
        return formatNumber(value, { decimals: 2 })
    }
  })()

  const content = (
    <span className="inline-flex items-center gap-1">
      <span className="font-mono font-medium text-neutral-100">
        {formattedValue}
      </span>
      <ConfidenceDot confidence={confidence} className="h-1.5 w-1.5" />
    </span>
  )

  if (!tooltip) return content

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="cursor-help border-b border-dashed border-neutral-600">
          {content}
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p className="max-w-xs">{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  )
}
