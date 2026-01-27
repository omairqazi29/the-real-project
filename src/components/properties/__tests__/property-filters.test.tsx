import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PropertyFilters } from '../property-filters'

const defaultProps = {
  searchQuery: '',
  onSearchChange: vi.fn(),
  statusFilter: '',
  onStatusChange: vi.fn(),
  typeFilter: '',
  onTypeChange: vi.fn(),
  sortBy: 'newest' as const,
  onSortChange: vi.fn(),
  viewMode: 'grid' as const,
  onViewModeChange: vi.fn(),
}

describe('PropertyFilters', () => {
  it('renders search input', () => {
    render(<PropertyFilters {...defaultProps} />)
    expect(screen.getByPlaceholderText('Search properties...')).toBeInTheDocument()
  })

  it('calls onSearchChange when typing', () => {
    const onSearchChange = vi.fn()
    render(<PropertyFilters {...defaultProps} onSearchChange={onSearchChange} />)
    const input = screen.getByPlaceholderText('Search properties...')
    fireEvent.change(input, { target: { value: 'test' } })
    expect(onSearchChange).toHaveBeenCalledWith('test')
  })

  it('renders sort dropdown', () => {
    render(<PropertyFilters {...defaultProps} />)
    expect(screen.getByText('Newest First')).toBeInTheDocument()
  })

  it('calls onSortChange when sort changes', () => {
    const onSortChange = vi.fn()
    render(<PropertyFilters {...defaultProps} onSortChange={onSortChange} />)
    const select = screen.getByDisplayValue('Newest First')
    fireEvent.change(select, { target: { value: 'price_high' } })
    expect(onSortChange).toHaveBeenCalledWith('price_high')
  })

  it('toggles filter panel', () => {
    render(<PropertyFilters {...defaultProps} />)
    const filtersButton = screen.getByText('Filters')
    fireEvent.click(filtersButton)
    expect(screen.getByText('All Statuses')).toBeInTheDocument()
    expect(screen.getByText('All Types')).toBeInTheDocument()
  })

  it('clears all filters', () => {
    const onSearchChange = vi.fn()
    const onStatusChange = vi.fn()
    const onTypeChange = vi.fn()
    render(
      <PropertyFilters
        {...defaultProps}
        onSearchChange={onSearchChange}
        onStatusChange={onStatusChange}
        onTypeChange={onTypeChange}
      />
    )
    // Open filters
    fireEvent.click(screen.getByText('Filters'))
    // Click clear
    fireEvent.click(screen.getByText('Clear All'))
    expect(onSearchChange).toHaveBeenCalledWith('')
    expect(onStatusChange).toHaveBeenCalledWith('')
    expect(onTypeChange).toHaveBeenCalledWith('')
  })
})
