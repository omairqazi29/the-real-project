export type DataSource = 'user' | 'estimated' | 'calculated' | 'assumption' | 'api'

export type ConfidenceLevel = 'high' | 'medium' | 'low'

export interface DataInput {
  name: string
  value: number | string
  source: DataSource
  sourceDetail?: string // "User input", "Zillow Zestimate", "5% default"
  url?: string // Link to source if available
}

export interface DataPointConfig {
  label: string
  value: number
  format: 'currency' | 'percent' | 'number' | 'months' | 'years'
  formula?: string
  formulaLatex?: string // For fancy display
  inputs?: DataInput[]
  confidence: ConfidenceLevel
  helpText?: string
}

export interface DataSourceInfo {
  source: DataSource
  confidence: ConfidenceLevel
  note?: string
  url?: string
  date?: string
}

export type DataSources = Record<string, DataSourceInfo>

export const CONFIDENCE_COLORS = {
  high: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    text: 'text-green-500',
    dot: 'bg-green-500',
  },
  medium: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    text: 'text-yellow-500',
    dot: 'bg-yellow-500',
  },
  low: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-500',
    dot: 'bg-red-500',
  },
} as const

export const SOURCE_LABELS: Record<DataSource, string> = {
  user: 'User Input',
  estimated: 'Estimated',
  calculated: 'Calculated',
  assumption: 'Default Assumption',
  api: 'External Data',
}
