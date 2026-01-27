'use client'

import { useState } from 'react'
import { cn } from '@/lib/cn'
import { PROPERTY_STATUSES, PROPERTY_TYPES } from '@/lib/constants'
import { Search, SlidersHorizontal, ArrowUpDown, LayoutGrid, List } from 'lucide-react'

export type SortOption = 'newest' | 'oldest' | 'price_high' | 'price_low' | 'cashflow' | 'name'
export type ViewMode = 'grid' | 'list'

interface PropertyFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  statusFilter: string
  onStatusChange: (status: string) => void
  typeFilter: string
  onTypeChange: (type: string) => void
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  className?: string
}

export function PropertyFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  className,
}: PropertyFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className={cn('space-y-3', className)}>
      {/* Search and Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search properties..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="h-10 px-3 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price_high">Price: High to Low</option>
          <option value="price_low">Price: Low to High</option>
          <option value="cashflow">Best Cash Flow</option>
          <option value="name">Name A-Z</option>
        </select>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            'h-10 px-4 flex items-center gap-2 rounded-lg border text-sm transition-colors',
            showFilters
              ? 'bg-brand-600 border-brand-600 text-white'
              : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700'
          )}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </button>

        {/* View Toggle */}
        <div className="flex rounded-lg border border-neutral-700 overflow-hidden">
          <button
            onClick={() => onViewModeChange('grid')}
            className={cn(
              'h-10 px-3 flex items-center transition-colors',
              viewMode === 'grid'
                ? 'bg-neutral-700 text-white'
                : 'bg-neutral-800 text-neutral-400 hover:text-white'
            )}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={cn(
              'h-10 px-3 flex items-center transition-colors',
              viewMode === 'list'
                ? 'bg-neutral-700 text-white'
                : 'bg-neutral-800 text-neutral-400 hover:text-white'
            )}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-3 p-4 bg-neutral-800/50 rounded-lg border border-neutral-700">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
              className="h-9 px-3 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">All Statuses</option>
              {PROPERTY_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Property Type</label>
            <select
              value={typeFilter}
              onChange={(e) => onTypeChange(e.target.value)}
              className="h-9 px-3 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">All Types</option>
              {PROPERTY_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                onStatusChange('')
                onTypeChange('')
                onSearchChange('')
              }}
              className="h-9 px-3 text-sm text-muted-foreground hover:text-white transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
