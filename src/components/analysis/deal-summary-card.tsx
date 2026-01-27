'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { DataPoint } from '@/components/transparency/data-point'
import { ConfidenceLegendCompact } from '@/components/transparency/confidence-legend'
import { calculateBRRR } from '@/lib/calculations/brrr'
import { formatCurrency, formatPercent } from '@/lib/format'
import { cn } from '@/lib/cn'
import type { DataInput, ConfidenceLevel } from '@/types/transparency'
import {
  Building,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
} from 'lucide-react'

interface DealSummaryCardProps {
  purchase_price: number
  closing_cost_percent: number
  closing_cost_fixed: number
  down_payment_percent: number
  down_payment_amount: number | null
  interest_rate: number
  loan_term_years: number
  financing_type: string
  rehab_budget_total: number
  rehab_timeline_months: number
  holding_costs_monthly: number
  monthly_rent: number | null
  vacancy_percent: number
  maintenance_percent: number
  capex_percent: number
  management_percent: number
  insurance_monthly: number
  property_tax_annual: number | null
  property_tax_rate: number | null
  hoa_monthly: number
  utilities_monthly: number
  other_expenses_monthly: number
  arv: number | null
  refi_ltv_percent: number
  refi_interest_rate: number
  refi_loan_term_years: number
  refi_closing_cost_percent: number
  refi_closing_cost_fixed: number
  appreciation_rate: number
  className?: string
}

