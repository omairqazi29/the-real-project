// Mortgage calculation results
export interface MortgageResult {
  monthlyPI: number
  monthlyPMI: number
  totalMonthlyPayment: number
  loanAmount: number
  downPayment: number
  totalInterest: number
  totalCost: number
}

// Amortization schedule entry
export interface AmortizationEntry {
  month: number
  year: number
  payment: number
  principal: number
  interest: number
  balance: number
  totalPrincipalPaid: number
  totalInterestPaid: number
}

// Cash flow calculation results
export interface CashFlowResult {
  grossRent: number
  effectiveGrossIncome: number
  vacancy: number
  operatingExpenses: {
    maintenance: number
    capex: number
    management: number
    insurance: number
    propertyTax: number
    hoa: number
    utilities: number
    other: number
    total: number
  }
  netOperatingIncome: number
  debtService: number
  monthlyCashFlow: number
  annualCashFlow: number
}

// Returns calculation results
export interface ReturnsResult {
  capRate: number
  cashOnCashReturn: number
  grossRentMultiplier: number
  debtServiceCoverageRatio: number
  totalROI: number
  annualizedROI: number
}

// BRRR analysis results
export interface BRRRResult {
  // Buy phase
  purchasePrice: number
  closingCosts: number
  downPayment: number
  loanAmount: number
  totalCashToBuy: number

  // Rehab phase
  rehabBudget: number
  holdingCosts: number
  totalRehabCosts: number

  // Rent phase
  monthlyRent: number
  monthlyExpenses: number
  monthlyDebtService: number
  monthlyCashFlow: number
  annualCashFlow: number
  capRate: number
  initialCoCReturn: number

  // Refinance phase
  arv: number
  newLoanAmount: number
  cashOut: number
  refiClosingCosts: number
  netCashOut: number
  cashLeftInDeal: number
  newMonthlyPayment: number
  postRefiCashFlow: number
  postRefiCoCReturn: number

  // Equity
  forcedEquity: number
  initialEquityPercent: number

  // Summary
  totalCashInvested: number
  capitalRecycled: number
  velocityOfMoney: number
  infiniteReturn: boolean
}

// Year projection entry
export interface YearProjection {
  year: number
  propertyValue: number
  appreciation: number
  loanBalance: number
  equityForced: number
  equityAppreciation: number
  equityPrincipal: number
  equityTotal: number
  monthlyRent: number
  monthlyExpenses: number
  monthlyCashFlow: number
  annualCashFlow: number
  cumulativeCashFlow: number
  cocReturn: number
  totalROI: number
}

// Scenario result
export interface ScenarioResult {
  name: string
  projections: YearProjection[]
  summary: {
    totalCashFlow10yr: number
    totalEquity10yr: number
    totalROI10yr: number
    averageCoCReturn: number
    irr: number
  }
}

// Sensitivity analysis point
export interface SensitivityPoint {
  variable: string
  value: number
  change: number
  cashFlow: number
  cocReturn: number
  totalROI: number
}

// Exit strategy comparison
export interface ExitStrategy {
  strategy: 'hold' | 'sell' | 'brrr'
  year: number
  cashInvested: number
  totalReturns: number
  roi: number
  irr: number
}
