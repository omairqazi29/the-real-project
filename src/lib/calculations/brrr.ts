import type { BRRRResult } from '@/types/calculations'
import type { Property } from '@/types/property'
import { roundTo } from '@/lib/utils'
import { calculateMonthlyPI, calculateMortgage } from './mortgage'
import { calculateCashFlow, type CashFlowInputs } from './cashflow'
import { calculateCapRate, calculateCashOnCash } from './returns'

export interface BRRRInputs {
  // Buy Phase
  purchasePrice: number
  closingCostPercent: number
  closingCostFixed: number
  downPaymentPercent: number
  downPaymentFixed?: number
  interestRate: number
  loanTermYears: number
  points: number
  pmiMonthly: number

  // Rehab Phase
  rehabBudgetTotal: number
  rehabTimelineMonths: number
  holdingCostsMonthly: number

  // Rent Phase
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

  // Refinance Phase
  arv: number
  refiLtvPercent: number
  refiInterestRate: number
  refiLoanTermYears: number
  refiClosingCostPercent: number
  refiClosingCostFixed: number
}

/**
 * Full BRRR (Buy, Rehab, Rent, Refinance) analysis
 */
export function calculateBRRR(inputs: BRRRInputs): BRRRResult {
  const {
    // Buy
    purchasePrice,
    closingCostPercent,
    closingCostFixed,
    downPaymentPercent,
    downPaymentFixed,
    interestRate,
    loanTermYears,
    points,
    pmiMonthly,
    // Rehab
    rehabBudgetTotal,
    rehabTimelineMonths,
    holdingCostsMonthly,
    // Rent
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
    // Refinance
    arv,
    refiLtvPercent,
    refiInterestRate,
    refiLoanTermYears,
    refiClosingCostPercent,
    refiClosingCostFixed,
  } = inputs

  // ========== BUY PHASE ==========
  const closingCosts = (purchasePrice * closingCostPercent) / 100 + closingCostFixed
  const downPayment = downPaymentFixed ?? (purchasePrice * downPaymentPercent) / 100
  const pointsCost = (purchasePrice * points) / 100
  const loanAmount = purchasePrice - downPayment
  const totalCashToBuy = downPayment + closingCosts + pointsCost

  // ========== REHAB PHASE ==========
  const totalHoldingCosts = holdingCostsMonthly * rehabTimelineMonths
  const totalRehabCosts = rehabBudgetTotal + totalHoldingCosts

  // ========== RENT PHASE (Pre-Refi) ==========
  const initialMortgage = calculateMortgage(
    purchasePrice,
    downPaymentPercent,
    interestRate,
    loanTermYears,
    pmiMonthly,
    downPaymentFixed
  )

  const initialCashFlowInputs: CashFlowInputs = {
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
    loanAmount: initialMortgage.loanAmount,
    interestRate,
    loanTermYears,
    pmiMonthly,
  }

  const initialCashFlow = calculateCashFlow(initialCashFlowInputs)
  const initialCapRate = calculateCapRate(initialCashFlow.netOperatingIncome * 12, purchasePrice)

  // Total initial investment
  const totalCashInvested = totalCashToBuy + totalRehabCosts

  const initialCoCReturn = calculateCashOnCash(
    initialCashFlow.annualCashFlow,
    totalCashInvested
  )

  // ========== REFINANCE PHASE ==========
  const newLoanAmount = (arv * refiLtvPercent) / 100
  const refiClosingCosts = (newLoanAmount * refiClosingCostPercent) / 100 + refiClosingCostFixed

  // Cash out = New loan - Old loan balance - Refi closing costs
  const cashOut = newLoanAmount - loanAmount
  const netCashOut = cashOut - refiClosingCosts

  // Cash left in deal = Total invested - Net cash out
  const cashLeftInDeal = Math.max(0, totalCashInvested - netCashOut)

  // Post-refi payment (no PMI typically after refi to 75% LTV)
  const newMonthlyPayment = calculateMonthlyPI(newLoanAmount, refiInterestRate, refiLoanTermYears)

  // Post-refi cash flow
  const postRefiCashFlowInputs: CashFlowInputs = {
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
    loanAmount: newLoanAmount,
    interestRate: refiInterestRate,
    loanTermYears: refiLoanTermYears,
    pmiMonthly: 0, // No PMI after refi
  }

  const postRefiCashFlow = calculateCashFlow(postRefiCashFlowInputs)

  // Post-refi CoC return
  const postRefiCoCReturn = cashLeftInDeal > 0
    ? calculateCashOnCash(postRefiCashFlow.annualCashFlow, cashLeftInDeal)
    : Infinity // Infinite return if no cash left in deal

  // ========== EQUITY CALCULATIONS ==========
  const forcedEquity = arv - purchasePrice - rehabBudgetTotal
  const initialEquityPercent = ((arv - newLoanAmount) / arv) * 100

  // ========== SUMMARY METRICS ==========
  const capitalRecycled = netCashOut > 0 ? netCashOut : 0
  const velocityOfMoney = totalCashInvested > 0 ? capitalRecycled / totalCashInvested : 0
  const infiniteReturn = cashLeftInDeal <= 0

  return {
    // Buy phase
    purchasePrice: roundTo(purchasePrice, 2),
    closingCosts: roundTo(closingCosts, 2),
    downPayment: roundTo(downPayment, 2),
    loanAmount: roundTo(loanAmount, 2),
    totalCashToBuy: roundTo(totalCashToBuy, 2),

    // Rehab phase
    rehabBudget: roundTo(rehabBudgetTotal, 2),
    holdingCosts: roundTo(totalHoldingCosts, 2),
    totalRehabCosts: roundTo(totalRehabCosts, 2),

    // Rent phase
    monthlyRent: roundTo(monthlyRent, 2),
    monthlyExpenses: roundTo(initialCashFlow.operatingExpenses.total, 2),
    monthlyDebtService: roundTo(initialCashFlow.debtService, 2),
    monthlyCashFlow: roundTo(initialCashFlow.monthlyCashFlow, 2),
    annualCashFlow: roundTo(initialCashFlow.annualCashFlow, 2),
    capRate: roundTo(initialCapRate, 2),
    initialCoCReturn: roundTo(initialCoCReturn, 2),

    // Refinance phase
    arv: roundTo(arv, 2),
    newLoanAmount: roundTo(newLoanAmount, 2),
    cashOut: roundTo(cashOut, 2),
    refiClosingCosts: roundTo(refiClosingCosts, 2),
    netCashOut: roundTo(netCashOut, 2),
    cashLeftInDeal: roundTo(cashLeftInDeal, 2),
    newMonthlyPayment: roundTo(newMonthlyPayment, 2),
    postRefiCashFlow: roundTo(postRefiCashFlow.monthlyCashFlow, 2),
    postRefiCoCReturn: infiniteReturn ? Infinity : roundTo(postRefiCoCReturn, 2),

    // Equity
    forcedEquity: roundTo(forcedEquity, 2),
    initialEquityPercent: roundTo(initialEquityPercent, 2),

    // Summary
    totalCashInvested: roundTo(totalCashInvested, 2),
    capitalRecycled: roundTo(capitalRecycled, 2),
    velocityOfMoney: roundTo(velocityOfMoney, 2),
    infiniteReturn,
  }
}

