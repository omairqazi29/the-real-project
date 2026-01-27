'use client'

import { cn } from '@/lib/cn'
import { formatCurrency, formatBedsBaths, formatSqft, formatPricePerSqft } from '@/lib/format'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Pencil, Trash2, Calendar, Ruler } from 'lucide-react'
import type { ARVComp, RentComp } from '@/types/property'

interface ARVCompCardProps {
  comp: ARVComp
  onEdit?: () => void
  onDelete?: () => void
  className?: string
}

export function ARVCompCard({ comp, onEdit, onDelete, className }: ARVCompCardProps) {
  const adjustmentTotal = comp.adjustments
    ? Object.values(comp.adjustments).reduce((sum, val) => sum + (val || 0), 0)
    : 0

  return (
    <div className={cn('rounded-lg border border-neutral-800 bg-neutral-900/50 p-4 space-y-3', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="font-medium text-neutral-100 text-sm">{comp.address}</p>
          <div className="flex items-center gap-2 mt-1 text-xs text-neutral-500">
            <MapPin className="h-3 w-3" />
            <span>{comp.distance_miles} mi away</span>
            <Calendar className="h-3 w-3 ml-1" />
            <span>{comp.sold_date}</span>
          </div>
        </div>
        <div className="flex gap-1">
          {onEdit && (
            <Button variant="ghost" size="icon-sm" onClick={onEdit}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          )}
          {onDelete && (
            <Button variant="ghost" size="icon-sm" onClick={onDelete}>
              <Trash2 className="h-3.5 w-3.5 text-red-500" />
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-sm">
        <div>
          <span className="text-neutral-500 text-xs">Sold Price</span>
          <p className="font-mono font-medium">{formatCurrency(comp.sold_price)}</p>
        </div>
        <div>
          <span className="text-neutral-500 text-xs">$/sqft</span>
          <p className="font-mono font-medium">{formatPricePerSqft(comp.price_per_sqft)}</p>
        </div>
        <div>
          <span className="text-neutral-500 text-xs">Bed/Bath</span>
          <p className="font-mono font-medium">{comp.beds}/{comp.baths}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs">
        <Ruler className="h-3 w-3 text-neutral-500" />
        <span className="text-neutral-400">{formatSqft(comp.sqft)}</span>
        <Badge variant="secondary" className="text-xs">
          {comp.source}
        </Badge>
      </div>

      {adjustmentTotal !== 0 && (
        <div className="border-t border-neutral-800 pt-2">
          <div className="flex justify-between text-xs">
            <span className="text-neutral-500">Adjustments</span>
            <span className={cn('font-mono', adjustmentTotal >= 0 ? 'text-green-500' : 'text-red-500')}>
              {adjustmentTotal >= 0 ? '+' : ''}{formatCurrency(adjustmentTotal)}
            </span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-neutral-400 font-medium">Adjusted Price</span>
            <span className="font-mono font-semibold">{formatCurrency(comp.adjusted_price ?? comp.sold_price + adjustmentTotal)}</span>
          </div>
        </div>
      )}
    </div>
  )
}

interface RentCompCardProps {
  comp: RentComp
  onEdit?: () => void
  onDelete?: () => void
  className?: string
}

export function RentCompCard({ comp, onEdit, onDelete, className }: RentCompCardProps) {
  const rentPerSqft = comp.sqft > 0 ? comp.rent / comp.sqft : 0

  return (
    <div className={cn('rounded-lg border border-neutral-800 bg-neutral-900/50 p-4 space-y-3', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="font-medium text-neutral-100 text-sm">{comp.address}</p>
          <div className="flex items-center gap-2 mt-1 text-xs text-neutral-500">
            <MapPin className="h-3 w-3" />
            <span>{comp.distance_miles} mi away</span>
            <Calendar className="h-3 w-3 ml-1" />
            <span>{comp.date}</span>
          </div>
        </div>
        <div className="flex gap-1">
          {onEdit && (
            <Button variant="ghost" size="icon-sm" onClick={onEdit}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          )}
          {onDelete && (
            <Button variant="ghost" size="icon-sm" onClick={onDelete}>
              <Trash2 className="h-3.5 w-3.5 text-red-500" />
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-sm">
        <div>
          <span className="text-neutral-500 text-xs">Monthly Rent</span>
          <p className="font-mono font-medium text-green-500">{formatCurrency(comp.rent)}</p>
        </div>
        <div>
          <span className="text-neutral-500 text-xs">$/sqft</span>
          <p className="font-mono font-medium">${rentPerSqft.toFixed(2)}</p>
        </div>
        <div>
          <span className="text-neutral-500 text-xs">Bed/Bath</span>
          <p className="font-mono font-medium">{comp.beds}/{comp.baths}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs">
        <Ruler className="h-3 w-3 text-neutral-500" />
        <span className="text-neutral-400">{formatSqft(comp.sqft)}</span>
        <Badge variant="secondary" className="text-xs">
          {comp.source}
        </Badge>
      </div>
    </div>
  )
}
