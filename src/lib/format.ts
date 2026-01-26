import numeral from 'numeral'

// Currency formatting
export function formatCurrency(value: number | null | undefined, options?: {
  decimals?: number
  compact?: boolean
}): string {
  if (value == null) return '-'

  const { decimals = 0, compact = false } = options || {}

  if (compact) {
    if (Math.abs(value) >= 1000000) {
      return numeral(value).format('$0.0a').toUpperCase()
    }
    if (Math.abs(value) >= 1000) {
      return numeral(value).format('$0.0a')
    }
  }

  const format = decimals > 0 ? `$0,0.${'0'.repeat(decimals)}` : '$0,0'
  return numeral(value).format(format)
}

// Percentage formatting
export function formatPercent(value: number | null | undefined, options?: {
  decimals?: number
  includeSign?: boolean
}): string {
  if (value == null) return '-'

  const { decimals = 1, includeSign = false } = options || {}

  const format = decimals > 0 ? `0.${'0'.repeat(decimals)}` : '0'
  const formatted = numeral(value / 100).format(`${format}%`)

  if (includeSign && value > 0) {
    return `+${formatted}`
  }

  return formatted
}

// Number formatting
export function formatNumber(value: number | null | undefined, options?: {
  decimals?: number
  compact?: boolean
}): string {
  if (value == null) return '-'

  const { decimals = 0, compact = false } = options || {}

  if (compact) {
    if (Math.abs(value) >= 1000000) {
      return numeral(value).format('0.0a').toUpperCase()
    }
    if (Math.abs(value) >= 1000) {
      return numeral(value).format('0.0a')
    }
  }

  const format = decimals > 0 ? `0,0.${'0'.repeat(decimals)}` : '0,0'
  return numeral(value).format(format)
}

// Square footage formatting
export function formatSqft(value: number | null | undefined): string {
  if (value == null) return '-'
  return `${numeral(value).format('0,0')} sqft`
}

// Months/Years formatting
export function formatMonths(months: number | null | undefined): string {
  if (months == null) return '-'

  if (months < 12) {
    return `${months} mo`
  }

  const years = Math.floor(months / 12)
  const remainingMonths = months % 12

  if (remainingMonths === 0) {
    return `${years} yr${years > 1 ? 's' : ''}`
  }

  return `${years} yr${years > 1 ? 's' : ''} ${remainingMonths} mo`
}

export function formatYears(years: number | null | undefined): string {
  if (years == null) return '-'
  return `${years} yr${years !== 1 ? 's' : ''}`
}

// Beds/Baths formatting
export function formatBedsBaths(beds?: number | null, baths?: number | null): string {
  const parts: string[] = []

  if (beds != null) {
    parts.push(`${beds} bed${beds !== 1 ? 's' : ''}`)
  }

  if (baths != null) {
    parts.push(`${baths} bath${baths !== 1 ? 's' : ''}`)
  }

  return parts.join(' / ') || '-'
}

// Price per sqft formatting
export function formatPricePerSqft(price: number | null | undefined): string {
  if (price == null) return '-'
  return `${formatCurrency(price)}/sqft`
}

// Input parsing (removes formatting to get number)
export function parseCurrencyInput(value: string): number | null {
  const cleaned = value.replace(/[^0-9.-]/g, '')
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? null : parsed
}

export function parsePercentInput(value: string): number | null {
  const cleaned = value.replace(/[^0-9.-]/g, '')
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? null : parsed
}

export function parseNumberInput(value: string): number | null {
  const cleaned = value.replace(/[^0-9.-]/g, '')
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? null : parsed
}
