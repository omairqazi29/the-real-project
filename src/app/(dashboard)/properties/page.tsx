'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { PageHeader, Container } from '@/components/layout'
import { PropertyList } from '@/components/properties'
import { Button } from '@/components/ui'
import { Plus } from 'lucide-react'
import type { Property } from '@/types/property'

export default function PropertiesPage() {
  const router = useRouter()
  const supabase = createClient()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

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

      <PropertyList
        properties={properties}
        loading={loading}
        onAddProperty={() => router.push('/properties/new')}
      />
    </Container>
  )
}
