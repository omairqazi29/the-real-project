import { cn } from '@/lib/cn'
import { CONFIDENCE_COLORS, type ConfidenceLevel } from '@/types/transparency'

interface ConfidenceLegendProps {
  className?: string
  orientation?: 'horizontal' | 'vertical'
}

const confidenceLevels: { level: ConfidenceLevel; label: string; description: string }[] = [
  {
    level: 'high',
    label: 'Verified',
    description: 'User input or confirmed data',
  },
  {
    level: 'medium',
    label: 'Estimated',
    description: 'Calculated from sources or market data',
  },
  {
    level: 'low',
    label: 'Assumption',
    description: 'Default values that can be adjusted',
  },
]

export function ConfidenceLegend({
  className,
  orientation = 'horizontal',
}: ConfidenceLegendProps) {
  return (
    <div
      className={cn(
        'flex gap-4',
        orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
        className
      )}
    >
      {confidenceLevels.map(({ level, label, description }) => {
        const colors = CONFIDENCE_COLORS[level]
        return (
          <div
            key={level}
            className={cn(
              'flex items-center gap-2',
              orientation === 'vertical' && 'w-full'
            )}
          >
            <span className={cn('h-2.5 w-2.5 rounded-full shrink-0', colors.dot)} />
            <div className={orientation === 'vertical' ? 'flex-1' : ''}>
              <span className={cn('text-sm font-medium', colors.text)}>
                {label}
              </span>
              {orientation === 'vertical' && (
                <p className="text-xs text-neutral-500">{description}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function ConfidenceLegendCompact({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-3 text-xs', className)}>
      {confidenceLevels.map(({ level, label }) => {
        const colors = CONFIDENCE_COLORS[level]
        return (
          <div key={level} className="flex items-center gap-1">
            <span className={cn('h-2 w-2 rounded-full', colors.dot)} />
            <span className="text-neutral-400">{label}</span>
          </div>
        )
      })}
    </div>
  )
}
