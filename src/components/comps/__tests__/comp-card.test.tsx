import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ARVCompCard, RentCompCard } from '../comp-card'
import type { ARVComp, RentComp } from '@/types/property'

// Mock Radix tooltip to avoid portal issues in tests
vi.mock('@/components/ui/tooltip', () => ({
  Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  TooltipTrigger: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  TooltipContent: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  TooltipProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

const mockARVComp: ARVComp = {
  id: 'arv-1',
  address: '123 Oak Ave',
  sold_price: 280000,
  beds: 3,
  baths: 2,
  sqft: 1500,
  price_per_sqft: 187,
  sold_date: '2024-01-15',
  distance_miles: 0.5,
  source: 'MLS',
  adjustments: {
    sqft: -5000,
    condition: 10000,
    garage: 0,
  },
  adjusted_price: 285000,
}

const mockRentComp: RentComp = {
  id: 'rent-1',
  address: '456 Maple St',
  rent: 1800,
  beds: 3,
  baths: 2,
  sqft: 1400,
  distance_miles: 0.3,
  source: 'Zillow',
  date: '2024-02-01',
}

describe('ARVCompCard', () => {
  it('renders comp address and sold price', () => {
    render(<ARVCompCard comp={mockARVComp} />)
    expect(screen.getByText('123 Oak Ave')).toBeInTheDocument()
    expect(screen.getByText('$280,000')).toBeInTheDocument()
  })

  it('renders beds/baths and sqft', () => {
    render(<ARVCompCard comp={mockARVComp} />)
    expect(screen.getByText('3/2')).toBeInTheDocument()
    expect(screen.getByText('1,500 sqft')).toBeInTheDocument()
  })

  it('shows source badge', () => {
    render(<ARVCompCard comp={mockARVComp} />)
    expect(screen.getByText('MLS')).toBeInTheDocument()
  })

  it('shows adjustments when present', () => {
    render(<ARVCompCard comp={mockARVComp} />)
    expect(screen.getByText('$285,000')).toBeInTheDocument()
  })

  it('calls onEdit when edit button is clicked', () => {
    const onEdit = vi.fn()
    render(<ARVCompCard comp={mockARVComp} onEdit={onEdit} />)
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[0])
    expect(onEdit).toHaveBeenCalled()
  })

  it('calls onDelete when delete button is clicked', () => {
    const onDelete = vi.fn()
    render(<ARVCompCard comp={mockARVComp} onDelete={onDelete} />)
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[0])
    expect(onDelete).toHaveBeenCalled()
  })
})

describe('RentCompCard', () => {
  it('renders comp address and rent', () => {
    render(<RentCompCard comp={mockRentComp} />)
    expect(screen.getByText('456 Maple St')).toBeInTheDocument()
    expect(screen.getByText('$1,800')).toBeInTheDocument()
  })

  it('renders beds/baths', () => {
    render(<RentCompCard comp={mockRentComp} />)
    expect(screen.getByText('3/2')).toBeInTheDocument()
  })

  it('shows source badge', () => {
    render(<RentCompCard comp={mockRentComp} />)
    expect(screen.getByText('Zillow')).toBeInTheDocument()
  })

  it('calculates rent per sqft', () => {
    render(<RentCompCard comp={mockRentComp} />)
    // 1800 / 1400 = $1.29/sqft
    expect(screen.getByText('$1.29')).toBeInTheDocument()
  })

  it('calls onEdit when edit button is clicked', () => {
    const onEdit = vi.fn()
    render(<RentCompCard comp={mockRentComp} onEdit={onEdit} />)
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[0])
    expect(onEdit).toHaveBeenCalled()
  })
})
