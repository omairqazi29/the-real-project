import { cn } from '@/lib/cn'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui'
import {
  type ConfidenceLevel,
  type DataSource,
  CONFIDENCE_COLORS,
  SOURCE_LABELS,
} from '@/types/transparency'
import { Info, User, Calculator, Settings, Globe, HelpCircle } from 'lucide-react'

interface SourceBadgeProps {
  source: DataSource
  confidence: ConfidenceLevel
  detail?: string
  url?: string
  showLabel?: boolean
  size?: 'sm' | 'md'
  className?: string
}

const sourceIcons: Record<DataSource, typeof Info> = {
  user: User,
  estimated: HelpCircle,
  calculated: Calculator,
  assumption: Settings,
  api: Globe,
}

export function SourceBadge({
  source,
  confidence,
  detail,
  url,
  showLabel = false,
  size = 'md',
  className,
}: SourceBadgeProps) {
  const colors = CONFIDENCE_COLORS[confidence]
  const Icon = sourceIcons[source]

  const content = (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full border',
        colors.bg,
        colors.border,
        size === 'sm' ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-1 text-xs',
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', colors.dot)} />
      {showLabel && (
        <span className={cn(colors.text, 'font-medium')}>
          {SOURCE_LABELS[source]}
        </span>
      )}
    </div>
  )

  if (!detail && !url) {
    return content
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{content}</TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Icon className={cn('h-4 w-4', colors.text)} />
            <span className="font-medium">{SOURCE_LABELS[source]}</span>
          </div>
          {detail && <p className="text-sm text-neutral-400">{detail}</p>}
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-brand-500 hover:underline"
            >
              View source
            </a>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  )
}

export function ConfidenceDot({
  confidence,
  className,
}: {
  confidence: ConfidenceLevel
  className?: string
}) {
  const colors = CONFIDENCE_COLORS[confidence]
  return <span className={cn('h-2 w-2 rounded-full', colors.dot, className)} />
}
