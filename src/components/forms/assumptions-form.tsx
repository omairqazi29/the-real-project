'use client'

import { usePropertyStore } from '@/store/property-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Settings } from 'lucide-react'
import { DEFAULT_ASSUMPTIONS } from '@/lib/constants'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Info } from 'lucide-react'

export function AssumptionsForm() {
  const { form, setForm } = usePropertyStore()

  return (
    <div className="space-y-6">
      {/* Appreciation */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-brand-500" />
            Property Appreciation
          </CardTitle>
          <CardDescription>
            Projected annual increase in property value
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Label htmlFor="appreciation_rate">Base Rate</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3.5 w-3.5 text-neutral-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Historical US average is around 3-4% annually. Local markets can vary significantly.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="relative">
                <Input
                  id="appreciation_rate"
                  type="number"
                  min="0"
                  max="20"
                  step="0.5"
                  placeholder={String(DEFAULT_ASSUMPTIONS.appreciation_rate)}
                  value={form.appreciation_rate || ''}
                  onChange={(e) => setForm({ appreciation_rate: Number(e.target.value) || 0 })}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">%</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="appreciation_low">Low Scenario</Label>
              <div className="relative">
                <Input
                  id="appreciation_low"
                  type="number"
                  min="-10"
                  max="20"
                  step="0.5"
                  placeholder="1"
                  value={form.appreciation_low || ''}
                  onChange={(e) => setForm({ appreciation_low: Number(e.target.value) || 0 })}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">%</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="appreciation_high">High Scenario</Label>
              <div className="relative">
                <Input
                  id="appreciation_high"
                  type="number"
                  min="0"
                  max="30"
                  step="0.5"
                  placeholder="5"
                  value={form.appreciation_high || ''}
                  onChange={(e) => setForm({ appreciation_high: Number(e.target.value) || 0 })}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rent Growth */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Rent Growth
          </CardTitle>
          <CardDescription>
            Projected annual increase in rental income
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Label htmlFor="rent_growth_rate">Annual Rent Growth</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3.5 w-3.5 text-neutral-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Historically tracks with or slightly below appreciation. 2-3% is a reasonable assumption.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="relative">
                <Input
                  id="rent_growth_rate"
                  type="number"
                  min="0"
                  max="15"
                  step="0.5"
                  placeholder={String(DEFAULT_ASSUMPTIONS.rent_growth_rate)}
                  value={form.rent_growth_rate || ''}
                  onChange={(e) => setForm({ rent_growth_rate: Number(e.target.value) || 0 })}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expense Growth */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingDown className="h-5 w-5 text-red-500" />
            Expense Growth
          </CardTitle>
          <CardDescription>
            Projected annual increase in operating expenses
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Label htmlFor="expense_growth_rate">Annual Expense Growth</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3.5 w-3.5 text-neutral-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Insurance, taxes, and maintenance costs typically increase with inflation. 2-3% is reasonable.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="relative">
                <Input
                  id="expense_growth_rate"
                  type="number"
                  min="0"
                  max="15"
                  step="0.5"
                  placeholder={String(DEFAULT_ASSUMPTIONS.expense_growth_rate)}
                  value={form.expense_growth_rate || ''}
                  onChange={(e) => setForm({ expense_growth_rate: Number(e.target.value) || 0 })}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="border-neutral-700 bg-neutral-800/50">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings className="h-5 w-5 text-neutral-400" />
            Assumptions Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Property Appreciation:</span>
              <div className="flex items-center gap-2 font-mono text-sm">
                <span className="text-red-400">{form.appreciation_low}%</span>
                <span className="text-neutral-500">/</span>
                <span className="text-brand-500 font-medium">{form.appreciation_rate}%</span>
                <span className="text-neutral-500">/</span>
                <span className="text-green-400">{form.appreciation_high}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Rent Growth:</span>
              <span className="font-mono text-sm text-green-400">{form.rent_growth_rate}% / year</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Expense Growth:</span>
              <span className="font-mono text-sm text-red-400">{form.expense_growth_rate}% / year</span>
            </div>
            <div className="flex items-center justify-between border-t border-neutral-700 pt-3">
              <span className="text-neutral-400">Net Income Growth:</span>
              <span className={`font-mono text-sm font-medium ${(form.rent_growth_rate - form.expense_growth_rate) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {((form.rent_growth_rate || 0) - (form.expense_growth_rate || 0)).toFixed(1)}% / year
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
