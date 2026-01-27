'use client'

import { cn } from '@/lib/cn'
import type { Property } from '@/types/property'
import { Badge } from '@/components/ui'
import { formatCurrency } from '@/lib/format'
import { PROPERTY_TYPES } from '@/lib/constants'

interface PipelineCardProps {
  property: Property
  onClick?: () => void
}

export function PipelineCard({ property, onClick }: PipelineCardProps) {
  const cashflow = property.calculated_monthly_cashflow
  const propertyType = PROPERTY_TYPES.find((t) => t.value === property.property_type)

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-3 bg-neutral-800 border border-neutral-700 rounded-lg cursor-grab hover:border-neutral-600 transition-colors group"
    >
      {/* Name */}
      <h4 className="text-sm font-medium text-neutral-100 truncate group-hover:text-white">
        {property.name}
      </h4>

      {/* Address */}
      {property.address && (
        <p className="text-xs text-neutral-400 truncate mt-0.5">
          {property.address}
          {property.city && `, ${property.city}`}
        </p>
      )}

      {/* Metrics */}
      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="font-mono text-xs font-medium text-neutral-100">
          {formatCurrency(property.purchase_price)}
        </span>
        {cashflow != null && (
          <span
            className={cn(
              'font-mono text-xs font-medium',
              cashflow >= 0 ? 'text-green-500' : 'text-red-500'
            )}
          >
            {formatCurrency(cashflow)}/mo
          </span>
        )}
      </div>

      {/* Type badge */}
      {propertyType && (
        <div className="mt-2">
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
            {propertyType.label}
          </Badge>
        </div>
      )}
    </button>
  )
}
