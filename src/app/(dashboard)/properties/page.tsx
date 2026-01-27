'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { PageHeader, Container } from '@/components/layout'
import { PropertyList, PropertyFilters, type SortOption, type ViewMode } from '@/components/properties'
import { Button } from '@/components/ui'
import { Plus } from 'lucide-react'
import type { Property } from '@/types/property'

export default function PropertiesPage() {
  const router = useRouter()
  const supabase = createClient()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  // Filter & sort state
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push('/login')
          return
        }

        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error

        setProperties((data as unknown as Property[]) || [])
      } catch (error) {
        console.error('Error fetching properties:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [supabase, router])

  // Filter and sort properties
  const filteredProperties = useMemo(() => {
    let result = [...properties]

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.address?.toLowerCase().includes(q) ||
          p.city?.toLowerCase().includes(q) ||
          p.state?.toLowerCase().includes(q) ||
          p.zip?.toLowerCase().includes(q)
      )
    }

    // Status filter
    if (statusFilter) {
      result = result.filter((p) => p.status === statusFilter)
    }

    // Type filter
    if (typeFilter) {
      result = result.filter((p) => p.property_type === typeFilter)
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case 'oldest':
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        break
      case 'price_high':
        result.sort((a, b) => b.purchase_price - a.purchase_price)
        break
      case 'price_low':
        result.sort((a, b) => a.purchase_price - b.purchase_price)
        break
      case 'cashflow':
        result.sort((a, b) => (b.calculated_monthly_cashflow ?? 0) - (a.calculated_monthly_cashflow ?? 0))
        break
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    return result
  }, [properties, searchQuery, statusFilter, typeFilter, sortBy])

  return (
    <Container size="xl">
      <PageHeader
        title="Properties"
        description="Analyze and track your real estate investments"
      >
        <Button onClick={() => router.push('/properties/new')}>
          <Plus className="h-4 w-4" />
          Add Property
        </Button>
      </PageHeader>

      <div className="space-y-4">
        <PropertyFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          typeFilter={typeFilter}
          onTypeChange={setTypeFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        <PropertyList
          properties={filteredProperties}
          loading={loading}
          onAddProperty={() => router.push('/properties/new')}
        />
      </div>
    </Container>
  )
}
