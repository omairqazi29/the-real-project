'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { PageHeader, Container } from '@/components/layout'
import { Card, CardContent, Button, Badge } from '@/components/ui'
import { ComparisonTable } from '@/components/analysis/comparison-table'
import { ComparisonChart } from '@/components/charts/comparison-chart'
import { cn } from '@/lib/cn'
import { BarChart3, CheckSquare, Square } from 'lucide-react'
import type { Property } from '@/types/property'

export default function ComparePage() {
  const supabase = createClient()
  const [properties, setProperties] = useState<Property[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) return

        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setProperties((data as Property[]) ?? [])
      } catch {
        // silently handle
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])

  const toggleProperty = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else if (next.size < 4) {
        next.add(id)
      }
      return next
    })
  }

  const selectedProperties = properties.filter((p) => selectedIds.has(p.id))

  if (loading) {
    return (
      <Container>
        <PageHeader title="Compare Properties" description="Loading your properties..." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-lg bg-neutral-800 animate-pulse" />
          ))}
        </div>
      </Container>
    )
  }

  if (properties.length < 2) {
    return (
      <Container>
        <PageHeader title="Compare Properties" description="Side-by-side property comparison" />
        <Card>
          <CardContent className="py-16 text-center">
            <BarChart3 className="mx-auto h-12 w-12 text-neutral-600 mb-4" />
            <h3 className="text-lg font-medium text-neutral-200 mb-2">
              Not enough properties to compare
            </h3>
            <p className="text-sm text-neutral-400 max-w-md mx-auto">
              You need at least 2 properties to use the comparison tool. Add more properties to get started.
            </p>
          </CardContent>
        </Card>
      </Container>
    )
  }

  return (
    <Container>
      <PageHeader
        title="Compare Properties"
        description="Select 2-4 properties to compare side by side"
      >
        {selectedIds.size >= 2 && (
          <Badge variant="secondary">
            {selectedIds.size} selected
          </Badge>
        )}
      </PageHeader>

      {/* Property Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mb-8">
        {properties.map((p) => {
          const isSelected = selectedIds.has(p.id)
          const isDisabled = !isSelected && selectedIds.size >= 4

          return (
            <button
              key={p.id}
              onClick={() => !isDisabled && toggleProperty(p.id)}
              disabled={isDisabled}
              className={cn(
                'flex items-center gap-3 rounded-lg border p-4 text-left transition-colors',
                isSelected
                  ? 'border-brand-500 bg-brand-500/10'
                  : 'border-neutral-700 bg-neutral-800/50 hover:border-neutral-600',
                isDisabled && 'opacity-40 cursor-not-allowed'
              )}
            >
              {isSelected ? (
                <CheckSquare className="h-5 w-5 text-brand-400 shrink-0" />
              ) : (
                <Square className="h-5 w-5 text-neutral-500 shrink-0" />
              )}
              <div className="min-w-0">
                <p className="font-medium text-neutral-100 truncate">{p.name}</p>
                <p className="text-xs text-neutral-400 truncate">
                  {p.address ? `${p.address}, ${p.city ?? ''}` : 'No address'}
                </p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Comparison Results */}
      {selectedProperties.length >= 2 ? (
        <div className="space-y-6">
          <ComparisonChart properties={selectedProperties} />
          <ComparisonTable properties={selectedProperties} />
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-neutral-400">
            Select at least 2 properties above to see the comparison.
          </CardContent>
        </Card>
      )}
    </Container>
  )
}
