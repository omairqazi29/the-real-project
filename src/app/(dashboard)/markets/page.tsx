'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { PageHeader, Container } from '@/components/layout'
import { MarketCard } from '@/components/markets'
import { Input, Skeleton } from '@/components/ui'
import { Search } from 'lucide-react'
import type { Market, MarketGrade } from '@/types/market'

type SortOption = 'grade' | 'price_low' | 'price_high' | 'rent_ratio'

export default function MarketsPage() {
  const supabase = createClient()
  const [markets, setMarkets] = useState<Market[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('grade')

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const { data, error } = await supabase
          .from('markets')
          .select('*')
          .order('overall_grade', { ascending: true })

        if (error) throw error

        setMarkets((data as unknown as Market[]) || [])
      } catch (error) {
        console.error('Error fetching markets:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMarkets()
  }, [supabase])

  const gradeOrder: Record<MarketGrade, number> = { A: 0, B: 1, C: 2, D: 3, F: 4 }

  const filteredMarkets = useMemo(() => {
    let result = [...markets]

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (m) =>
          m.city.toLowerCase().includes(q) ||
          m.state.toLowerCase().includes(q) ||
          m.zip.includes(q) ||
          m.metro_area?.toLowerCase().includes(q)
      )
    }

    switch (sortBy) {
      case 'grade':
        result.sort(
          (a, b) =>
            (gradeOrder[a.overall_grade ?? 'F'] ?? 5) -
            (gradeOrder[b.overall_grade ?? 'F'] ?? 5)
        )
        break
      case 'price_low':
        result.sort(
          (a, b) =>
            (a.median_home_price ?? Infinity) - (b.median_home_price ?? Infinity)
        )
        break
      case 'price_high':
        result.sort(
          (a, b) =>
            (b.median_home_price ?? 0) - (a.median_home_price ?? 0)
        )
        break
      case 'rent_ratio':
        result.sort(
          (a, b) =>
            (b.rent_price_ratio ?? 0) - (a.rent_price_ratio ?? 0)
        )
        break
    }

    return result
  }, [markets, searchQuery, sortBy])

  return (
    <Container size="xl">
      <PageHeader
        title="Markets"
        description="Explore and compare real estate markets across the country"
      />

      <div className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <Input
              placeholder="Search by city, state, or zip..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="h-10 rounded-lg border border-neutral-800 bg-surface px-3 text-sm text-neutral-100 outline-none focus:border-brand-600"
          >
            <option value="grade">Sort by Grade</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="rent_ratio">Best Rent Ratio</option>
          </select>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        ) : filteredMarkets.length === 0 ? (
          <div className="py-12 text-center text-neutral-400">
            {searchQuery
              ? 'No markets match your search'
              : 'No markets available'}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredMarkets.map((market) => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>
        )}
      </div>
    </Container>
  )
}
