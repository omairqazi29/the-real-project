import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Features } from '../features'
import { Testimonials } from '../testimonials'
import { Pricing } from '../pricing'
import { DemoPreview } from '../demo-preview'
import { CTA } from '../cta'

describe('Features', () => {
  it('renders all 6 features', () => {
    render(<Features />)
    expect(screen.getByText('Complete BRRR Analysis')).toBeInTheDocument()
    expect(screen.getByText('Full Transparency')).toBeInTheDocument()
    expect(screen.getByText('10-Year Projections')).toBeInTheDocument()
    expect(screen.getByText('Visual Analytics')).toBeInTheDocument()
    expect(screen.getByText('Instant Calculations')).toBeInTheDocument()
    expect(screen.getByText('Cloud Persistence')).toBeInTheDocument()
  })

  it('renders section heading', () => {
    render(<Features />)
    expect(screen.getByText('Everything You Need for BRRR Analysis')).toBeInTheDocument()
  })
})

describe('Testimonials', () => {
  it('renders all testimonials', () => {
    render(<Testimonials />)
    expect(screen.getByText('Marcus R.')).toBeInTheDocument()
    expect(screen.getByText('Sarah K.')).toBeInTheDocument()
    expect(screen.getByText('James T.')).toBeInTheDocument()
  })

  it('renders section heading', () => {
    render(<Testimonials />)
    expect(screen.getByText('Trusted by Investors')).toBeInTheDocument()
  })
})

describe('Pricing', () => {
  it('renders all 3 plans', () => {
    render(<Pricing />)
    expect(screen.getByText('Free')).toBeInTheDocument()
    expect(screen.getByText('Pro')).toBeInTheDocument()
    expect(screen.getByText('Team')).toBeInTheDocument()
  })

  it('renders prices', () => {
    render(<Pricing />)
    expect(screen.getByText('$0')).toBeInTheDocument()
    expect(screen.getByText('$19')).toBeInTheDocument()
    expect(screen.getByText('$49')).toBeInTheDocument()
  })

  it('shows Most Popular badge on Pro plan', () => {
    render(<Pricing />)
    expect(screen.getByText('Most Popular')).toBeInTheDocument()
  })
})

describe('DemoPreview', () => {
  it('renders demo metrics', () => {
    render(<DemoPreview />)
    expect(screen.getByText('$185,000')).toBeInTheDocument()
    expect(screen.getByText('$312/mo')).toBeInTheDocument()
    expect(screen.getByText('12.4%')).toBeInTheDocument()
  })

  it('renders projection table', () => {
    render(<DemoPreview />)
    expect(screen.getByText('Year 1')).toBeInTheDocument()
    expect(screen.getByText('Year 10')).toBeInTheDocument()
  })
})

describe('CTA', () => {
  it('renders heading and button', () => {
    render(<CTA />)
    expect(screen.getByText('Ready to Analyze Your Next Deal?')).toBeInTheDocument()
    expect(screen.getByText('Get Started Free')).toBeInTheDocument()
  })
})
