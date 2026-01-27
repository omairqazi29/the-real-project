'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { PageHeader, Container } from '@/components/layout'
import { StatusBadge } from '@/components/properties'
import { Button, Card, CardContent, CardHeader, CardTitle, Skeleton, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui'
import { EquityChart, CashFlowChart, WaterfallChart } from '@/components/charts'
import { DealSummaryCard } from '@/components/analysis'
import { calculatePropertyBRRR } from '@/lib/calculations/brrr'
import { generatePropertyProjections } from '@/lib/calculations/projections'
import { formatCurrency, formatPercent } from '@/lib/format'
import { Pencil, Trash2, ArrowLeft } from 'lucide-react'
import type { Property } from '@/types/property'
import type { BRRRResult, YearProjection } from '@/types/calculations'

interface PropertyPageProps {
  params: Promise<{ id: string }>
}

export default function PropertyPage({ params }: PropertyPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const supabase = createClient()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [brrrResult, setBrrrResult] = useState<BRRRResult | null>(null)
  const [projections, setProjections] = useState<YearProjection[]>([])

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

        // Calculate BRRR analysis
        const result = calculatePropertyBRRR(typedProperty)
        setBrrrResult(result)

        // Generate 10-year projections
        const projs = generatePropertyProjections(typedProperty, 10)
        setProjections(projs)
      } catch (error) {
        console.error('Error fetching property:', error)
        router.push('/properties')
      } finally {
        setLoading(false)
      }
    }

    fetchProperty()
  }, [id, supabase, router])

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      return
    }

    setDeleting(true)
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id)

      if (error) throw error
      router.push('/properties')
    } catch (error) {
      console.error('Error deleting property:', error)
      alert('Failed to delete property')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <Container size="xl">
        <div className="space-y-6">
          <Skeleton className="h-12 w-1/3" />
          <div className="grid gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
      </Container>
    )
  }

  if (!property || !brrrResult) {
    return null
  }

  return (
    <Container size="xl">
      <div className="space-y-6">
        {/* Back link */}
        <Link
          href="/properties"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Properties
        </Link>

        {/* Header */}
        <PageHeader
          title={property.name}
          description={
            property.address
              ? `${property.address}, ${property.city}, ${property.state} ${property.zip}`
              : 'No address provided'
          }
        >
          <div className="flex items-center gap-3">
            <StatusBadge status={property.status} />
            <Button variant="outline" asChild>
              <Link href={`/properties/${id}/edit`}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              <Trash2 className="h-4 w-4 mr-2" />
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </PageHeader>

        {/* Deal Summary with Data Transparency */}
        <DealSummaryCard
          purchase_price={property.purchase_price}
          closing_cost_percent={property.closing_cost_percent}
          closing_cost_fixed={property.closing_cost_fixed}
          down_payment_percent={property.down_payment_percent}
          down_payment_amount={property.down_payment_amount ?? null}
          interest_rate={property.interest_rate}
          loan_term_years={property.loan_term_years}
          financing_type={property.financing_type}
          rehab_budget_total={property.rehab_budget_total}
          rehab_timeline_months={property.rehab_timeline_months}
          holding_costs_monthly={property.holding_costs_monthly}
          monthly_rent={property.monthly_rent ?? null}
          vacancy_percent={property.vacancy_percent}
          maintenance_percent={property.maintenance_percent}
          capex_percent={property.capex_percent}
          management_percent={property.management_percent}
          insurance_monthly={property.insurance_monthly}
          property_tax_annual={property.property_tax_annual ?? null}
          property_tax_rate={property.property_tax_rate ?? null}
          hoa_monthly={property.hoa_monthly}
          utilities_monthly={property.utilities_monthly}
          other_expenses_monthly={property.other_expenses_monthly}
          arv={property.arv ?? null}
          refi_ltv_percent={property.refi_ltv_percent}
          refi_interest_rate={property.refi_interest_rate}
          refi_loan_term_years={property.refi_loan_term_years}
          refi_closing_cost_percent={property.refi_closing_cost_percent}
          refi_closing_cost_fixed={property.refi_closing_cost_fixed}
          appreciation_rate={property.appreciation_rate}
        />

        {/* Analysis Tabs */}
        <Tabs defaultValue="brrr" className="w-full">
          <TabsList>
            <TabsTrigger value="brrr">BRRR Analysis</TabsTrigger>
            <TabsTrigger value="projections">10-Year Projections</TabsTrigger>
            <TabsTrigger value="details">Property Details</TabsTrigger>
          </TabsList>

          <TabsContent value="brrr" className="space-y-6 mt-6">
            {/* BRRR Waterfall */}
            <div className="h-[400px]">
              <WaterfallChart brrr={brrrResult} />
            </div>

            {/* BRRR Breakdown */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Investment Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Purchase Price</span>
                    <span>{formatCurrency(property.purchase_price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Down Payment</span>
                    <span>{formatCurrency(brrrResult.downPayment)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Closing Costs</span>
                    <span>{formatCurrency(brrrResult.closingCosts)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rehab Budget</span>
                    <span>{formatCurrency(brrrResult.rehabBudget)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Holding Costs</span>
                    <span>{formatCurrency(brrrResult.holdingCosts)}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-semibold">
                    <span>Total Cash Invested</span>
                    <span>{formatCurrency(brrrResult.totalCashInvested)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Refinance Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">After Repair Value</span>
                    <span>{formatCurrency(property.arv || property.purchase_price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">LTV</span>
                    <span>{formatPercent(property.refi_ltv_percent)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">New Loan Amount</span>
                    <span>{formatCurrency(brrrResult.newLoanAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Refi Closing Costs</span>
                    <span>{formatCurrency(brrrResult.refiClosingCosts)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payoff Original Loan</span>
                    <span>{formatCurrency(brrrResult.loanAmount)}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-semibold">
                    <span>Net Cash Out</span>
                    <span className={brrrResult.netCashOut >= 0 ? 'text-green-500' : 'text-red-500'}>
                      {formatCurrency(brrrResult.netCashOut)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="projections" className="space-y-6 mt-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="h-[400px]">
                <EquityChart projections={projections} />
              </div>
              <div className="h-[400px]">
                <CashFlowChart projections={projections} />
              </div>
            </div>

            {/* Projections Table */}
            <Card>
              <CardHeader>
                <CardTitle>Year-by-Year Projections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3">Year</th>
                        <th className="text-right py-2 px-3">Property Value</th>
                        <th className="text-right py-2 px-3">Loan Balance</th>
                        <th className="text-right py-2 px-3">Total Equity</th>
                        <th className="text-right py-2 px-3">Annual Cash Flow</th>
                        <th className="text-right py-2 px-3">CoC Return</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projections.map((proj) => (
                        <tr key={proj.year} className="border-b border-border/50">
                          <td className="py-2 px-3">{proj.year}</td>
                          <td className="text-right py-2 px-3">{formatCurrency(proj.propertyValue)}</td>
                          <td className="text-right py-2 px-3">{formatCurrency(proj.loanBalance)}</td>
                          <td className="text-right py-2 px-3">{formatCurrency(proj.equityTotal)}</td>
                          <td className={`text-right py-2 px-3 ${proj.annualCashFlow >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {formatCurrency(proj.annualCashFlow)}
                          </td>
                          <td className="text-right py-2 px-3">{formatPercent(proj.cocReturn)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-6 mt-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Property Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span>{property.property_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Beds / Baths</span>
                    <span>{property.beds ?? '-'} / {property.baths ?? '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Square Feet</span>
                    <span>{property.sqft?.toLocaleString() ?? '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Year Built</span>
                    <span>{property.year_built ?? '-'}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Operating Expenses</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vacancy</span>
                    <span>{formatPercent(property.vacancy_percent)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Maintenance</span>
                    <span>{formatPercent(property.maintenance_percent)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">CapEx</span>
                    <span>{formatPercent(property.capex_percent)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Management</span>
                    <span>{formatPercent(property.management_percent)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Insurance</span>
                    <span>{formatCurrency(property.insurance_monthly)}/mo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Property Tax</span>
                    <span>{formatCurrency(property.property_tax_annual ?? 0)}/yr</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {property.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">{property.notes}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  )
}
