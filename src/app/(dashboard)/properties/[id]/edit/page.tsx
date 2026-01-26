'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { PageHeader, Container } from '@/components/layout'
import { PropertyForm } from '@/components/properties'
import { usePropertyStore } from '@/store/property-store'
import { Skeleton } from '@/components/ui'
import { ArrowLeft } from 'lucide-react'
import type { Property } from '@/types/property'

interface EditPropertyPageProps {
  params: Promise<{ id: string }>
}

export default function EditPropertyPage({ params }: EditPropertyPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const supabase = createClient()
  const { loadProperty } = usePropertyStore()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }

        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error
        if (!data) {
          router.push('/properties')
          return
        }

        const typedProperty = data as unknown as Property
        setProperty(typedProperty)
        loadProperty(typedProperty)
      } catch (error) {
        console.error('Error fetching property:', error)
        router.push('/properties')
      } finally {
        setLoading(false)
      }
    }

    fetchProperty()
  }, [id, supabase, router, loadProperty])

  if (loading) {
    return (
      <Container size="xl">
        <div className="space-y-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-12 w-1/3" />
          <Skeleton className="h-96" />
        </div>
      </Container>
    )
  }

  if (!property) {
    return null
  }

  return (
    <Container size="xl">
      <div className="space-y-6">
        <Link
          href={`/properties/${id}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Property
        </Link>

        <PageHeader
          title={`Edit: ${property.name}`}
          description="Update the details of your investment property"
        />

        <PropertyForm property={property} mode="edit" />
      </div>
    </Container>
  )
}
