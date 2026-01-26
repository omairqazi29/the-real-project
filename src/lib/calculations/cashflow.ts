import type { CashFlowResult } from '@/types/calculations'
import type { Property } from '@/types/property'
import { roundTo } from '@/lib/utils'
import { calculateMonthlyPI } from './mortgage'

export interface CashFlowInputs {
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
  loanAmount: number
  interestRate: number
  loanTermYears: number
  pmiMonthly: number
}

/**
 * Calculate monthly and annual cash flow
 */
export function calculateCashFlow(inputs: CashFlowInputs): CashFlowResult {
  const {
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
    loanAmount,
    interestRate,
    loanTermYears,
    pmiMonthly,
  } = inputs

  // Income calculations
  const grossRent = monthlyRent
  const vacancy = (monthlyRent * vacancyPercent) / 100
  const effectiveGrossIncome = grossRent - vacancy

  // Operating expense calculations (based on rent)
  const maintenance = (monthlyRent * maintenancePercent) / 100
  const capex = (monthlyRent * capexPercent) / 100
  const management = (monthlyRent * managementPercent) / 100

  // Fixed expenses
  const propertyTaxMonthly = propertyTaxAnnual / 12

  const operatingExpenses = {
    maintenance: roundTo(maintenance, 2),
    capex: roundTo(capex, 2),
    management: roundTo(management, 2),
    insurance: roundTo(insuranceMonthly, 2),
    propertyTax: roundTo(propertyTaxMonthly, 2),
    hoa: roundTo(hoaMonthly, 2),
    utilities: roundTo(utilitiesMonthly, 2),
    other: roundTo(otherExpensesMonthly, 2),
    total: roundTo(
      maintenance + capex + management + insuranceMonthly + propertyTaxMonthly + hoaMonthly + utilitiesMonthly + otherExpensesMonthly,
      2
    ),
  }

  // NOI = Effective Gross Income - Operating Expenses
  const netOperatingIncome = effectiveGrossIncome - operatingExpenses.total

  // Debt Service
  const monthlyPI = calculateMonthlyPI(loanAmount, interestRate, loanTermYears)
  const debtService = monthlyPI + pmiMonthly

  // Cash Flow = NOI - Debt Service
  const monthlyCashFlow = netOperatingIncome - debtService
  const annualCashFlow = monthlyCashFlow * 12

  return {
    grossRent: roundTo(grossRent, 2),
    effectiveGrossIncome: roundTo(effectiveGrossIncome, 2),
    vacancy: roundTo(vacancy, 2),
    operatingExpenses,
    netOperatingIncome: roundTo(netOperatingIncome, 2),
    debtService: roundTo(debtService, 2),
    monthlyCashFlow: roundTo(monthlyCashFlow, 2),
    annualCashFlow: roundTo(annualCashFlow, 2),
  }
}

/**
 * Calculate cash flow from a property object
 */
export function calculatePropertyCashFlow(property: Property): CashFlowResult {
  const purchasePrice = property.purchase_price
  const downPaymentPercent = property.down_payment_percent
  const loanAmount = purchasePrice * (1 - downPaymentPercent / 100)

  // Calculate property tax if not provided
  let propertyTaxAnnual = property.property_tax_annual ?? 0
  if (!propertyTaxAnnual && property.property_tax_rate) {
    propertyTaxAnnual = (purchasePrice * property.property_tax_rate) / 100
  }

  return calculateCashFlow({
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
    loanAmount,
    interestRate: property.interest_rate,
    loanTermYears: property.loan_term_years,
    pmiMonthly: property.pmi_monthly,
  })
}

/**
 * Calculate total monthly operating expenses
 */
export function calculateMonthlyExpenses(
  monthlyRent: number,
  vacancyPercent: number,
  maintenancePercent: number,
  capexPercent: number,
  managementPercent: number,
  insuranceMonthly: number,
  propertyTaxAnnual: number,
  hoaMonthly: number,
  utilitiesMonthly: number,
  otherExpensesMonthly: number
): number {
  const vacancy = (monthlyRent * vacancyPercent) / 100
  const maintenance = (monthlyRent * maintenancePercent) / 100
  const capex = (monthlyRent * capexPercent) / 100
  const management = (monthlyRent * managementPercent) / 100
  const propertyTaxMonthly = propertyTaxAnnual / 12

  return roundTo(
    vacancy + maintenance + capex + management + insuranceMonthly + propertyTaxMonthly + hoaMonthly + utilitiesMonthly + otherExpensesMonthly,
    2
  )
}