export function DealSummaryCard(props: DealSummaryCardProps) {
  // Calculate property tax if not provided directly
  const propertyTaxAnnual = props.property_tax_annual ??
    (props.property_tax_rate && props.purchase_price
      ? (props.purchase_price * props.property_tax_rate) / 100
      : 0)

  const result = useMemo(() => {
    return calculateBRRR({
      purchasePrice: props.purchase_price || 0,
      closingCostPercent: props.closing_cost_percent || 0,
      closingCostFixed: props.closing_cost_fixed || 0,
      downPaymentPercent: props.down_payment_percent || 25,
      downPaymentFixed: props.down_payment_amount ?? undefined,
      interestRate: props.interest_rate || 7,
      loanTermYears: props.loan_term_years || 30,
      points: 0,
      pmiMonthly: 0,
      rehabBudgetTotal: props.rehab_budget_total || 0,
      rehabTimelineMonths: props.rehab_timeline_months || 0,
      holdingCostsMonthly: props.holding_costs_monthly || 0,
      monthlyRent: props.monthly_rent || 0,
      vacancyPercent: props.vacancy_percent || 5,
      maintenancePercent: props.maintenance_percent || 5,
      capexPercent: props.capex_percent || 8,
      managementPercent: props.management_percent || 0,
      insuranceMonthly: props.insurance_monthly || 0,
      propertyTaxAnnual,
      hoaMonthly: props.hoa_monthly || 0,
      utilitiesMonthly: props.utilities_monthly || 0,
      otherExpensesMonthly: props.other_expenses_monthly || 0,
      arv: props.arv || props.purchase_price || 0,
      refiLtvPercent: props.refi_ltv_percent || 75,
      refiInterestRate: props.refi_interest_rate || 7,
      refiLoanTermYears: props.refi_loan_term_years || 30,
      refiClosingCostPercent: props.refi_closing_cost_percent || 2,
      refiClosingCostFixed: props.refi_closing_cost_fixed || 0,
    })
  }, [props, propertyTaxAnnual])

  // Determine confidence levels based on data availability
  const getConfidence = (hasUserData: boolean, hasAllInputs: boolean): ConfidenceLevel => {
    if (hasUserData && hasAllInputs) return 'high'
    if (hasUserData || hasAllInputs) return 'medium'
    return 'low'
  }

  const cashFlowConfidence = getConfidence(
    props.monthly_rent !== null,
    props.monthly_rent !== null && props.purchase_price > 0
  )

  const arvConfidence = getConfidence(
    props.arv !== null,
    props.arv !== null && props.arv > 0
  )

  const cocConfidence = getConfidence(
    props.monthly_rent !== null && props.purchase_price > 0,
    props.monthly_rent !== null
  )

  // Calculate expense values for transparency
  const vacancyMonthly = (props.monthly_rent || 0) * (props.vacancy_percent / 100)
  const maintenanceMonthly = (props.monthly_rent || 0) * (props.maintenance_percent / 100)
  const capexMonthly = (props.monthly_rent || 0) * (props.capex_percent / 100)
  const managementMonthly = (props.monthly_rent || 0) * (props.management_percent / 100)
  const propertyTaxMonthly = propertyTaxAnnual / 12

  // Helper to create input objects for transparency
  const createCashFlowInputs = (): DataInput[] => [
    { name: 'Monthly Rent', value: props.monthly_rent || 0, source: props.monthly_rent ? 'user' : 'assumption', sourceDetail: props.monthly_rent ? 'User input' : 'Not provided' },
    { name: 'Vacancy', value: vacancyMonthly, source: 'calculated', sourceDetail: props.vacancy_percent + '% of rent' },
    { name: 'Maintenance', value: maintenanceMonthly, source: 'calculated', sourceDetail: props.maintenance_percent + '% of rent' },
    { name: 'CapEx', value: capexMonthly, source: 'calculated', sourceDetail: props.capex_percent + '% of rent' },
    { name: 'Management', value: managementMonthly, source: 'calculated', sourceDetail: props.management_percent + '% of rent' },
    { name: 'Insurance', value: props.insurance_monthly, source: props.insurance_monthly > 0 ? 'user' : 'assumption', sourceDetail: props.insurance_monthly > 0 ? 'User input' : 'Default' },
    { name: 'Property Tax', value: propertyTaxMonthly, source: props.property_tax_annual ? 'user' : 'calculated', sourceDetail: props.property_tax_annual ? 'User input' : 'Estimated' },
    { name: 'HOA', value: props.hoa_monthly, source: 'user', sourceDetail: 'User input' },
    { name: 'Monthly P&I', value: result.monthlyDebtService, source: 'calculated', sourceDetail: 'Amortization formula' },
  ]

  const createCocInputs = (): DataInput[] => [
    { name: 'Annual Cash Flow', value: result.annualCashFlow, source: 'calculated', sourceDetail: 'Monthly x 12' },
    { name: 'Total Investment', value: result.totalCashInvested, source: 'calculated', sourceDetail: 'Cash to close + Rehab' },
  ]

  const isPositiveCashFlow = result.monthlyCashFlow > 0
  const isInfiniteReturn = result.infiniteReturn

  // Calculate 1% rule
  const onePercentRatio = props.purchase_price > 0 ? ((props.monthly_rent || 0) / props.purchase_price) * 100 : 0
  const meetsOnePercentRule = onePercentRatio >= 1

  // Calculate expense ratio (50% rule)
  const expenseRatio = (props.monthly_rent || 0) > 0 ? (result.monthlyExpenses / (props.monthly_rent || 1)) * 100 : 0
  const meets50PercentRule = expenseRatio <= 50

  // Calculate 70% rule
  const allInCost = props.purchase_price + props.rehab_budget_total
  const allInPercentOfARV = (props.arv || 0) > 0 ? (allInCost / (props.arv || 1)) * 100 : 100
  const meets70PercentRule = allInPercentOfARV <= 70

  return (
    <Card className={cn('border-neutral-800', props.className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Building className="h-5 w-5 text-brand-500" />
            Deal Summary
          </CardTitle>
          <ConfidenceLegendCompact />
        </div>
        <CardDescription>
          Key metrics with full transparency - click any number to see the breakdown
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Primary Metrics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Monthly Cash Flow */}
          <div className={cn(
            'rounded-lg p-4 border',
            isPositiveCashFlow
              ? 'bg-green-500/10 border-green-500/30'
              : 'bg-red-500/10 border-red-500/30'
          )}>
            <DataPoint
              label="Monthly Cash Flow"
              value={result.monthlyCashFlow}
              format="currency"
              confidence={cashFlowConfidence}
              formula="Rent - Vacancy - Maintenance - CapEx - Management - Insurance - Tax - HOA - P&I"
              inputs={createCashFlowInputs()}
              helpText="Net monthly income after all expenses and debt service"
              size="md"
              valueClassName={isPositiveCashFlow ? 'text-green-500' : 'text-red-500'}
            />
            <div className="flex items-center gap-1 mt-1">
              {isPositiveCashFlow ? (
                <ArrowUpRight className="h-3 w-3 text-green-500" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-500" />
              )}
              <span className="text-xs text-neutral-500">
                {formatCurrency(result.annualCashFlow)}/year
              </span>
            </div>
          </div>

          {/* Cash-on-Cash Return */}
          <div className="rounded-lg p-4 border border-neutral-700 bg-neutral-800/50">
            <DataPoint
              label="Cash-on-Cash Return"
              value={result.initialCoCReturn}
              format="percent"
              confidence={cocConfidence}
              formula="(Annual Cash Flow / Total Cash Invested) x 100"
              inputs={createCocInputs()}
              helpText="Annual return on the actual cash you invest"
              size="md"
              valueClassName={result.initialCoCReturn >= 8 ? 'text-green-500' : result.initialCoCReturn >= 5 ? 'text-yellow-500' : 'text-red-500'}
            />
            <p className="text-xs text-neutral-500 mt-1">
              {result.initialCoCReturn >= 8 ? 'Excellent' : result.initialCoCReturn >= 5 ? 'Good' : 'Below target'}
            </p>
          </div>

          {/* Cap Rate */}
          <div className="rounded-lg p-4 border border-neutral-700 bg-neutral-800/50">
            <DataPoint
              label="Cap Rate"
              value={result.capRate}
              format="percent"
              confidence={cashFlowConfidence}
              formula="(Annual NOI / Property Value) x 100"
              inputs={[
                { name: 'Annual NOI', value: (result.monthlyRent - result.monthlyExpenses) * 12, source: 'calculated', sourceDetail: 'Rent - Operating Expenses' },
                { name: 'Property Value', value: props.purchase_price, source: 'user', sourceDetail: 'Purchase price' },
              ]}
              helpText="Return on property value, independent of financing"
              size="md"
            />
            <p className="text-xs text-neutral-500 mt-1">
              {result.capRate >= 8 ? 'Strong cash flow market' : result.capRate >= 5 ? 'Balanced market' : 'Appreciation market'}
            </p>
          </div>

          {/* Total Investment */}
          <div className="rounded-lg p-4 border border-neutral-700 bg-neutral-800/50">
            <DataPoint
              label="Total Investment"
              value={result.totalCashInvested}
              format="currency"
              confidence="high"
              formula="Down Payment + Closing Costs + Rehab + Holding Costs"
              inputs={[
                { name: 'Down Payment', value: result.downPayment, source: 'calculated', sourceDetail: props.down_payment_percent + '% of price' },
                { name: 'Closing Costs', value: result.closingCosts, source: 'calculated', sourceDetail: props.closing_cost_percent + '%' },
                { name: 'Rehab Budget', value: result.rehabBudget, source: 'user', sourceDetail: 'User input' },
                { name: 'Holding Costs', value: result.holdingCosts, source: 'calculated', sourceDetail: 'During rehab' },
              ]}
              helpText="Total out-of-pocket cash required"
              size="md"
            />
          </div>
        </div>

        {/* BRRR Specific Metrics */}
        {props.arv && props.arv > 0 && (
          <div className="border-t border-neutral-800 pt-4">
            <h4 className="text-sm font-medium text-neutral-400 mb-3 flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              BRRR Strategy Metrics
            </h4>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Forced Equity */}
              <div className="rounded-lg p-4 border border-neutral-700 bg-neutral-800/50">
                <DataPoint
                  label="Forced Equity"
                  value={result.forcedEquity}
                  format="currency"
                  confidence={arvConfidence}
                  formula="ARV - Purchase Price - Rehab"
                  inputs={[
                    { name: 'ARV', value: props.arv, source: 'user', sourceDetail: 'User estimate' },
                    { name: 'Purchase Price', value: props.purchase_price, source: 'user', sourceDetail: 'User input' },
                    { name: 'Rehab Budget', value: result.rehabBudget, source: 'user', sourceDetail: 'User input' },
                  ]}
                  helpText="Instant equity created through the rehab"
                  size="sm"
                  valueClassName={result.forcedEquity >= 0 ? 'text-green-500' : 'text-red-500'}
                />
              </div>

              {/* Cash Left in Deal */}
              <div className={cn(
                'rounded-lg p-4 border',
                isInfiniteReturn
                  ? 'bg-green-500/10 border-green-500/30'
                  : 'border-neutral-700 bg-neutral-800/50'
              )}>
                <DataPoint
                  label="Cash Left in Deal"
                  value={result.cashLeftInDeal}
                  format="currency"
                  confidence={arvConfidence}
                  formula="Total Invested - Net Cash Out"
                  inputs={[
                    { name: 'Total Invested', value: result.totalCashInvested, source: 'calculated', sourceDetail: 'Sum of all costs' },
                    { name: 'Net Cash Out', value: result.netCashOut, source: 'calculated', sourceDetail: 'Refi proceeds - closing costs' },
                  ]}
                  helpText={isInfiniteReturn ? 'You recovered all your capital!' : 'Capital still tied up in the deal'}
                  size="sm"
                  valueClassName={isInfiniteReturn ? 'text-green-500' : undefined}
                />
                {isInfiniteReturn && (
                  <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full mt-2 inline-block">
                    Infinite Return!
                  </span>
                )}
              </div>

              {/* Post-Refi Cash Flow */}
              <div className="rounded-lg p-4 border border-neutral-700 bg-neutral-800/50">
                <DataPoint
                  label="Post-Refi Cash Flow"
                  value={result.postRefiCashFlow}
                  format="currency"
                  confidence={arvConfidence}
                  formula="NOI - New Mortgage Payment"
                  inputs={[
                    { name: 'Monthly NOI', value: result.monthlyRent - result.monthlyExpenses, source: 'calculated', sourceDetail: 'Rent - Operating Expenses' },
                    { name: 'New P&I', value: result.newMonthlyPayment, source: 'calculated', sourceDetail: 'After refinance' },
                  ]}
                  helpText="Monthly cash flow after refinancing"
                  size="sm"
                  valueClassName={result.postRefiCashFlow >= 0 ? 'text-green-500' : 'text-red-500'}
                />
              </div>

              {/* Post-Refi CoC */}
              <div className="rounded-lg p-4 border border-neutral-700 bg-neutral-800/50">
                <DataPoint
                  label="Post-Refi CoC"
                  value={isInfiniteReturn ? null : result.postRefiCoCReturn}
                  format="percent"
                  confidence={arvConfidence}
                  formula={isInfiniteReturn ? 'Cash Left = 0 -> Infinite Return' : '(Annual Cash Flow / Cash Left) x 100'}
                  inputs={isInfiniteReturn ? [] : [
                    { name: 'Annual Cash Flow', value: result.postRefiCashFlow * 12, source: 'calculated', sourceDetail: 'Monthly x 12' },
                    { name: 'Cash Left in Deal', value: result.cashLeftInDeal, source: 'calculated', sourceDetail: 'Remaining capital' },
                  ]}
                  helpText={isInfiniteReturn ? 'Infinite return - no capital in the deal!' : 'Return on remaining invested capital'}
                  size="sm"
                  valueClassName="text-green-500"
                />
                {isInfiniteReturn && (
                  <span className="font-mono text-lg font-bold text-green-500">Infinity</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats Row */}
        <div className="border-t border-neutral-800 pt-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-neutral-500">Purchase Price</span>
              <p className="font-mono font-medium">{formatCurrency(props.purchase_price)}</p>
            </div>
            <div>
              <span className="text-neutral-500">Loan Amount</span>
              <p className="font-mono font-medium">{formatCurrency(result.loanAmount)}</p>
            </div>
            <div>
              <span className="text-neutral-500">Monthly P&I</span>
              <p className="font-mono font-medium">{formatCurrency(result.monthlyDebtService)}</p>
            </div>
            <div>
              <span className="text-neutral-500">Monthly Rent</span>
              <p className="font-mono font-medium">{formatCurrency(props.monthly_rent || 0)}</p>
            </div>
          </div>
        </div>

        {/* Rule of Thumb Checks */}
        <div className="border-t border-neutral-800 pt-4">
          <h4 className="text-sm font-medium text-neutral-400 mb-3">Quick Checks</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
            <RuleCheck
              label="1% Rule"
              passed={meetsOnePercentRule}
              detail={formatPercent(onePercentRatio)}
              target=">= 1%"
            />
            <RuleCheck
              label="50% Rule"
              passed={meets50PercentRule}
              detail={formatPercent(expenseRatio)}
              target="<= 50%"
            />
            <RuleCheck
              label="70% Rule"
              passed={meets70PercentRule}
              detail={formatPercent(allInPercentOfARV)}
              target="<= 70%"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function RuleCheck({
  label,
  passed,
  detail,
  target,
}: {
  label: string
  passed: boolean
  detail: string
  target: string
}) {
  return (
    <div className={cn(
      'rounded-lg p-2 border',
      passed
        ? 'bg-green-500/10 border-green-500/30'
        : 'bg-neutral-800/50 border-neutral-700'
    )}>
      <div className="flex items-center justify-between">
        <span className={cn(
          'font-medium',
          passed ? 'text-green-500' : 'text-neutral-400'
        )}>
          {label}
        </span>
        <span className={cn(
          'font-mono text-xs',
          passed ? 'text-green-500' : 'text-neutral-500'
        )}>
          {passed ? 'PASS' : 'FAIL'}
        </span>
      </div>
      <div className="flex items-center justify-between mt-1">
        <span className="font-mono text-xs">{detail}</span>
        <span className="text-xs text-neutral-500">{target}</span>
      </div>
    </div>
  )
}
