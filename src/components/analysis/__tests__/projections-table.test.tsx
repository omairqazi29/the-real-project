import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ProjectionsTable } from '../projections-table'
import type { YearProjection } from '@/types/calculations'

// Mock recharts
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  LineChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
  ReferenceLine: () => null,
}))

const mockProjections: YearProjection[] = Array.from({ length: 10 }, (_, i) => ({
  year: i + 1,
  propertyValue: 300000 + i * 9000,
  appreciation: i * 9000,
  loanBalance: 225000 - i * 5000,
  equityForced: 60000,
  equityAppreciation: i * 9000,
  equityPrincipal: i * 5000,
  equityTotal: 60000 + i * 9000 + i * 5000,
  monthlyRent: 1800 + i * 36,
  monthlyExpenses: 600 + i * 12,
  monthlyCashFlow: 200 + i * 24,
  annualCashFlow: (200 + i * 24) * 12,
  cumulativeCashFlow: (200 + i * 24) * 12 * (i + 1) / 2, // approximate
  cocReturn: 5 + i * 0.5,
  totalROI: 20 + i * 5,
}))

describe('ProjectionsTable', () => {
  it('renders 10-year projections heading', () => {
    render(<ProjectionsTable projections={mockProjections} />)
    expect(screen.getByText('10-Year Projections')).toBeInTheDocument()
  })

  it('renders all 10 years in table', () => {
    render(<ProjectionsTable projections={mockProjections} />)
    for (let i = 1; i <= 10; i++) {
      expect(screen.getByText(`Year ${i}`)).toBeInTheDocument()
    }
  })

  it('shows summary cards', () => {
    render(<ProjectionsTable projections={mockProjections} />)
    expect(screen.getByText('Total Cash Flow')).toBeInTheDocument()
    expect(screen.getAllByText('Total Equity').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Avg CoC Return')).toBeInTheDocument()
    // "Total ROI" appears in both summary and table header
    expect(screen.getAllByText('Total ROI').length).toBeGreaterThanOrEqual(1)
  })

  it('toggles expanded mode', () => {
    render(<ProjectionsTable projections={mockProjections} />)
    const expandButton = screen.getByText('Expand')
    fireEvent.click(expandButton)
    expect(screen.getByText('Collapse')).toBeInTheDocument()
  })

  it('renders equity legend', () => {
    render(<ProjectionsTable projections={mockProjections} />)
    expect(screen.getByText('Forced Equity (BRRR value-add)')).toBeInTheDocument()
    expect(screen.getByText('Appreciation Equity')).toBeInTheDocument()
    expect(screen.getByText('Principal Paydown')).toBeInTheDocument()
  })
})
