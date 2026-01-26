// Default assumptions for calculations
export const DEFAULT_ASSUMPTIONS = {
  // Expenses (as % of rent)
  vacancy_percent: 5,
  maintenance_percent: 5,
  capex_percent: 8,
  management_percent: 0,

  // Fixed expenses
  insurance_monthly: 100,
  property_tax_rate: 1.2, // % of value

  // Financing
  closing_cost_buy_percent: 3,
  closing_cost_refi_percent: 2,
  down_payment_percent: 25,
  interest_rate: 7,
  loan_term_years: 30,
  refi_ltv_percent: 75,

  // Growth rates
  appreciation_rate: 3,
  rent_growth_rate: 2,
  expense_growth_rate: 2,

  // Exit
  selling_cost_percent: 8,

  // Rehab
  rehab_timeline_months: 3,
} as const

export const PROPERTY_TYPES = [
  { value: 'SFH', label: 'Single Family Home' },
  { value: 'duplex', label: 'Duplex' },
  { value: 'triplex', label: 'Triplex' },
  { value: 'quad', label: 'Quadplex' },
  { value: 'multi', label: 'Multi-family (5+)' },
  { value: 'condo', label: 'Condo' },
  { value: 'townhouse', label: 'Townhouse' },
] as const

export const PROPERTY_STATUSES = [
  { value: 'analyzing', label: 'Analyzing', color: 'neutral' },
  { value: 'researching', label: 'Researching', color: 'blue' },
  { value: 'offer_made', label: 'Offer Made', color: 'yellow' },
  { value: 'under_contract', label: 'Under Contract', color: 'orange' },
  { value: 'due_diligence', label: 'Due Diligence', color: 'purple' },
  { value: 'rehabbing', label: 'Rehabbing', color: 'pink' },
  { value: 'listed_for_rent', label: 'Listed for Rent', color: 'cyan' },
  { value: 'rented', label: 'Rented', color: 'green' },
  { value: 'stabilized', label: 'Stabilized', color: 'emerald' },
  { value: 'refinanced', label: 'Refinanced', color: 'teal' },
  { value: 'sold', label: 'Sold', color: 'slate' },
] as const

export const FINANCING_TYPES = [
  { value: 'conventional', label: 'Conventional', description: 'Traditional bank loan with 20-25% down' },
  { value: 'fha', label: 'FHA', description: 'Government-backed loan with 3.5% down' },
  { value: 'va', label: 'VA', description: 'Veteran loan with 0% down' },
  { value: 'hard_money', label: 'Hard Money', description: 'Short-term private loan for rehabs' },
  { value: 'dscr', label: 'DSCR', description: 'Debt Service Coverage Ratio loan for investors' },
  { value: 'private', label: 'Private Money', description: 'Loan from private individual' },
  { value: 'seller_finance', label: 'Seller Financing', description: 'Seller acts as the lender' },
  { value: 'cash', label: 'Cash', description: 'No financing needed' },
] as const

export const REHAB_CATEGORIES = [
  { key: 'kitchen', label: 'Kitchen' },
  { key: 'bathrooms', label: 'Bathrooms' },
  { key: 'flooring', label: 'Flooring' },
  { key: 'paint_interior', label: 'Interior Paint' },
  { key: 'paint_exterior', label: 'Exterior Paint' },
  { key: 'roof', label: 'Roof' },
  { key: 'hvac', label: 'HVAC' },
  { key: 'electrical', label: 'Electrical' },
  { key: 'plumbing', label: 'Plumbing' },
  { key: 'windows', label: 'Windows' },
  { key: 'doors', label: 'Doors' },
  { key: 'landscaping', label: 'Landscaping' },
  { key: 'foundation', label: 'Foundation' },
  { key: 'permits', label: 'Permits & Fees' },
  { key: 'contingency', label: 'Contingency' },
  { key: 'other', label: 'Other' },
] as const

export const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
] as const

export type PropertyType = (typeof PROPERTY_TYPES)[number]['value']
export type PropertyStatus = (typeof PROPERTY_STATUSES)[number]['value']
export type FinancingType = (typeof FINANCING_TYPES)[number]['value']
export type RehabCategory = (typeof REHAB_CATEGORIES)[number]['key']
export type USState = (typeof US_STATES)[number]['value']
