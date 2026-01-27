import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ResponsiveCardGrid, ResponsiveTable, ResponsiveStack } from '../responsive-container'

describe('ResponsiveCardGrid', () => {
  it('renders children', () => {
    const { getByText } = render(
      <ResponsiveCardGrid>
        <div>Card 1</div>
        <div>Card 2</div>
      </ResponsiveCardGrid>
    )
    expect(getByText('Card 1')).toBeDefined()
    expect(getByText('Card 2')).toBeDefined()
  })

  it('applies custom className', () => {
    const { container } = render(
      <ResponsiveCardGrid className="custom-class">
        <div>Content</div>
      </ResponsiveCardGrid>
    )
    expect((container.firstChild as HTMLElement)?.className).toContain('custom-class')
  })
})

describe('ResponsiveTable', () => {
  it('renders children in scrollable wrapper', () => {
    const { getByText, container } = render(
      <ResponsiveTable>
        <table>
          <tbody>
            <tr><td>Data</td></tr>
          </tbody>
        </table>
      </ResponsiveTable>
    )
    expect(getByText('Data')).toBeDefined()
    expect((container.firstChild as HTMLElement)?.className).toContain('overflow-x-auto')
  })
})

describe('ResponsiveStack', () => {
  it('renders children', () => {
    const { getByText } = render(
      <ResponsiveStack>
        <div>Left</div>
        <div>Right</div>
      </ResponsiveStack>
    )
    expect(getByText('Left')).toBeDefined()
    expect(getByText('Right')).toBeDefined()
  })

  it('uses flex-col as base layout', () => {
    const { container } = render(
      <ResponsiveStack>
        <div>Content</div>
      </ResponsiveStack>
    )
    expect((container.firstChild as HTMLElement)?.className).toContain('flex-col')
  })
})
