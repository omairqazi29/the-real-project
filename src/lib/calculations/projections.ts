import type { YearProjection, ScenarioResult } from '@/types/calculations'
import type { Property } from '@/types/property'
import { roundTo } from '@/lib/utils'
import { getLoanBalanceAtMonth } from './mortgage'
import { calculateCashFlow, type CashFlowInputs } from './cashflow'
import { calculateCashOnCash, calculateTotalROI, calculateIRR } from './returns'

export interface ProjectionInputs {
  // Initial values
  purchasePrice: number
  arv: number
  loanAmount: number
  interestRate: number
  loanTermYears: number
  totalCashInvested: number
  rehabBudget: number

  // Monthly rent and expenses
  monthlyRent: number
  vacancyPercent: number
  maintenancePercent: number
  capexPercent: number
  managementPercent: number
  insuranceMonthly: number
  propertyTaxAnnual: number
  hoaMonthly: number
  utilitiesMonthly: number
  otherExpensesMonthly: number
  pmiMonthly: number

  // Growth rates
  appreciationRate: number
  rentGrowthRate: number
  expenseGrowthRate: number

  // Projection settings
  years?: number
}

/**
 * Generate year-by-year projections
 */
export function generateProjections(
  inputs: ProjectionInputs,
  years: number = 10
): YearProjection[] {
  const {
    purchasePrice,
    arv,
    loanAmount,
    interestRate,
    loanTermYears,
    totalCashInvested,
    rehabBudget,
    monthlyRent,
    vacancyPercent,
    maintenancePercent,
    capexPercent,
    managementPercent,
    insuranceMonthly,
    propertyTaxAnnual,
    hoaMonthly,
    utilitiesMonthly,
    otherExpensesMonthly,
    pmiMonthly,
    appreciationRate,
    rentGrowthRate,
    expenseGrowthRate,
  } = inputs

  const projections: YearProjection[] = []
  let cumulativeCashFlow = 0

  // Calculate forced equity (ARV - Purchase - Rehab)
  const forcedEquity = arv - purchasePrice - rehabBudget

  for (let year = 1; year <= years; year++) {
    // Growth factors
    const appreciationFactor = Math.pow(1 + appreciationRate / 100, year)
    const rentGrowthFactor = Math.pow(1 + rentGrowthRate / 100, year - 1)
    const expenseGrowthFactor = Math.pow(1 + expenseGrowthRate / 100, year - 1)

    // Property value at this year
    const propertyValue = arv * appreciationFactor
    const yearAppreciation = propertyValue - arv

    // Loan balance at end of year
    const monthsElapsed = year * 12
    const loanBalance = getLoanBalanceAtMonth(loanAmount, interestRate, loanTermYears, monthsElapsed)

    // Equity components
    const equityForced = forcedEquity
    const equityAppreciation = yearAppreciation
    const equityPrincipal = loanAmount - loanBalance
    const equityTotal = equityForced + equityAppreciation + equityPrincipal

    // Adjusted rent and expenses for this year
    const adjustedRent = monthlyRent * rentGrowthFactor
    const adjustedInsurance = insuranceMonthly * expenseGrowthFactor
    const adjustedPropertyTax = propertyTaxAnnual * expenseGrowthFactor
    const adjustedHoa = hoaMonthly * expenseGrowthFactor

    // Calculate cash flow for this year
    const cashFlowInputs: CashFlowInputs = {
      monthlyRent: adjustedRent,
      vacancyPercent,
      maintenancePercent,
      capexPercent,
      managementPercent,
      insuranceMonthly: adjustedInsurance,
      propertyTaxAnnual: adjustedPropertyTax,
      hoaMonthly: adjustedHoa,
      utilitiesMonthly: utilitiesMonthly * expenseGrowthFactor,
      otherExpensesMonthly: otherExpensesMonthly * expenseGrowthFactor,
      loanAmount,
      interestRate,
      loanTermYears,
      pmiMonthly: year <= 5 ? pmiMonthly : 0, // PMI typically drops after equity reaches 20%
    }

    const yearCashFlow = calculateCashFlow(cashFlowInputs)
    cumulativeCashFlow += yearCashFlow.annualCashFlow

    // Calculate returns
    const cocReturn = calculateCashOnCash(yearCashFlow.annualCashFlow, totalCashInvested)
    const totalReturns = equityTotal + cumulativeCashFlow
    const totalROI = calculateTotalROI(totalReturns, totalCashInvested)

    projections.push({
      year,
      propertyValue: roundTo(propertyValue, 2),
      appreciation: roundTo(yearAppreciation, 2),
      loanBalance: roundTo(loanBalance, 2),
      equityForced: roundTo(equityForced, 2),
      equityAppreciation: roundTo(equityAppreciation, 2),
      equityPrincipal: roundTo(equityPrincipal, 2),
      equityTotal: roundTo(equityTotal, 2),
      monthlyRent: roundTo(adjustedRent, 2),
      monthlyExpenses: roundTo(yearCashFlow.operatingExpenses.total, 2),
      monthlyCashFlow: roundTo(yearCashFlow.monthlyCashFlow, 2),
      annualCashFlow: roundTo(yearCashFlow.annualCashFlow, 2),
      cumulativeCashFlow: roundTo(cumulativeCashFlow, 2),
      cocReturn: roundTo(cocReturn, 2),
      totalROI: roundTo(totalROI, 2),
    })
  }

  return projections
}

