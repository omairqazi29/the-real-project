// Mortgage calculations
export {
  calculateMonthlyPI,
  calculateMortgage,
  generateAmortizationSchedule,
  getLoanBalanceAtMonth,
  getPrincipalPaidInYear,
} from './mortgage'

// Cash flow calculations
export {
  calculateCashFlow,
  calculatePropertyCashFlow,
  calculateMonthlyExpenses,
  type CashFlowInputs,
} from './cashflow'

// Returns calculations
export {
  calculateCapRate,
  calculateCashOnCash,
  calculateGRM,
  calculateDSCR,
  calculateTotalROI,
  calculateAnnualizedROI,
  calculateIRR,
  calculateReturns,
  checkOnePercentRule,
  estimate50PercentRule,
  calculate70PercentRule,
} from './returns'

// BRRR calculations
export {
  calculateBRRR,
  calculatePropertyBRRR,
  type BRRRInputs,
} from './brrr'

// Projections
export {
  generateProjections,
  generateScenarios,
  generatePropertyProjections,
  type ProjectionInputs,
} from './projections'
