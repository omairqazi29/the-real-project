'use client'

import { cn } from '@/lib/cn'
import type { Property } from '@/types/property'
import { PropertyCard } from './property-card'
import { EmptyState } from '@/components/shared'
import { Building2 } from 'lucide-react'

interface PropertyListProps {
  properties: Property[]
  loading?: boolean
  onAddProperty?: () => void
  className?: string
}

export function PropertyList({
  properties,
  loading,
  onAddProperty,
  className,
}: PropertyListProps) {
  if (loading) {
    return (
      <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-3', className)}>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-80 animate-pulse rounded-xl bg-neutral-800"
          />
        ))}
      </div>
    )
  }

  if (properties.length === 0) {
    return (
      <EmptyState
        icon={Building2}
        title="No properties yet"
        description="Add your first property to start analyzing your investment potential"
        action={
          onAddProperty
            ? {
                label: 'Add Property',
                onClick: onAddProperty,
              }
            : undefined
        }
        className={className}
      />
    )
  }

  return (
    <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  )
}
