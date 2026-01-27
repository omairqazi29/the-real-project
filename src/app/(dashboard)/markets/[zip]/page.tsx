'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Container } from '@/components/layout'
import { MarketScorecard } from '@/components/markets'
import { Skeleton } from '@/components/ui'
import { ArrowLeft } from 'lucide-react'
import type { Market } from '@/types/market'

interface MarketDetailPageProps {
  params: Promise<{ zip: string }>
}

export default function MarketDetailPage({ params }: MarketDetailPageProps) {
  const { zip } = use(params)
  const router = useRouter()
  const supabase = createClient()
  const [market, setMarket] = useState<Market | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMarket = async () => {
      try {
        const { data, error } = await supabase
          .from('markets')
          .select('*')
          .eq('zip', zip)
          .single()

        if (error) throw error
        if (!data) {
          router.push('/markets')
          return
        }

        setMarket(data as unknown as Market)
      } catch (error) {
        console.error('Error fetching market:', error)
        router.push('/markets')
      } finally {
        setLoading(false)
      }
    }

    fetchMarket()
  }, [zip, supabase, router])

  if (loading) {
    return (
      <Container size="xl">
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-12 w-1/3" />
          <div className="grid gap-4 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        </div>
      </Container>
    )
  }

  if (!market) {
    return null
  }

  return (
    <Container size="xl">
      <div className="space-y-6">
        <Link
          href="/markets"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Markets
        </Link>

        <MarketScorecard market={market} />
      </div>
    </Container>
  )
}
