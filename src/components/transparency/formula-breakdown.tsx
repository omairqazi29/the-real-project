'use client'

import { cn } from '@/lib/cn'
import type { DataInput } from '@/types/transparency'
import { SourceBadge } from './source-badge'
import { formatCurrency, formatPercent, formatNumber } from '@/lib/format'
import { ExternalLink } from 'lucide-react'

interface FormulaBreakdownProps {
  formula: string
  inputs: DataInput[]
  className?: string
}

export function FormulaBreakdown({
  formula,
  inputs,
  className,
}: FormulaBreakdownProps) {
  const formatInputValue = (input: DataInput) => {
    const value = input.value
    if (typeof value === 'string') return value

    // Try to determine format from name
    const name = input.name.toLowerCase()
    if (name.includes('percent') || name.includes('rate') || name.includes('%')) {
      return formatPercent(value)
    }
    if (
      name.includes('price') ||
      name.includes('cost') ||
      name.includes('rent') ||
      name.includes('payment') ||
      name.includes('expense') ||
      name.includes('income') ||
      name.includes('flow') ||
      name.includes('value') ||
      name.includes('$')
    ) {
      return formatCurrency(value)
    }
    return formatNumber(value, { decimals: 2 })
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Formula */}
      <div className="rounded-lg bg-neutral-800/50 p-3">
        <code className="text-sm text-neutral-300 font-mono">{formula}</code>
      </div>

      {/* Inputs */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
          Input Values
        </p>
        <div className="space-y-1.5">
          {inputs.map((input, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-2 text-sm"
            >
              <div className="flex items-center gap-2">
                <span className="text-neutral-400">{input.name}</span>
                <SourceBadge
                  source={input.source}
                  confidence={
                    input.source === 'user'
                      ? 'high'
                      : input.source === 'assumption'
                        ? 'low'
                        : 'medium'
                  }
                  detail={input.sourceDetail}
                  url={input.url}
                  size="sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-neutral-100">
                  {formatInputValue(input)}
                </span>
                {input.url && (
                  <a
                    href={input.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-500 hover:text-neutral-300"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
