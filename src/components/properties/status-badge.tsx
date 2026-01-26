import { cn } from '@/lib/cn'
import { Badge } from '@/components/ui'
import { PROPERTY_STATUSES } from '@/lib/constants'
import type { PropertyStatus } from '@/lib/constants'

interface StatusBadgeProps {
  status: PropertyStatus
  className?: string
}

const statusColorMap: Record<string, string> = {
  neutral: 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30',
  blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  pink: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  cyan: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  green: 'bg-green-500/20 text-green-400 border-green-500/30',
  emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  teal: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  slate: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig = PROPERTY_STATUSES.find((s) => s.value === status)

  if (!statusConfig) {
    return <Badge variant="secondary">{status}</Badge>
  }

  const colorClass = statusColorMap[statusConfig.color] || statusColorMap.neutral

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        colorClass,
        className
      )}
    >
      {statusConfig.label}
    </span>
  )
}
