'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { PageHeader, Container } from '@/components/layout'
import { Card, CardContent, Skeleton, Button } from '@/components/ui'
import { Building2, Plus, TrendingUp, DollarSign, MapPin, ArrowRight } from 'lucide-react'
import { formatCurrency } from '@/lib/format'
import type { Property } from '@/types/property'

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }

        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5)

        if (error) throw error
        setProperties((data as unknown as Property[]) || [])
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [supabase, router])

  const totalProperties = properties.length
  const totalValue = properties.reduce((sum, p) => sum + p.purchase_price, 0)
  const totalCashFlow = properties.reduce((sum, p) => sum + (p.calculated_monthly_cashflow ?? 0), 0)
  const avgCoC = totalProperties > 0
    ? properties.reduce((sum, p) => sum + (p.calculated_coc_return ?? 0), 0) / totalProperties
    : 0

  if (loading) {
    return (
      <Container size="xl">
        <div className="space-y-6">
          <Skeleton className="h-12 w-1/3" />
          <div className="grid gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
          <Skeleton className="h-64" />
        </div>
      </Container>
    )
  }

  return (
    <Container size="xl">
      <PageHeader
        title="Dashboard"
        description="Overview of your real estate portfolio"
      >
        <Button onClick={() => router.push('/properties/new')}>
          <Plus className="h-4 w-4" />
          Add Property
        </Button>
      </PageHeader>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600/10">
                <Building2 className="h-5 w-5 text-brand-500" />
              </div>
              <div>
                <p className="text-sm text-neutral-400">Properties</p>
                <p className="text-2xl font-bold text-neutral-100">{totalProperties}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/10">
                <DollarSign className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-neutral-400">Total Value</p>
                <p className="text-2xl font-bold text-neutral-100 font-mono">{formatCurrency(totalValue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600/10">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-neutral-400">Monthly Cash Flow</p>
                <p className={`text-2xl font-bold font-mono ${totalCashFlow >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatCurrency(totalCashFlow)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-600/10">
                <TrendingUp className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-neutral-400">Avg CoC Return</p>
                <p className="text-2xl font-bold text-neutral-100 font-mono">
                  {avgCoC.toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Properties */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-100">Recent Properties</h2>
          <Link href="/properties" className="text-sm text-brand-500 hover:text-brand-400 flex items-center gap-1">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {properties.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Building2 className="mx-auto h-12 w-12 text-neutral-600 mb-4" />
              <h3 className="text-lg font-medium text-neutral-200 mb-2">No properties yet</h3>
              <p className="text-sm text-neutral-400 mb-6">
                Add your first property to start analyzing your investment potential.
              </p>
              <Button onClick={() => router.push('/properties/new')}>
                <Plus className="h-4 w-4" />
                Add Your First Property
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {properties.map((property) => (
              <Link key={property.id} href={`/properties/${property.id}`}>
                <Card className="hover:border-neutral-700 transition-colors cursor-pointer">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-800">
                        <Building2 className="h-5 w-5 text-neutral-400" />
                      </div>
                      <div>
                        <p className="font-medium text-neutral-100">{property.name}</p>
                        <p className="text-sm text-neutral-400 flex items-center gap-1">
                          {property.address ? (
                            <>
                              <MapPin className="h-3 w-3" />
                              {property.address}, {property.city}
                            </>
                          ) : (
                            'No address'
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm font-medium text-neutral-100">
                        {formatCurrency(property.purchase_price)}
                      </p>
                      <p className={`font-mono text-sm ${(property.calculated_monthly_cashflow ?? 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {property.calculated_monthly_cashflow != null
                          ? `${formatCurrency(property.calculated_monthly_cashflow)}/mo`
                          : '-'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Container>
  )
}
