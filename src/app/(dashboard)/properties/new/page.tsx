'use client'

import { useEffect } from 'react'
import { PageHeader, Container } from '@/components/layout'
import { PropertyForm } from '@/components/properties'
import { usePropertyStore } from '@/store/property-store'

export default function NewPropertyPage() {
  const { resetForm } = usePropertyStore()

  useEffect(() => {
    resetForm()
  }, [resetForm])

  return (
    <Container size="xl">
      <PageHeader
        title="Add New Property"
        description="Enter the details of your investment property for BRRR analysis"
      />
      <PropertyForm mode="create" />
    </Container>
  )
}
