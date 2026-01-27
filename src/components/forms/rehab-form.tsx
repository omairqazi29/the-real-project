'use client'

import { useMemo } from 'react'
import { usePropertyStore } from '@/store/property-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { REHAB_CATEGORIES } from '@/lib/constants'
import type { RehabBudget } from '@/types/property'
import { Hammer, Clock, DollarSign } from 'lucide-react'
import { formatCurrency } from '@/lib/format'

export function RehabForm() {
  const { form, setForm } = usePropertyStore()

  const updateRehabItem = (key: keyof RehabBudget, value: number) => {
    const newBudget = { ...form.rehab_budget_itemized, [key]: value }
    const total = Object.values(newBudget).reduce((sum, val) => sum + (val || 0), 0)
    setForm({
      rehab_budget_itemized: newBudget,
      rehab_budget_total: total,
    })
  }

  const calculations = useMemo(() => {
    const rehabTotal = form.rehab_budget_total || 0
    const holdingCostsMonthly = form.holding_costs_monthly || 0
    const timelineMonths = form.rehab_timeline_months || 0
    const totalHoldingCosts = holdingCostsMonthly * timelineMonths
    const totalRehabCost = rehabTotal + totalHoldingCosts

    return {
      rehabTotal,
      totalHoldingCosts,
      totalRehabCost,
    }
  }, [form.rehab_budget_total, form.holding_costs_monthly, form.rehab_timeline_months])

  return (
    <div className="space-y-6">
      {/* Quick Entry */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Hammer className="h-5 w-5 text-brand-500" />
            Rehab Budget
          </CardTitle>
          <CardDescription>
            Enter a total budget or itemize below
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="rehab_budget_total">Total Rehab Budget</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">$</span>
                <Input
                  id="rehab_budget_total"
                  type="number"
                  min="0"
                  step="500"
                  placeholder="25,000"
                  className="pl-7"
                  value={form.rehab_budget_total || ''}
                  onChange={(e) => setForm({ rehab_budget_total: Number(e.target.value) || 0 })}
                />
              </div>
              <p className="text-xs text-neutral-500">
                {form.sqft && form.rehab_budget_total
                  ? `${formatCurrency(form.rehab_budget_total / form.sqft)}/sqft`
                  : 'Enter sqft to see cost per sqft'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Itemized Budget */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Itemized Breakdown</CardTitle>
          <CardDescription>
            Optional: break down your rehab budget by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {REHAB_CATEGORIES.map((category) => (
              <div key={category.key} className="space-y-1">
                <Label htmlFor={`rehab_${category.key}`} className="text-sm">
                  {category.label}
                </Label>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">$</span>
                  <Input
                    id={`rehab_${category.key}`}
                    type="number"
                    min="0"
                    step="100"
                    placeholder="0"
                    className="pl-6 h-9 text-sm"
                    value={form.rehab_budget_itemized[category.key as keyof RehabBudget] || ''}
                    onChange={(e) => updateRehabItem(
                      category.key as keyof RehabBudget,
                      Number(e.target.value) || 0
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Timeline & Holding Costs */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5 text-brand-500" />
            Timeline & Holding Costs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="rehab_timeline_months">Rehab Timeline</Label>
              <div className="relative">
                <Input
                  id="rehab_timeline_months"
                  type="number"
                  min="0"
                  max="36"
                  step="1"
                  placeholder="3"
                  value={form.rehab_timeline_months || ''}
                  onChange={(e) => setForm({ rehab_timeline_months: Number(e.target.value) || 0 })}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">months</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="holding_costs_monthly">Monthly Holding Costs</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">$</span>
                <Input
                  id="holding_costs_monthly"
                  type="number"
                  min="0"
                  placeholder="500"
                  className="pl-7"
                  value={form.holding_costs_monthly || ''}
                  onChange={(e) => setForm({ holding_costs_monthly: Number(e.target.value) || 0 })}
                />
              </div>
              <p className="text-xs text-neutral-500">
                Mortgage, utilities, insurance during rehab
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      {(form.rehab_budget_total > 0 || form.holding_costs_monthly > 0) && (
        <Card className="border-brand-500/30 bg-brand-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="h-5 w-5 text-brand-500" />
              Rehab Phase Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-neutral-400">Rehab Budget:</span>
                <span className="font-mono font-medium">{formatCurrency(calculations.rehabTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">
                  Holding Costs ({form.rehab_timeline_months || 0} mo):
                </span>
                <span className="font-mono font-medium">{formatCurrency(calculations.totalHoldingCosts)}</span>
              </div>
              <div className="flex justify-between border-t border-neutral-700 pt-2">
                <span className="font-medium">Total Rehab Cost:</span>
                <span className="font-mono font-bold text-brand-500">{formatCurrency(calculations.totalRehabCost)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