/**
 * Calculate BRRR analysis from a property object
 */
export function calculatePropertyBRRR(property: Property): BRRRResult {
  // Calculate property tax if not provided
  let propertyTaxAnnual = property.property_tax_annual ?? 0
  if (!propertyTaxAnnual && property.property_tax_rate) {
    propertyTaxAnnual = (property.purchase_price * property.property_tax_rate) / 100
  }

  return calculateBRRR({
    purchasePrice: property.purchase_price,
    closingCostPercent: property.closing_cost_percent,
    closingCostFixed: property.closing_cost_fixed,
    downPaymentPercent: property.down_payment_percent,
    downPaymentFixed: property.down_payment_amount ?? undefined,
    interestRate: property.interest_rate,
    loanTermYears: property.loan_term_years,
    points: property.points,
    pmiMonthly: property.pmi_monthly,
    rehabBudgetTotal: property.rehab_budget_total,
    rehabTimelineMonths: property.rehab_timeline_months,
    holdingCostsMonthly: property.holding_costs_monthly,
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
    arv: property.arv ?? property.purchase_price,
    refiLtvPercent: property.refi_ltv_percent,
    refiInterestRate: property.refi_interest_rate,
    refiLoanTermYears: property.refi_loan_term_years,
    refiClosingCostPercent: property.refi_closing_cost_percent,
    refiClosingCostFixed: property.refi_closing_cost_fixed,
  })
}
