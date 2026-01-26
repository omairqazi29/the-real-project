'use client'

import Link from 'next/link'
import { cn } from '@/lib/cn'
import type { Property } from '@/types/property'
import { Card, CardContent, Badge } from '@/components/ui'
import { DataPoint } from '@/components/transparency'
import {
  Building2,
  Bed,
  Bath,
  Square,
  MapPin,
  TrendingUp,
  DollarSign,
} from 'lucide-react'
import { formatCurrency, formatBedsBaths, formatSqft } from '@/lib/format'
import { PROPERTY_STATUSES } from '@/lib/constants'

interface PropertyCardProps {
  property: Property
  className?: string
}

export function PropertyCard({ property, className }: PropertyCardProps) {
  const status = PROPERTY_STATUSES.find((s) => s.value === property.status)

  return (
    <Link href={`/properties/${property.id}`}>
      <Card
        className={cn(
          'overflow-hidden transition-all hover:border-neutral-700 hover:shadow-lg cursor-pointer',
          className
        )}
      >
        {/* Image or Placeholder */}
        <div className="relative h-40 bg-gradient-to-br from-neutral-800 to-neutral-900">
          {property.photo_urls?.[0] ? (
            <img
              src={property.photo_urls[0]}
              alt={property.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Building2 className="h-12 w-12 text-neutral-700" />
            </div>
          )}
          {/* Status Badge */}
          <div className="absolute left-3 top-3">
            <Badge variant="secondary" className="bg-black/60 backdrop-blur-sm">
              {status?.label || property.status}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Title and Address */}
          <div className="mb-3">
            <h3 className="font-semibold text-neutral-100 truncate">
              {property.name}
            </h3>
            {property.address && (
              <p className="flex items-center gap-1 text-sm text-neutral-400 truncate">
                <MapPin className="h-3 w-3 shrink-0" />
                {property.address}
                {property.city && `, ${property.city}`}
              </p>
            )}
          </div>

          {/* Property Details */}
          <div className="mb-4 flex items-center gap-3 text-sm text-neutral-400">
            {property.beds && (
              <span className="flex items-center gap-1">
                <Bed className="h-4 w-4" />
                {property.beds}
              </span>
            )}
            {property.baths && (
              <span className="flex items-center gap-1">
                <Bath className="h-4 w-4" />
                {property.baths}
              </span>
            )}
            {property.sqft && (
              <span className="flex items-center gap-1">
                <Square className="h-4 w-4" />
                {formatSqft(property.sqft)}
              </span>
            )}
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-neutral-500">Purchase Price</p>
              <p className="font-mono text-sm font-medium text-neutral-100">
                {formatCurrency(property.purchase_price)}
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">Monthly Rent</p>
              <p className="font-mono text-sm font-medium text-neutral-100">
                {property.monthly_rent
                  ? formatCurrency(property.monthly_rent)
                  : '-'}
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">Cash Flow</p>
              <p
                className={cn(
                  'font-mono text-sm font-medium',
                  (property.calculated_monthly_cashflow ?? 0) >= 0
                    ? 'text-green-500'
                    : 'text-red-500'
                )}
              >
                {property.calculated_monthly_cashflow != null
                  ? formatCurrency(property.calculated_monthly_cashflow)
                  : '-'}
                <span className="text-neutral-500">/mo</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">CoC Return</p>
              <p
                className={cn(
                  'font-mono text-sm font-medium',
                  (property.calculated_coc_return ?? 0) >= 0
                    ? 'text-green-500'
                    : 'text-red-500'
                )}
              >
                {property.calculated_coc_return != null
                  ? `${property.calculated_coc_return.toFixed(1)}%`
                  : '-'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
