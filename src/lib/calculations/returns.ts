import type { ReturnsResult } from '@/types/calculations'
import { roundTo } from '@/lib/utils'

/**
 * Calculate Cap Rate (Capitalization Rate)
 * Formula: (Annual NOI / Property Value) × 100
 * Measures return independent of financing
 */
export function calculateCapRate(
  annualNOI: number,
  propertyValue: number
): number {
  if (propertyValue <= 0) return 0
  return roundTo((annualNOI / propertyValue) * 100, 2)
}

/**
 * Calculate Cash-on-Cash Return
 * Formula: (Annual Cash Flow / Total Cash Invested) × 100
 * Measures annual return on actual cash invested
 */
export function calculateCashOnCash(
  annualCashFlow: number,
  totalCashInvested: number
): number {
  if (totalCashInvested <= 0) return annualCashFlow > 0 ? Infinity : 0
  return roundTo((annualCashFlow / totalCashInvested) * 100, 2)
}

/**
 * Calculate Gross Rent Multiplier
 * Formula: Property Price / Annual Gross Rent
 * Lower is generally better for cash flow
 */
export function calculateGRM(
  propertyPrice: number,
  annualGrossRent: number
): number {
  if (annualGrossRent <= 0) return 0
  return roundTo(propertyPrice / annualGrossRent, 2)
}

/**
 * Calculate Debt Service Coverage Ratio (DSCR)
 * Formula: NOI / Annual Debt Service
 * Lenders typically want 1.2+ for investment properties
 */
export function calculateDSCR(
  annualNOI: number,
  annualDebtService: number
): number {
  if (annualDebtService <= 0) return annualNOI > 0 ? Infinity : 0
  return roundTo(annualNOI / annualDebtService, 2)
}

/**
 * Calculate Total ROI
 * Formula: (Total Returns / Total Investment) × 100
 * Includes equity gain + cash flow
 */
export function calculateTotalROI(
  totalReturns: number,
  totalInvestment: number
): number {
  if (totalInvestment <= 0) return totalReturns > 0 ? Infinity : 0
  return roundTo((totalReturns / totalInvestment) * 100, 2)
}

/**
 * Calculate Annualized ROI
 * Formula: ((1 + Total ROI / 100) ^ (1 / years) - 1) × 100
 */
export function calculateAnnualizedROI(totalROI: number, years: number): number {
  if (years <= 0) return 0
  const totalReturn = totalROI / 100
  const annualized = Math.pow(1 + totalReturn, 1 / years) - 1
  return roundTo(annualized * 100, 2)
}

/**
 * Calculate Internal Rate of Return (IRR)
 * Uses Newton-Raphson method for approximation
 */
export function calculateIRR(
  cashFlows: number[],
  guess: number = 0.1,
  maxIterations: number = 100,
  tolerance: number = 0.0001
): number {
  if (cashFlows.length < 2) return 0

  let rate = guess

  for (let i = 0; i < maxIterations; i++) {
    let npv = 0
    let npvDerivative = 0

    for (let t = 0; t < cashFlows.length; t++) {
      const discountFactor = Math.pow(1 + rate, t)
      npv += cashFlows[t] / discountFactor
      if (t > 0) {
        npvDerivative -= (t * cashFlows[t]) / Math.pow(1 + rate, t + 1)
      }
    }

    if (Math.abs(npv) < tolerance) {
      return roundTo(rate * 100, 2)
    }

    if (npvDerivative === 0) {
      return 0
    }

    rate = rate - npv / npvDerivative

    // Prevent extreme values
    if (rate < -0.99) rate = -0.99
    if (rate > 10) rate = 10
  }

  return roundTo(rate * 100, 2)
}

/**
 * Calculate all return metrics
 */
export function calculateReturns(inputs: {
  propertyValue: number
  annualNOI: number
  annualCashFlow: number
  totalCashInvested: number
  annualGrossRent: number
  annualDebtService: number
  totalEquityGain?: number
  years?: number
}): ReturnsResult {
  const {
    propertyValue,
    annualNOI,
    annualCashFlow,
    totalCashInvested,
    annualGrossRent,
    annualDebtService,
    totalEquityGain = 0,
    years = 1,
  } = inputs

  const capRate = calculateCapRate(annualNOI, propertyValue)
  const cashOnCashReturn = calculateCashOnCash(annualCashFlow, totalCashInvested)
  const grossRentMultiplier = calculateGRM(propertyValue, annualGrossRent)
  const debtServiceCoverageRatio = calculateDSCR(annualNOI, annualDebtService)

  const totalReturns = annualCashFlow * years + totalEquityGain
  const totalROI = calculateTotalROI(totalReturns, totalCashInvested)
  const annualizedROI = calculateAnnualizedROI(totalROI, years)

  return {
    capRate,
    cashOnCashReturn,
    grossRentMultiplier,
    debtServiceCoverageRatio,
    totalROI,
    annualizedROI,
  }
}

/**
 * Calculate the 1% rule
 * Property should rent for at least 1% of purchase price per month
 */
export function checkOnePercentRule(
  purchasePrice: number,
  monthlyRent: number
): { passes: boolean; ratio: number } {
  if (purchasePrice <= 0) return { passes: false, ratio: 0 }
  const ratio = (monthlyRent / purchasePrice) * 100
  return {
    passes: ratio >= 1,
    ratio: roundTo(ratio, 2),
  }
}

/**
 * Calculate the 50% rule
 * Estimates operating expenses at 50% of gross rent
 */
export function estimate50PercentRule(monthlyRent: number): {
  estimatedExpenses: number
  estimatedNOI: number
  estimatedAnnualNOI: number
} {
  const estimatedExpenses = monthlyRent * 0.5
  const estimatedNOI = monthlyRent - estimatedExpenses
  return {
    estimatedExpenses: roundTo(estimatedExpenses, 2),
    estimatedNOI: roundTo(estimatedNOI, 2),
    estimatedAnnualNOI: roundTo(estimatedNOI * 12, 2),
  }
}

/**
 * Calculate the 70% rule for flips/BRRR
 * Max purchase = ARV × 70% - Repairs
 */
export function calculate70PercentRule(
  arv: number,
  rehabCost: number
): number {
  return roundTo(arv * 0.7 - rehabCost, 2)
}
