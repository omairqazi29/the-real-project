import type { MortgageResult, AmortizationEntry } from '@/types/calculations'
import { roundTo } from '@/lib/utils'

/**
 * Calculate monthly principal and interest payment
 * Formula: P * [r(1+r)^n] / [(1+r)^n - 1]
 * Where:
 * - P = Principal (loan amount)
 * - r = Monthly interest rate (annual rate / 12 / 100)
 * - n = Total number of payments (years * 12)
 */
export function calculateMonthlyPI(
  principal: number,
  annualRate: number,
  years: number
): number {
  if (principal <= 0) return 0
  if (annualRate === 0) return principal / (years * 12)

  const monthlyRate = annualRate / 100 / 12
  const n = years * 12
  const payment =
    (principal * (monthlyRate * Math.pow(1 + monthlyRate, n))) /
    (Math.pow(1 + monthlyRate, n) - 1)

  return roundTo(payment, 2)
}

/**
 * Calculate full mortgage details
 */
export function calculateMortgage(
  purchasePrice: number,
  downPaymentPercent: number,
  annualRate: number,
  years: number,
  pmiMonthly: number = 0,
  downPaymentFixed?: number
): MortgageResult {
  const downPayment = downPaymentFixed ?? (purchasePrice * downPaymentPercent) / 100
  const loanAmount = purchasePrice - downPayment

  const monthlyPI = calculateMonthlyPI(loanAmount, annualRate, years)
  const totalMonthlyPayment = monthlyPI + pmiMonthly
  const totalPayments = years * 12
  const totalCost = totalMonthlyPayment * totalPayments + downPayment
  const totalInterest = totalCost - downPayment - loanAmount

  return {
    monthlyPI: roundTo(monthlyPI, 2),
    monthlyPMI: pmiMonthly,
    totalMonthlyPayment: roundTo(totalMonthlyPayment, 2),
    loanAmount: roundTo(loanAmount, 2),
    downPayment: roundTo(downPayment, 2),
    totalInterest: roundTo(totalInterest, 2),
    totalCost: roundTo(totalCost, 2),
  }
}

/**
 * Generate full amortization schedule
 */
export function generateAmortizationSchedule(
  principal: number,
  annualRate: number,
  years: number
): AmortizationEntry[] {
  if (principal <= 0) return []

  const schedule: AmortizationEntry[] = []
  const monthlyRate = annualRate / 100 / 12
  const monthlyPayment = calculateMonthlyPI(principal, annualRate, years)
  let balance = principal
  let totalPrincipalPaid = 0
  let totalInterestPaid = 0

  for (let month = 1; month <= years * 12; month++) {
    const interestPayment = balance * monthlyRate
    const principalPayment = monthlyPayment - interestPayment
    balance = Math.max(0, balance - principalPayment)
    totalPrincipalPaid += principalPayment
    totalInterestPaid += interestPayment

    schedule.push({
      month,
      year: Math.ceil(month / 12),
      payment: roundTo(monthlyPayment, 2),
      principal: roundTo(principalPayment, 2),
      interest: roundTo(interestPayment, 2),
      balance: roundTo(balance, 2),
      totalPrincipalPaid: roundTo(totalPrincipalPaid, 2),
      totalInterestPaid: roundTo(totalInterestPaid, 2),
    })
  }

  return schedule
}

/**
 * Get loan balance at a specific month
 */
export function getLoanBalanceAtMonth(
  principal: number,
  annualRate: number,
  years: number,
  month: number
): number {
  if (month <= 0) return principal
  if (month >= years * 12) return 0

  const monthlyRate = annualRate / 100 / 12
  const n = years * 12

  // Formula: Balance = P * [(1+r)^n - (1+r)^m] / [(1+r)^n - 1]
  const balance =
    principal *
    (Math.pow(1 + monthlyRate, n) - Math.pow(1 + monthlyRate, month)) /
    (Math.pow(1 + monthlyRate, n) - 1)

  return roundTo(Math.max(0, balance), 2)
}

/**
 * Get principal paid in a specific year
 */
export function getPrincipalPaidInYear(
  principal: number,
  annualRate: number,
  years: number,
  year: number
): number {
  const startMonth = (year - 1) * 12
  const endMonth = year * 12

  const startBalance = getLoanBalanceAtMonth(principal, annualRate, years, startMonth)
  const endBalance = getLoanBalanceAtMonth(principal, annualRate, years, endMonth)

  return roundTo(startBalance - endBalance, 2)
}
