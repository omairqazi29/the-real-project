'use client'

import { useMemo } from 'react'
import { usePropertyStore } from '@/store/property-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { DEFAULT_ASSUMPTIONS } from '@/lib/constants'
import { Home, Receipt, TrendingUp, DollarSign } from 'lucide-react'
import { formatCurrency, formatPercent } from '@/lib/format'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Info } from 'lucide-react'

export function RentForm() {
  const { form, setForm } = usePropertyStore()

  const calculations = useMemo(() => {
    const monthlyRent = form.monthly_rent || 0

    // Calculate expenses
    const vacancy = monthlyRent * ((form.vacancy_percent || 0) / 100)
    const maintenance = monthlyRent * ((form.maintenance_percent || 0) / 100)
    const capex = monthlyRent * ((form.capex_percent || 0) / 100)
    const management = monthlyRent * ((form.management_percent || 0) / 100)

    // Fixed expenses
    const insurance = form.insurance_monthly || 0
    const propertyTax = form.property_tax_annual
      ? form.property_tax_annual / 12
      : form.property_tax_rate && form.purchase_price
        ? (form.purchase_price * (form.property_tax_rate / 100)) / 12
        : 0
    const hoa = form.hoa_monthly || 0
    const utilities = form.utilities_monthly || 0
    const other = form.other_expenses_monthly || 0

    const totalExpenses = vacancy + maintenance + capex + management + insurance + propertyTax + hoa + utilities + other
    const noi = monthlyRent - totalExpenses

    // Calculate expense ratio
    const expenseRatio = monthlyRent > 0 ? (totalExpenses / monthlyRent) * 100 : 0

    return {
      vacancy,
      maintenance,
      capex,
      management,
      insurance,
      propertyTax,
      hoa,
      utilities,
      other,
      totalExpenses,
      noi,
      expenseRatio,
    }
  }, [form])

  return (
    <div className="space-y-6">
      {/* Rental Income */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Home className="h-5 w-5 text-brand-500" />
            Rental Income
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="monthly_rent">Monthly Rent *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">$</span>
                <Input
                  id="monthly_rent"
                  type="number"
                  min="0"
                  step="25"
                  placeholder="1,800"
                  className="pl-7"
                  value={form.monthly_rent ?? ''}
                  onChange={(e) => setForm({ monthly_rent: e.target.value ? Number(e.target.value) : null })}
                />
              </div>
              {form.sqft && form.monthly_rent && (
                <p className="text-xs text-neutral-500">
                  {formatCurrency(form.monthly_rent / form.sqft)}/sqft
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Operating Expenses - Percentage Based */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-brand-500" />
            Operating Expenses (% of Rent)
          </CardTitle>
          <CardDescription>
            These are calculated as a percentage of monthly rent
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Label htmlFor="vacancy_percent">Vacancy</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3.5 w-3.5 text-neutral-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Reserve for periods when the property is unoccupied. Industry standard is 5-8%.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="relative">
                <Input
                  id="vacancy_percent"
                  type="number"
                  min="0"
                  max="50"
                  step="0.5"
                  placeholder={String(DEFAULT_ASSUMPTIONS.vacancy_percent)}
                  value={form.vacancy_percent || ''}
                  onChange={(e) => setForm({ vacancy_percent: Number(e.target.value) || 0 })}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">%</span>
              </div>
              {form.monthly_rent && (
                <p className="text-xs text-neutral-500">{formatCurrency(calculations.vacancy)}/mo</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Label htmlFor="maintenance_percent">Maintenance</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3.5 w-3.5 text-neutral-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Day-to-day repairs and upkeep. Industry standard is 5-10%.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="relative">
                <Input
                  id="maintenance_percent"
                  type="number"
                  min="0"
                  max="50"
                  step="0.5"
                  placeholder={String(DEFAULT_ASSUMPTIONS.maintenance_percent)}
                  value={form.maintenance_percent || ''}
                  onChange={(e) => setForm({ maintenance_percent: Number(e.target.value) || 0 })}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">%</span>
              </div>
              {form.monthly_rent && (
                <p className="text-xs text-neutral-500">{formatCurrency(calculations.maintenance)}/mo</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Label htmlFor="capex_percent">CapEx Reserve</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3.5 w-3.5 text-neutral-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Capital expenditures for major replacements (roof, HVAC, etc). Industry standard is 5-10%.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="relative">
                <Input
                  id="capex_percent"
                  type="number"
                  min="0"
                  max="50"
                  step="0.5"
                  placeholder={String(DEFAULT_ASSUMPTIONS.capex_percent)}
                  value={form.capex_percent || ''}
                  onChange={(e) => setForm({ capex_percent: Number(e.target.value) || 0 })}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">%</span>
              </div>
              {form.monthly_rent && (
                <p className="text-xs text-neutral-500">{formatCurrency(calculations.capex)}/mo</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Label htmlFor="management_percent">Property Management</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3.5 w-3.5 text-neutral-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Fee paid to property manager. Industry standard is 8-12%. Set to 0 if self-managing.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="relative">
                <Input
                  id="management_percent"
                  type="number"
                  min="0"
                  max="50"
                  step="0.5"
                  placeholder={String(DEFAULT_ASSUMPTIONS.management_percent)}
                  value={form.management_percent || ''}
                  onChange={(e) => setForm({ management_percent: Number(e.target.value) || 0 })}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">%</span>
              </div>
              {form.monthly_rent && (
                <p className="text-xs text-neutral-500">{formatCurrency(calculations.management)}/mo</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fixed Expenses */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Receipt className="h-5 w-5 text-brand-500" />
            Fixed Expenses
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="insurance_monthly">Insurance (Monthly)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">$</span>
                <Input
                  id="insurance_monthly"
                  type="number"
                  min="0"
                  placeholder={String(DEFAULT_ASSUMPTIONS.insurance_monthly)}
                  className="pl-7"
                  value={form.insurance_monthly || ''}
                  onChange={(e) => setForm({ insurance_monthly: Number(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="property_tax_annual">Property Tax (Annual)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">$</span>
                <Input
                  id="property_tax_annual"
                  type="number"
                  min="0"
                  placeholder="2,400"
                  className="pl-7"
                  value={form.property_tax_annual ?? ''}
                  onChange={(e) => setForm({
                    property_tax_annual: e.target.value ? Number(e.target.value) : null,
                    property_tax_rate: null
                  })}
                />
              </div>
              {form.property_tax_annual && (
                <p className="text-xs text-neutral-500">
                  {formatCurrency(form.property_tax_annual / 12)}/mo
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="property_tax_rate">Or Tax Rate (%)</Label>
              <div className="relative">
                <Input
                  id="property_tax_rate"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  placeholder={String(DEFAULT_ASSUMPTIONS.property_tax_rate)}
                  value={form.property_tax_rate ?? ''}
                  onChange={(e) => setForm({
                    property_tax_rate: e.target.value ? Number(e.target.value) : null,
                    property_tax_annual: null
                  })}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">%</span>
              </div>
              <p className="text-xs text-neutral-500">Of property value</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hoa_monthly">HOA (Monthly)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">$</span>
                <Input
                  id="hoa_monthly"
                  type="number"
                  min="0"
                  placeholder="0"
                  className="pl-7"
                  value={form.hoa_monthly || ''}
                  onChange={(e) => setForm({ hoa_monthly: Number(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="utilities_monthly">Utilities (Monthly)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">$</span>
                <Input
                  id="utilities_monthly"
                  type="number"
                  min="0"
                  placeholder="0"
                  className="pl-7"
                  value={form.utilities_monthly || ''}
                  onChange={(e) => setForm({ utilities_monthly: Number(e.target.value) || 0 })}
                />
              </div>
              <p className="text-xs text-neutral-500">If landlord pays any utilities</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="other_expenses_monthly">Other (Monthly)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">$</span>
                <Input
                  id="other_expenses_monthly"
                  type="number"
                  min="0"
                  placeholder="0"
                  className="pl-7"
                  value={form.other_expenses_monthly || ''}
                  onChange={(e) => setForm({ other_expenses_monthly: Number(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      {form.monthly_rent && form.monthly_rent > 0 && (
        <Card className="border-brand-500/30 bg-brand-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="h-5 w-5 text-brand-500" />
              Rent Phase Summary
            </CardTitle>
            <CardDescription>Monthly cash flow before debt service</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-neutral-400">Gross Rent:</span>
                <span className="font-mono font-medium">{formatCurrency(form.monthly_rent || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Total Expenses:</span>
                <span className="font-mono font-medium text-red-400">-{formatCurrency(calculations.totalExpenses)}</span>
              </div>
              <div className="flex justify-between text-xs text-neutral-500 pl-4">
                <span>Expense Ratio:</span>
                <span>{formatPercent(calculations.expenseRatio)}</span>
              </div>
              <div className="flex justify-between border-t border-neutral-700 pt-2">
                <span className="font-medium">Net Operating Income:</span>
                <span className={`font-mono font-bold ${calculations.noi >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatCurrency(calculations.noi)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
