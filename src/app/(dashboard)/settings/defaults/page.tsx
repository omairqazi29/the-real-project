'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PageHeader, Container } from '@/components/layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { DEFAULT_ASSUMPTIONS } from '@/lib/constants'
import { ArrowLeft, Save, RotateCcw } from 'lucide-react'
import Link from 'next/link'

type Assumptions = typeof DEFAULT_ASSUMPTIONS

export default function DefaultAssumptionsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [assumptions, setAssumptions] = useState<Assumptions>({ ...DEFAULT_ASSUMPTIONS })

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data } = await supabase
        .from('profiles')
        .select('default_assumptions')
        .eq('id', user.id)
        .single() as { data: { default_assumptions: Record<string, unknown> } | null }

      if (data?.default_assumptions && typeof data.default_assumptions === 'object') {
        setAssumptions({ ...DEFAULT_ASSUMPTIONS, ...(data.default_assumptions as Partial<Assumptions>) })
      }
    }
    load()
  }, [supabase, router])

  const handleSave = async () => {
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from('profiles') as any).update({ default_assumptions: assumptions }).eq('id', user.id)

      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    setAssumptions({ ...DEFAULT_ASSUMPTIONS })
  }

  const updateField = (key: keyof Assumptions, value: number) => {
    setAssumptions(prev => ({ ...prev, [key]: value }))
  }

  return (
    <Container>
      <Link
        href="/settings"
        className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-100 transition-colors mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Settings
      </Link>

      <PageHeader
        title="Default Assumptions"
        description="These values will be pre-filled when you create a new property analysis. You can always override them per property."
      >
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button onClick={handleSave} loading={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saved ? 'Saved!' : 'Save Changes'}
          </Button>
        </div>
      </PageHeader>

      <div className="grid gap-6 mt-6 md:grid-cols-2">
        {/* Expense Percentages */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Rates (% of Rent)</CardTitle>
            <CardDescription>Default percentages applied to monthly rent</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Vacancy (%)</Label>
              <Input
                type="number"
                step="0.5"
                value={assumptions.vacancy_percent}
                onChange={e => updateField('vacancy_percent', Number(e.target.value))}
                suffix={<span>%</span>}
              />
            </div>
            <div>
              <Label>Maintenance (%)</Label>
              <Input
                type="number"
                step="0.5"
                value={assumptions.maintenance_percent}
                onChange={e => updateField('maintenance_percent', Number(e.target.value))}
                suffix={<span>%</span>}
              />
            </div>
            <div>
              <Label>CapEx (%)</Label>
              <Input
                type="number"
                step="0.5"
                value={assumptions.capex_percent}
                onChange={e => updateField('capex_percent', Number(e.target.value))}
                suffix={<span>%</span>}
              />
            </div>
            <div>
              <Label>Property Management (%)</Label>
              <Input
                type="number"
                step="0.5"
                value={assumptions.management_percent}
                onChange={e => updateField('management_percent', Number(e.target.value))}
                suffix={<span>%</span>}
              />
            </div>
          </CardContent>
        </Card>

        {/* Fixed Expenses */}
        <Card>
          <CardHeader>
            <CardTitle>Fixed Expenses</CardTitle>
            <CardDescription>Default monthly/annual amounts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Insurance (monthly)</Label>
              <Input
                type="number"
                value={assumptions.insurance_monthly}
                onChange={e => updateField('insurance_monthly', Number(e.target.value))}
                icon={<span>$</span>}
              />
            </div>
            <div>
              <Label>Property Tax Rate (%)</Label>
              <Input
                type="number"
                step="0.1"
                value={assumptions.property_tax_rate}
                onChange={e => updateField('property_tax_rate', Number(e.target.value))}
                suffix={<span>%</span>}
              />
            </div>
          </CardContent>
        </Card>

        {/* Financing */}
        <Card>
          <CardHeader>
            <CardTitle>Financing Defaults</CardTitle>
            <CardDescription>Default loan and closing cost parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Down Payment (%)</Label>
              <Input
                type="number"
                step="1"
                value={assumptions.down_payment_percent}
                onChange={e => updateField('down_payment_percent', Number(e.target.value))}
                suffix={<span>%</span>}
              />
            </div>
            <div>
              <Label>Interest Rate (%)</Label>
              <Input
                type="number"
                step="0.125"
                value={assumptions.interest_rate}
                onChange={e => updateField('interest_rate', Number(e.target.value))}
                suffix={<span>%</span>}
              />
            </div>
            <div>
              <Label>Loan Term (years)</Label>
              <Input
                type="number"
                value={assumptions.loan_term_years}
                onChange={e => updateField('loan_term_years', Number(e.target.value))}
                suffix={<span>yrs</span>}
              />
            </div>
            <div>
              <Label>Buy Closing Costs (%)</Label>
              <Input
                type="number"
                step="0.5"
                value={assumptions.closing_cost_buy_percent}
                onChange={e => updateField('closing_cost_buy_percent', Number(e.target.value))}
                suffix={<span>%</span>}
              />
            </div>
            <div>
              <Label>Refi Closing Costs (%)</Label>
              <Input
                type="number"
                step="0.5"
                value={assumptions.closing_cost_refi_percent}
                onChange={e => updateField('closing_cost_refi_percent', Number(e.target.value))}
                suffix={<span>%</span>}
              />
            </div>
            <div>
              <Label>Refi LTV (%)</Label>
              <Input
                type="number"
                step="1"
                value={assumptions.refi_ltv_percent}
                onChange={e => updateField('refi_ltv_percent', Number(e.target.value))}
                suffix={<span>%</span>}
              />
            </div>
          </CardContent>
        </Card>

        {/* Growth Rates */}
        <Card>
          <CardHeader>
            <CardTitle>Growth Rates</CardTitle>
            <CardDescription>Annual growth assumptions for projections</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Appreciation Rate (%)</Label>
              <Input
                type="number"
                step="0.5"
                value={assumptions.appreciation_rate}
                onChange={e => updateField('appreciation_rate', Number(e.target.value))}
                suffix={<span>%</span>}
              />
            </div>
            <div>
              <Label>Rent Growth Rate (%)</Label>
              <Input
                type="number"
                step="0.5"
                value={assumptions.rent_growth_rate}
                onChange={e => updateField('rent_growth_rate', Number(e.target.value))}
                suffix={<span>%</span>}
              />
            </div>
            <div>
              <Label>Expense Growth Rate (%)</Label>
              <Input
                type="number"
                step="0.5"
                value={assumptions.expense_growth_rate}
                onChange={e => updateField('expense_growth_rate', Number(e.target.value))}
                suffix={<span>%</span>}
              />
            </div>
            <div>
              <Label>Selling Costs (%)</Label>
              <Input
                type="number"
                step="0.5"
                value={assumptions.selling_cost_percent}
                onChange={e => updateField('selling_cost_percent', Number(e.target.value))}
                suffix={<span>%</span>}
              />
            </div>
            <div>
              <Label>Rehab Timeline (months)</Label>
              <Input
                type="number"
                value={assumptions.rehab_timeline_months}
                onChange={e => updateField('rehab_timeline_months', Number(e.target.value))}
                suffix={<span>mo</span>}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  )
}
