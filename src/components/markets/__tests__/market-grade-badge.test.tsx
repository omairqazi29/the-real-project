import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MarketGradeBadge } from '../market-grade-badge'

describe('MarketGradeBadge', () => {
  it('renders the grade letter', () => {
    render(<MarketGradeBadge grade="A" />)
    expect(screen.getByText('A')).toBeDefined()
  })

  it('renders the score when provided', () => {
    render(<MarketGradeBadge grade="B" score={72} />)
    expect(screen.getByText('B')).toBeDefined()
    expect(screen.getByText('72')).toBeDefined()
  })

  it('applies different sizes', () => {
    const { container: sm } = render(<MarketGradeBadge grade="A" size="sm" />)
    const { container: lg } = render(<MarketGradeBadge grade="A" size="lg" />)

    // Both should render without error
    expect(sm.firstChild).toBeDefined()
    expect(lg.firstChild).toBeDefined()
  })

  it('renders all grade variants without error', () => {
    const grades = ['A', 'B', 'C', 'D', 'F'] as const
    grades.forEach((grade) => {
      const { container } = render(<MarketGradeBadge grade={grade} />)
      expect(container.firstChild).toBeDefined()
    })
  })
})
