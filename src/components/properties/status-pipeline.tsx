'use client'

import { cn } from '@/lib/cn'
import type { Property } from '@/types/property'
import { PROPERTY_STATUSES } from '@/lib/constants'
import { PipelineCard } from './pipeline-card'

const COLOR_MAP: Record<string, string> = {
  neutral: 'bg-neutral-500',
  blue: 'bg-blue-500',
  yellow: 'bg-yellow-500',
  orange: 'bg-orange-500',
  purple: 'bg-purple-500',
  pink: 'bg-pink-500',
  cyan: 'bg-cyan-500',
  green: 'bg-green-500',
  emerald: 'bg-emerald-500',
  teal: 'bg-teal-500',
  slate: 'bg-slate-500',
}

interface StatusPipelineProps {
  properties: Property[]
  onPropertyClick?: (id: string) => void
}

export function StatusPipeline({ properties, onPropertyClick }: StatusPipelineProps) {
  const grouped = PROPERTY_STATUSES.map((status) => ({
    ...status,
    items: properties.filter((p) => p.status === status.value),
  }))

  return (
    <div className="overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory md:snap-none">
      <div className="flex gap-4" style={{ minWidth: 'max-content' }}>
        {grouped.map((column) => (
          <div
            key={column.value}
            className="min-w-[280px] w-[280px] flex flex-col snap-start"
          >
            {/* Column Header */}
            <div className="flex items-center gap-2 mb-3 px-1">
              <span
                className={cn('h-2.5 w-2.5 rounded-full shrink-0', COLOR_MAP[column.color] || 'bg-neutral-500')}
              />
              <span className="text-sm font-medium text-neutral-200 truncate">
                {column.label}
              </span>
              <span className="ml-auto text-xs font-mono text-neutral-500 bg-neutral-800 px-1.5 py-0.5 rounded">
                {column.items.length}
              </span>
            </div>

            {/* Cards */}
            <div
              className={cn(
                'flex-1 space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto rounded-lg p-2',
                column.items.length === 0
                  ? 'border-2 border-dashed border-neutral-800 flex items-center justify-center min-h-[120px]'
                  : 'bg-neutral-900/50'
              )}
            >
              {column.items.length === 0 ? (
                <p className="text-xs text-neutral-600">No properties</p>
              ) : (
                column.items.map((property) => (
                  <PipelineCard
                    key={property.id}
                    property={property}
                    onClick={() => onPropertyClick?.(property.id)}
                  />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
