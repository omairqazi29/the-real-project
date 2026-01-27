'use client'

import { useMemo } from 'react'
import { usePropertyStore } from '@/store/property-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Landmark, RefreshCw, DollarSign } from 'lucide-react'
import { formatCurrency, formatPercent } from '@/lib/format'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Info } from 'lucide-react'

export function RefinanceForm() {
  const { form, setForm } = usePropertyStore()

  const calculations = useMemo(() => {
    const arv = form.arv || 0
    const ltv = form.refi_ltv_percent || 75
    const newLoanAmount = arv * (ltv / 100)

    // Original loan
    const purchasePrice = form.purchase_price || 0
    const downPaymentPercent = form.down_payment_percent || 25
    const downPaymentAmount = form.down_payment_amount || (purchasePrice * (downPaymentPercent / 100))
    const originalLoanAmount = purchasePrice - downPaymentAmount

    // Rehab costs
    const rehabTotal = form.rehab_budget_total || 0
    const holdingCosts = (form.holding_costs_monthly || 0) * (form.rehab_timeline_months || 0)

    // Total invested
    const closingCostsBuy = (purchasePrice * ((form.closing_cost_percent || 0) / 100)) + (form.closing_cost_fixed || 0)
    const totalInvested = downPaymentAmount + closingCostsBuy + rehabTotal + holdingCosts

    // Refi closing costs
    const refiClosingCosts = (newLoanAmount * ((form.refi_closing_cost_percent || 0) / 100)) + (form.refi_closing_cost_fixed || 0)

    // Cash out
    const cashOutGross = newLoanAmount - originalLoanAmount
    const cashOutNet = cashOutGross - refiClosingCosts
    const cashLeftInDeal = Math.max(0, totalInvested - cashOutNet)

    // Forced equity
    const forcedEquity = arv - purchasePrice - rehabTotal

    // Infinite return check
    const isInfiniteReturn = cashLeftInDeal <= 0 && cashOutNet > 0

    return {
      arv,
      newLoanAmount,
      originalLoanAmount,
      totalInvested,
      refiClosingCosts,
      cashOutGross,
      cashOutNet,
      cashLeftInDeal,
      forcedEquity,
      isInfiniteReturn,
    }
  }, [form])

  return (
    <div className="space-y-6">
      {/* After Repair Value */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Landmark className="h-5 w-5 text-brand-500" />
            After Repair Value (ARV)
          </CardTitle>
          <CardDescription>
            The estimated value after rehab is complete
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Label htmlFor="arv">ARV *</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3.5 w-3.5 text-neutral-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Base this on comparable sales in the area for similar rehabbed properties.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">$</span>
                <Input
                  id="arv"
                  type="number"
                  min="0"
                  step="1000"
                  placeholder="300,000"
                  className="pl-7"
                  value={form.arv ?? ''}
                  onChange={(e) => setForm({ arv: e.target.value ? Number(e.target.value) : null })}
                />
              </div>
              {form.sqft && form.arv && (
                <p className="text-xs text-neutral-500">
                  {formatCurrency(form.arv / form.sqft)}/sqft
                </p>
              )}
            </div>
          </div>

          {form.arv && form.purchase_price && form.rehab_budget_total && (
            <div className="rounded-lg bg-neutral-800/50 p-3">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-400">Forced Equity:</span>
                <span className={`font-mono font-medium ${calculations.forcedEquity >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatCurrency(calculations.forcedEquity)}
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                ARV - Purchase Price - Rehab = Instant equity created
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Refinance Terms */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <RefreshCw className="h-5 w-5 text-brand-500" />
            Refinance Terms
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Label htmlFor="refi_ltv_percent">Loan-to-Value (LTV)</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3.5 w-3.5 text-neutral-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Most cash-out refinances allow 70-80% LTV for investment properties.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="relative">
                <Input
                  id="refi_ltv_percent"
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  placeholder="75"
                  value={form.refi_ltv_percent || ''}
                  onChange={(e) => setForm({ refi_ltv_percent: Number(e.target.value) || 0 })}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">%</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="refi_interest_rate">Interest Rate</Label>
              <div className="relative">
                <Input
                  id="refi_interest_rate"
                  type="number"
                  min="0"
                  max="30"
                  step="0.125"
                  placeholder="7.0"
                  value={form.refi_interest_rate || ''}
                  onChange={(e) => setForm({ refi_interest_rate: Number(e.target.value) || 0 })}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">%</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="refi_loan_term_years">Loan Term</Label>
              <Select
                value={String(form.refi_loan_term_years)}
                onValueChange={(value) => setForm({ refi_loan_term_years: Number(value) })}
              >
                <SelectTrigger id="refi_loan_term_years">
                  <SelectValue placeholder="Select term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 years</SelectItem>
                  <SelectItem value="20">20 years</SelectItem>
                  <SelectItem value="25">25 years</SelectItem>
                  <SelectItem value="30">30 years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="refi_closing_cost_percent">Closing Costs (%)</Label>
              <div className="relative">
                <Input
                  id="refi_closing_cost_percent"
                  type="number"
                  min="0"
                  max="10"
                  step="0.25"
                  placeholder="2"
                  value={form.refi_closing_cost_percent || ''}
                  onChange={(e) => setForm({ refi_closing_cost_percent: Number(e.target.value) || 0 })}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">%</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="refi_closing_cost_fixed">Additional Fixed Costs</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">$</span>
                <Input
                  id="refi_closing_cost_fixed"
                  type="number"
                  min="0"
                  placeholder="0"
                  className="pl-7"
                  value={form.refi_closing_cost_fixed || ''}
                  onChange={(e) => setForm({ refi_closing_cost_fixed: Number(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      {form.arv && form.arv > 0 && (
        <Card className={`border-brand-500/30 ${calculations.isInfiniteReturn ? 'bg-green-500/10 border-green-500/30' : 'bg-brand-500/5'}`}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="h-5 w-5 text-brand-500" />
              Refinance Phase Summary
              {calculations.isInfiniteReturn && (
                <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                  Infinite Return!
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-neutral-400">New Loan Amount ({form.refi_ltv_percent}% LTV):</span>
                <span className="font-mono font-medium">{formatCurrency(calculations.newLoanAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Original Loan Balance:</span>
                <span className="font-mono font-medium">{formatCurrency(calculations.originalLoanAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Gross Cash Out:</span>
                <span className="font-mono font-medium">{formatCurrency(calculations.cashOutGross)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Closing Costs:</span>
                <span className="font-mono font-medium text-red-400">-{formatCurrency(calculations.refiClosingCosts)}</span>
              </div>
              <div className="flex justify-between border-t border-neutral-700 pt-2">
                <span className="text-neutral-400">Net Cash Out:</span>
                <span className="font-mono font-medium text-green-500">{formatCurrency(calculations.cashOutNet)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Total Invested:</span>
                <span className="font-mono font-medium">{formatCurrency(calculations.totalInvested)}</span>
              </div>
              <div className="flex justify-between border-t border-neutral-700 pt-2">
                <span className="font-medium">Cash Left in Deal:</span>
                <span className={`font-mono font-bold ${calculations.cashLeftInDeal <= 0 ? 'text-green-500' : 'text-brand-500'}`}>
                  {formatCurrency(calculations.cashLeftInDeal)}
                </span>
              </div>
              {calculations.isInfiniteReturn && (
                <p className="text-xs text-green-400 mt-2">
                  You&apos;ve recovered all your capital and still own the property!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
