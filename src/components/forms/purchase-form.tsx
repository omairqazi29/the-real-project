'use client'

import { usePropertyStore } from '@/store/property-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FINANCING_TYPES } from '@/lib/constants'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { DollarSign, Percent, Wallet } from 'lucide-react'
import { formatCurrency } from '@/lib/format'
import { useMemo } from 'react'

export function PurchaseForm() {
  const { form, setForm } = usePropertyStore()

  // Calculate derived values
  const calculations = useMemo(() => {
    const purchasePrice = form.purchase_price || 0
    const downPaymentPercent = form.down_payment_percent || 0
    const downPaymentAmount = form.down_payment_amount || (purchasePrice * (downPaymentPercent / 100))
    const loanAmount = purchasePrice - downPaymentAmount
    const closingCostPercent = form.closing_cost_percent || 0
    const closingCostFixed = form.closing_cost_fixed || 0
    const closingCosts = (purchasePrice * (closingCostPercent / 100)) + closingCostFixed
    const totalCashToClose = downPaymentAmount + closingCosts + (form.earnest_money || 0)

    return {
      downPaymentAmount,
      loanAmount,
      closingCosts,
      totalCashToClose,
    }
  }, [form.purchase_price, form.down_payment_percent, form.down_payment_amount, form.closing_cost_percent, form.closing_cost_fixed, form.earnest_money])

  const isCashPurchase = form.financing_type === 'cash'

  return (
    <div className="space-y-6">
      {/* Purchase Price */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <DollarSign className="h-5 w-5 text-brand-500" />
            Purchase Price
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="purchase_price">Purchase Price *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">$</span>
              <Input
                id="purchase_price"
                type="number"
                min="0"
                step="1000"
                placeholder="200,000"
                className="pl-7"
                value={form.purchase_price || ''}
                onChange={(e) => setForm({ purchase_price: Number(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="earnest_money">Earnest Money</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">$</span>
                <Input
                  id="earnest_money"
                  type="number"
                  min="0"
                  placeholder="1,000"
                  className="pl-7"
                  value={form.earnest_money || ''}
                  onChange={(e) => setForm({ earnest_money: Number(e.target.value) || 0 })}
                />
              </div>
              <p className="text-xs text-neutral-500">Typically 1-2% of purchase price</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financing */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Wallet className="h-5 w-5 text-brand-500" />
            Financing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="financing_type">Financing Type</Label>
            <Select
              value={form.financing_type}
              onValueChange={(value) => setForm({ financing_type: value as typeof form.financing_type })}
            >
              <SelectTrigger id="financing_type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {FINANCING_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex flex-col">
                      <span>{type.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.financing_type && (
              <p className="text-xs text-neutral-500">
                {FINANCING_TYPES.find((t) => t.value === form.financing_type)?.description}
              </p>
            )}
          </div>

          {!isCashPurchase && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="down_payment_percent">Down Payment (%)</Label>
                  <div className="relative">
                    <Input
                      id="down_payment_percent"
                      type="number"
                      min="0"
                      max="100"
                      step="0.5"
                      placeholder="25"
                      value={form.down_payment_percent || ''}
                      onChange={(e) => setForm({
                        down_payment_percent: Number(e.target.value) || 0,
                        down_payment_amount: null
                      })}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="down_payment_amount">Or Fixed Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">$</span>
                    <Input
                      id="down_payment_amount"
                      type="number"
                      min="0"
                      placeholder="50,000"
                      className="pl-7"
                      value={form.down_payment_amount ?? ''}
                      onChange={(e) => setForm({
                        down_payment_amount: e.target.value ? Number(e.target.value) : null
                      })}
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="interest_rate">Interest Rate (%)</Label>
                  <div className="relative">
                    <Input
                      id="interest_rate"
                      type="number"
                      min="0"
                      max="30"
                      step="0.125"
                      placeholder="7.0"
                      value={form.interest_rate || ''}
                      onChange={(e) => setForm({ interest_rate: Number(e.target.value) || 0 })}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loan_term_years">Loan Term</Label>
                  <Select
                    value={String(form.loan_term_years)}
                    onValueChange={(value) => setForm({ loan_term_years: Number(value) })}
                  >
                    <SelectTrigger id="loan_term_years">
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
                  <Label htmlFor="points">Loan Points</Label>
                  <Input
                    id="points"
                    type="number"
                    min="0"
                    max="10"
                    step="0.25"
                    placeholder="0"
                    value={form.points || ''}
                    onChange={(e) => setForm({ points: Number(e.target.value) || 0 })}
                  />
                  <p className="text-xs text-neutral-500">1 point = 1% of loan amount</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pmi_monthly">PMI (Monthly)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">$</span>
                    <Input
                      id="pmi_monthly"
                      type="number"
                      min="0"
                      placeholder="0"
                      className="pl-7"
                      value={form.pmi_monthly || ''}
                      onChange={(e) => setForm({ pmi_monthly: Number(e.target.value) || 0 })}
                    />
                  </div>
                  <p className="text-xs text-neutral-500">If less than 20% down</p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Closing Costs */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Percent className="h-5 w-5 text-brand-500" />
            Closing Costs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="closing_cost_percent">Closing Costs (%)</Label>
              <div className="relative">
                <Input
                  id="closing_cost_percent"
                  type="number"
                  min="0"
                  max="10"
                  step="0.25"
                  placeholder="3"
                  value={form.closing_cost_percent || ''}
                  onChange={(e) => setForm({ closing_cost_percent: Number(e.target.value) || 0 })}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">%</span>
              </div>
              <p className="text-xs text-neutral-500">Typically 2-5% of purchase price</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="closing_cost_fixed">Additional Fixed Costs</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">$</span>
                <Input
                  id="closing_cost_fixed"
                  type="number"
                  min="0"
                  placeholder="0"
                  className="pl-7"
                  value={form.closing_cost_fixed || ''}
                  onChange={(e) => setForm({ closing_cost_fixed: Number(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      {form.purchase_price > 0 && (
        <Card className="border-brand-500/30 bg-brand-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Buy Phase Summary</CardTitle>
            <CardDescription>Calculated values based on your inputs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex justify-between">
                <span className="text-neutral-400">Down Payment:</span>
                <span className="font-mono font-medium">{formatCurrency(calculations.downPaymentAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Loan Amount:</span>
                <span className="font-mono font-medium">{formatCurrency(calculations.loanAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Closing Costs:</span>
                <span className="font-mono font-medium">{formatCurrency(calculations.closingCosts)}</span>
              </div>
              <div className="flex justify-between border-t border-neutral-700 pt-2">
                <span className="font-medium">Total Cash to Close:</span>
                <span className="font-mono font-bold text-brand-500">{formatCurrency(calculations.totalCashToClose)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
