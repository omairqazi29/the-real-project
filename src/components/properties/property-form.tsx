'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { usePropertyStore } from '@/store/property-store'
import {
  Button,
  Input,
  Label,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui'
import { PROPERTY_TYPES, PROPERTY_STATUSES, FINANCING_TYPES, DEFAULT_ASSUMPTIONS } from '@/lib/constants'
import { formatCurrency } from '@/lib/format'
import type { Property } from '@/types/property'

interface PropertyFormProps {
  property?: Property
  mode: 'create' | 'edit'
}

export function PropertyForm({ property, mode }: PropertyFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const { form, setForm, resetForm } = usePropertyStore()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const propertyData = {
        user_id: user.id,
        name: form.name,
        address: form.address || null,
        city: form.city || null,
        state: form.state || null,
        zip: form.zip || null,
        county: form.county || null,
        property_type: form.property_type,
        beds: form.beds,
        baths: form.baths,
        sqft: form.sqft,
        lot_sqft: form.lot_sqft,
        year_built: form.year_built,
        notes: form.notes || null,
        status: form.status,
        purchase_price: form.purchase_price,
        closing_cost_percent: form.closing_cost_percent,
        closing_cost_fixed: form.closing_cost_fixed,
        earnest_money: form.earnest_money,
        financing_type: form.financing_type,
        down_payment_percent: form.down_payment_percent,
        down_payment_amount: form.down_payment_amount,
        interest_rate: form.interest_rate,
        loan_term_years: form.loan_term_years,
        points: form.points,
        pmi_monthly: form.pmi_monthly,
        rehab_budget_total: form.rehab_budget_total,
        rehab_budget_itemized: form.rehab_budget_itemized,
        rehab_timeline_months: form.rehab_timeline_months,
        holding_costs_monthly: form.holding_costs_monthly,
        monthly_rent: form.monthly_rent,
        vacancy_percent: form.vacancy_percent,
        maintenance_percent: form.maintenance_percent,
        capex_percent: form.capex_percent,
        management_percent: form.management_percent,
        insurance_monthly: form.insurance_monthly,
        property_tax_annual: form.property_tax_annual,
        property_tax_rate: form.property_tax_rate,
        hoa_monthly: form.hoa_monthly,
        utilities_monthly: form.utilities_monthly,
        other_expenses_monthly: form.other_expenses_monthly,
        arv: form.arv,
        refi_ltv_percent: form.refi_ltv_percent,
        refi_interest_rate: form.refi_interest_rate,
        refi_loan_term_years: form.refi_loan_term_years,
        refi_closing_cost_percent: form.refi_closing_cost_percent,
        refi_closing_cost_fixed: form.refi_closing_cost_fixed,
        appreciation_rate: form.appreciation_rate,
        appreciation_low: form.appreciation_low,
        appreciation_high: form.appreciation_high,
        rent_growth_rate: form.rent_growth_rate,
        expense_growth_rate: form.expense_growth_rate,
      }

      if (mode === 'create') {
        const { data, error: insertError } = await supabase
          .from('properties')
          .insert(propertyData as never)
          .select()
          .single()

        if (insertError) throw insertError
        resetForm()
        router.push(`/properties/${(data as { id: string }).id}`)
      } else if (property) {
        const { error: updateError } = await supabase
          .from('properties')
          .update(propertyData as never)
          .eq('id', property.id)

        if (updateError) throw updateError
        router.push(`/properties/${property.id}`)
      }
    } catch (err) {
      console.error('Error saving property:', err)
      setError(err instanceof Error ? err.message : 'Failed to save property')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-red-400">
          {error}
        </div>
      )}

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="buy">Buy</TabsTrigger>
          <TabsTrigger value="rehab">Rehab</TabsTrigger>
          <TabsTrigger value="rent">Rent</TabsTrigger>
          <TabsTrigger value="refi">Refinance</TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="basic" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
              <CardDescription>Basic information about the property</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Property Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., 123 Main St Flip"
                    value={form.name}
                    onChange={(e) => setForm({ name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(value) => setForm({ status: value as typeof form.status })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROPERTY_STATUSES.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="Street address"
                  value={form.address}
                  onChange={(e) => setForm({ address: e.target.value })}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={form.city}
                    onChange={(e) => setForm({ city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    placeholder="CA"
                    maxLength={2}
                    value={form.state}
                    onChange={(e) => setForm({ state: e.target.value.toUpperCase() })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP</Label>
                  <Input
                    id="zip"
                    placeholder="12345"
                    value={form.zip}
                    onChange={(e) => setForm({ zip: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="county">County</Label>
                  <Input
                    id="county"
                    value={form.county}
                    onChange={(e) => setForm({ county: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-5">
                <div className="space-y-2">
                  <Label htmlFor="property_type">Type</Label>
                  <Select
                    value={form.property_type}
                    onValueChange={(value) => setForm({ property_type: value as typeof form.property_type })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROPERTY_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="beds">Beds</Label>
                  <Input
                    id="beds"
                    type="number"
                    min={0}
                    value={form.beds ?? ''}
                    onChange={(e) => setForm({ beds: e.target.value ? Number(e.target.value) : null })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="baths">Baths</Label>
                  <Input
                    id="baths"
                    type="number"
                    min={0}
                    step={0.5}
                    value={form.baths ?? ''}
                    onChange={(e) => setForm({ baths: e.target.value ? Number(e.target.value) : null })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sqft">Sq Ft</Label>
                  <Input
                    id="sqft"
                    type="number"
                    min={0}
                    value={form.sqft ?? ''}
                    onChange={(e) => setForm({ sqft: e.target.value ? Number(e.target.value) : null })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year_built">Year Built</Label>
                  <Input
                    id="year_built"
                    type="number"
                    min={1800}
                    max={new Date().getFullYear()}
                    value={form.year_built ?? ''}
                    onChange={(e) => setForm({ year_built: e.target.value ? Number(e.target.value) : null })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional notes about this property..."
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ notes: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Buy Tab */}
        <TabsContent value="buy" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Purchase Details</CardTitle>
              <CardDescription>Acquisition costs and financing terms</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="purchase_price">Purchase Price *</Label>
                  <Input
                    id="purchase_price"
                    type="number"
                    min={0}
                    step={1000}
                    value={form.purchase_price || ''}
                    onChange={(e) => setForm({ purchase_price: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="earnest_money">Earnest Money</Label>
                  <Input
                    id="earnest_money"
                    type="number"
                    min={0}
                    value={form.earnest_money || ''}
                    onChange={(e) => setForm({ earnest_money: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="closing_cost_percent">Closing Costs (%)</Label>
                  <Input
                    id="closing_cost_percent"
                    type="number"
                    min={0}
                    max={10}
                    step={0.5}
                    value={form.closing_cost_percent}
                    onChange={(e) => setForm({ closing_cost_percent: Number(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground">
                    ≈ {formatCurrency(form.purchase_price * (form.closing_cost_percent / 100))}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="closing_cost_fixed">+ Fixed Closing Costs</Label>
                  <Input
                    id="closing_cost_fixed"
                    type="number"
                    min={0}
                    value={form.closing_cost_fixed || ''}
                    onChange={(e) => setForm({ closing_cost_fixed: Number(e.target.value) })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Financing</CardTitle>
              <CardDescription>Loan terms for acquisition</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="financing_type">Financing Type</Label>
                  <Select
                    value={form.financing_type}
                    onValueChange={(value) => setForm({ financing_type: value as typeof form.financing_type })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FINANCING_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="down_payment_percent">Down Payment (%)</Label>
                  <Input
                    id="down_payment_percent"
                    type="number"
                    min={0}
                    max={100}
                    step={5}
                    value={form.down_payment_percent}
                    onChange={(e) => setForm({ down_payment_percent: Number(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground">
                    ≈ {formatCurrency(form.purchase_price * (form.down_payment_percent / 100))}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="interest_rate">Interest Rate (%)</Label>
                  <Input
                    id="interest_rate"
                    type="number"
                    min={0}
                    max={20}
                    step={0.125}
                    value={form.interest_rate}
                    onChange={(e) => setForm({ interest_rate: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loan_term_years">Loan Term (years)</Label>
                  <Select
                    value={String(form.loan_term_years)}
                    onValueChange={(value) => setForm({ loan_term_years: Number(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 years</SelectItem>
                      <SelectItem value="20">20 years</SelectItem>
                      <SelectItem value="30">30 years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="points">Points</Label>
                  <Input
                    id="points"
                    type="number"
                    min={0}
                    max={5}
                    step={0.5}
                    value={form.points || ''}
                    onChange={(e) => setForm({ points: Number(e.target.value) })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rehab Tab */}
        <TabsContent value="rehab" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Rehab Budget</CardTitle>
              <CardDescription>Renovation costs and timeline</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="rehab_budget_total">Total Rehab Budget</Label>
                  <Input
                    id="rehab_budget_total"
                    type="number"
                    min={0}
                    step={1000}
                    value={form.rehab_budget_total || ''}
                    onChange={(e) => setForm({ rehab_budget_total: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rehab_timeline_months">Timeline (months)</Label>
                  <Input
                    id="rehab_timeline_months"
                    type="number"
                    min={0}
                    max={24}
                    value={form.rehab_timeline_months}
                    onChange={(e) => setForm({ rehab_timeline_months: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="holding_costs_monthly">Monthly Holding Costs</Label>
                <Input
                  id="holding_costs_monthly"
                  type="number"
                  min={0}
                  value={form.holding_costs_monthly || ''}
                  onChange={(e) => setForm({ holding_costs_monthly: Number(e.target.value) })}
                />
                <p className="text-xs text-muted-foreground">
                  Total holding costs: {formatCurrency(form.holding_costs_monthly * form.rehab_timeline_months)}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rent Tab */}
        <TabsContent value="rent" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Rental Income</CardTitle>
              <CardDescription>Expected rental income after stabilization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="monthly_rent">Monthly Rent</Label>
                  <Input
                    id="monthly_rent"
                    type="number"
                    min={0}
                    step={50}
                    value={form.monthly_rent ?? ''}
                    onChange={(e) => setForm({ monthly_rent: e.target.value ? Number(e.target.value) : null })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vacancy_percent">Vacancy (%)</Label>
                  <Input
                    id="vacancy_percent"
                    type="number"
                    min={0}
                    max={50}
                    step={1}
                    value={form.vacancy_percent}
                    onChange={(e) => setForm({ vacancy_percent: Number(e.target.value) })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Operating Expenses</CardTitle>
              <CardDescription>Ongoing costs of owning the property</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="maintenance_percent">Maintenance (%)</Label>
                  <Input
                    id="maintenance_percent"
                    type="number"
                    min={0}
                    max={20}
                    step={1}
                    value={form.maintenance_percent}
                    onChange={(e) => setForm({ maintenance_percent: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capex_percent">CapEx (%)</Label>
                  <Input
                    id="capex_percent"
                    type="number"
                    min={0}
                    max={20}
                    step={1}
                    value={form.capex_percent}
                    onChange={(e) => setForm({ capex_percent: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="management_percent">Management (%)</Label>
                  <Input
                    id="management_percent"
                    type="number"
                    min={0}
                    max={15}
                    step={1}
                    value={form.management_percent}
                    onChange={(e) => setForm({ management_percent: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="insurance_monthly">Insurance (monthly)</Label>
                  <Input
                    id="insurance_monthly"
                    type="number"
                    min={0}
                    value={form.insurance_monthly}
                    onChange={(e) => setForm({ insurance_monthly: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="property_tax_annual">Property Tax (annual)</Label>
                  <Input
                    id="property_tax_annual"
                    type="number"
                    min={0}
                    value={form.property_tax_annual ?? ''}
                    onChange={(e) => setForm({ property_tax_annual: e.target.value ? Number(e.target.value) : null })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hoa_monthly">HOA (monthly)</Label>
                  <Input
                    id="hoa_monthly"
                    type="number"
                    min={0}
                    value={form.hoa_monthly || ''}
                    onChange={(e) => setForm({ hoa_monthly: Number(e.target.value) })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Refinance Tab */}
        <TabsContent value="refi" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>After Repair Value</CardTitle>
              <CardDescription>Estimated value after renovations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="arv">ARV (After Repair Value)</Label>
                <Input
                  id="arv"
                  type="number"
                  min={0}
                  step={5000}
                  value={form.arv ?? ''}
                  onChange={(e) => setForm({ arv: e.target.value ? Number(e.target.value) : null })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Refinance Terms</CardTitle>
              <CardDescription>Loan terms for cash-out refinance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="refi_ltv_percent">LTV (%)</Label>
                  <Input
                    id="refi_ltv_percent"
                    type="number"
                    min={0}
                    max={100}
                    step={5}
                    value={form.refi_ltv_percent}
                    onChange={(e) => setForm({ refi_ltv_percent: Number(e.target.value) })}
                  />
                  {form.arv && (
                    <p className="text-xs text-muted-foreground">
                      Max loan: {formatCurrency(form.arv * (form.refi_ltv_percent / 100))}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="refi_interest_rate">Interest Rate (%)</Label>
                  <Input
                    id="refi_interest_rate"
                    type="number"
                    min={0}
                    max={20}
                    step={0.125}
                    value={form.refi_interest_rate}
                    onChange={(e) => setForm({ refi_interest_rate: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="refi_loan_term_years">Loan Term (years)</Label>
                  <Select
                    value={String(form.refi_loan_term_years)}
                    onValueChange={(value) => setForm({ refi_loan_term_years: Number(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 years</SelectItem>
                      <SelectItem value="20">20 years</SelectItem>
                      <SelectItem value="30">30 years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="refi_closing_cost_percent">Closing Costs (%)</Label>
                  <Input
                    id="refi_closing_cost_percent"
                    type="number"
                    min={0}
                    max={10}
                    step={0.5}
                    value={form.refi_closing_cost_percent}
                    onChange={(e) => setForm({ refi_closing_cost_percent: Number(e.target.value) })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Form Actions */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving...' : mode === 'create' ? 'Create Property' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}