/**
 * Generate scenario comparison (Conservative, Base, Optimistic)
 */
export function generateScenarios(
  inputs: ProjectionInputs,
  years: number = 10
): ScenarioResult[] {
  const scenarios: ScenarioResult[] = []

  // Conservative scenario
  const conservativeInputs: ProjectionInputs = {
    ...inputs,
    appreciationRate: Math.max(0, inputs.appreciationRate - 2),
    rentGrowthRate: Math.max(0, inputs.rentGrowthRate - 1),
    vacancyPercent: Math.min(15, inputs.vacancyPercent + 3),
    maintenancePercent: inputs.maintenancePercent + 2,
  }

  const conservativeProjections = generateProjections(conservativeInputs, years)
  scenarios.push({
    name: 'Conservative',
    projections: conservativeProjections,
    summary: calculateProjectionSummary(conservativeProjections, inputs.totalCashInvested),
  })

  // Base scenario
  const baseProjections = generateProjections(inputs, years)
  scenarios.push({
    name: 'Base',
    projections: baseProjections,
    summary: calculateProjectionSummary(baseProjections, inputs.totalCashInvested),
  })

  // Optimistic scenario
  const optimisticInputs: ProjectionInputs = {
    ...inputs,
    appreciationRate: inputs.appreciationRate + 2,
    rentGrowthRate: inputs.rentGrowthRate + 1,
    vacancyPercent: Math.max(2, inputs.vacancyPercent - 2),
  }

  const optimisticProjections = generateProjections(optimisticInputs, years)
  scenarios.push({
    name: 'Optimistic',
    projections: optimisticProjections,
    summary: calculateProjectionSummary(optimisticProjections, inputs.totalCashInvested),
  })

  return scenarios
}

/**
 * Calculate summary metrics from projections
 */
function calculateProjectionSummary(
  projections: YearProjection[],
  totalCashInvested: number
): ScenarioResult['summary'] {
  const lastYear = projections[projections.length - 1]
  const totalCashFlow10yr = lastYear?.cumulativeCashFlow ?? 0
  const totalEquity10yr = lastYear?.equityTotal ?? 0
  const totalROI10yr = lastYear?.totalROI ?? 0

  const averageCoCReturn =
    projections.reduce((sum, p) => sum + p.cocReturn, 0) / projections.length

  // Calculate IRR
  const cashFlows = [-totalCashInvested]
  projections.forEach((p) => {
    cashFlows.push(p.annualCashFlow)
  })
  // Add sale proceeds in final year (equity)
  cashFlows[cashFlows.length - 1] += totalEquity10yr

  const irr = calculateIRR(cashFlows)

  return {
    totalCashFlow10yr: roundTo(totalCashFlow10yr, 2),
    totalEquity10yr: roundTo(totalEquity10yr, 2),
    totalROI10yr: roundTo(totalROI10yr, 2),
    averageCoCReturn: roundTo(averageCoCReturn, 2),
    irr: roundTo(irr, 2),
  }
}

/**
 * Generate projections from a property object
 */
export function generatePropertyProjections(
  property: Property,
  years: number = 10
): YearProjection[] {
  const purchasePrice = property.purchase_price
  const downPaymentPercent = property.down_payment_percent
  const downPayment = property.down_payment_amount ?? (purchasePrice * downPaymentPercent) / 100
  const loanAmount = purchasePrice - downPayment

  // Calculate total cash invested
  const closingCosts = (purchasePrice * property.closing_cost_percent) / 100 + property.closing_cost_fixed
  const rehabTotal = property.rehab_budget_total + (property.holding_costs_monthly * property.rehab_timeline_months)
  const totalCashInvested = downPayment + closingCosts + rehabTotal

  // Calculate property tax if not provided
  let propertyTaxAnnual = property.property_tax_annual ?? 0
  if (!propertyTaxAnnual && property.property_tax_rate) {
    propertyTaxAnnual = (purchasePrice * property.property_tax_rate) / 100
  }

  return generateProjections({
    purchasePrice,
    arv: property.arv ?? purchasePrice,
    loanAmount,
    interestRate: property.interest_rate,
    loanTermYears: property.loan_term_years,
    totalCashInvested,
    rehabBudget: property.rehab_budget_total,
    monthlyRent: property.monthly_rent ?? 0,
    vacancyPercent: property.vacancy_percent,
    maintenancePercent: property.maintenance_percent,
    capexPercent: property.capex_percent,
    managementPercent: property.management_percent,
    insuranceMonthly: property.insurance_monthly,
    propertyTaxAnnual,
    hoaMonthly: property.hoa_monthly,
    utilitiesMonthly: property.utilities_monthly,
    otherExpensesMonthly: property.other_expenses_monthly,
    pmiMonthly: property.pmi_monthly,
    appreciationRate: property.appreciation_rate,
    rentGrowthRate: property.rent_growth_rate,
    expenseGrowthRate: property.expense_growth_rate,
  }, years)
}
