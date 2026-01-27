'use client'

import { cn } from '@/lib/cn'
import type { MarketGrade } from '@/types/market'

const gradeColors: Record<MarketGrade, string> = {
  A: 'bg-green-500/20 text-green-400 border-green-500/30',
  B: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  C: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  D: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  F: 'bg-red-500/20 text-red-400 border-red-500/30',
}

const sizeClasses = {
  sm: 'h-6 w-6 text-xs',
  md: 'h-8 w-8 text-sm',
  lg: 'h-10 w-10 text-base',
}

interface MarketGradeBadgeProps {
  grade: MarketGrade
  score?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function MarketGradeBadge({
  grade,
  score,
  size = 'md',
  className,
}: MarketGradeBadgeProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className={cn(
          'inline-flex items-center justify-center rounded-full border font-bold',
          gradeColors[grade],
          sizeClasses[size]
        )}
      >
        {grade}
      </div>
      {score !== undefined && (
        <span className="text-sm text-neutral-400">{score}</span>
      )}
    </div>
  )
}
