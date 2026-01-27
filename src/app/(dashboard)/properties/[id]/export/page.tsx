'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { PageHeader, Container } from '@/components/layout'
import { Button, Card, CardContent, CardHeader, CardTitle, Skeleton } from '@/components/ui'
import { generatePropertyPDF } from '@/lib/export-pdf'
import { calculatePropertyBRRR } from '@/lib/calculations/brrr'
import { generatePropertyProjections } from '@/lib/calculations/projections'
import { formatCurrency, formatPercent } from '@/lib/format'
import { ArrowLeft, Download, FileText } from 'lucide-react'
import type { Property } from '@/types/property'
import type { BRRRResult, YearProjection } from '@/types/calculations'

interface ExportPageProps {
  params: Promise<{ id: string }>
}

export default function ExportPage({ params }: ExportPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const supabase = createClient()
  const [property, setProperty] = useState<Property | null>(null)
  const [brrr, setBrrr] = useState<BRRRResult | null>(null)
  const [projections, setProjections] = useState<YearProjection[]>([])
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { router.push('/login'); return }

        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .single()

        if (error || !data) { router.push('/properties'); return }

        const typedProperty = data as unknown as Property
        setProperty(typedProperty)
        setBrrr(calculatePropertyBRRR(typedProperty))
        setProjections(generatePropertyProjections(typedProperty, 10))
      } catch {
        router.push('/properties')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id, supabase, router])

  const handleExportPDF = async () => {
    if (!property || !brrr) return
    setExporting(true)
    try {
      await generatePropertyPDF(property, brrr, projections)
    } catch (error) {
      console.error('PDF export failed:', error)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  if (loading) {
    return (
      <Container>
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-64 mt-6" />
      </Container>
    )
  }

  if (!property || !brrr) return null

  return (
    <Container>
      <Link
        href={`/properties/${id}`}
        className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-100 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Analysis
      </Link>

      <PageHeader
        title="Export Report"
        description={`Export analysis for ${property.name}`}
      />

      <div className="grid gap-6 mt-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-brand-500" />
              PDF Report
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-neutral-400">
              Download a comprehensive PDF with deal summary, cash flow analysis,
              BRRR metrics, and 10-year projections.
            </p>
            <div className="rounded-lg bg-neutral-800/50 p-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Property</span>
                <span>{property.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Cash Flow</span>
                <span className={brrr.monthlyCashFlow >= 0 ? 'text-green-500' : 'text-red-500'}>
                  {formatCurrency(brrr.monthlyCashFlow)}/mo
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">CoC Return</span>
                <span>{formatPercent(brrr.initialCoCReturn)}</span>
              </div>
            </div>
            <Button onClick={handleExportPDF} loading={exporting} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              {exporting ? 'Generating PDF...' : 'Download PDF'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Report Contents</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                Property information and address
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                Deal summary with purchase details
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                Cash flow analysis breakdown
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                BRRR strategy metrics
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                10-year projection table
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                Key return metrics (Cap Rate, CoC, ROI)
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </Container>
  )
}
