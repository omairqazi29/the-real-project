import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('displays hero section with tagline', async ({ page }) => {
    await expect(page.getByText('Analyze Real Estate Investments')).toBeVisible()
    await expect(page.getByText('Every number, explained.')).toBeVisible()
  })

  test('displays navigation with sign in and get started', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Get Started' }).first()).toBeVisible()
  })

  test('displays features section', async ({ page }) => {
    await expect(page.getByText('Everything You Need for BRRR Analysis')).toBeVisible()
    await expect(page.getByText('Complete BRRR Analysis')).toBeVisible()
    await expect(page.getByText('Full Transparency')).toBeVisible()
  })

  test('displays demo preview section', async ({ page }) => {
    await expect(page.getByText('See Your Deal at a Glance')).toBeVisible()
    await expect(page.getByText('Sample BRRR Analysis')).toBeVisible()
  })

  test('displays testimonials section', async ({ page }) => {
    await expect(page.getByText('Trusted by Investors')).toBeVisible()
    await expect(page.getByText('Marcus R.')).toBeVisible()
  })

  test('displays pricing section with 3 plans', async ({ page }) => {
    await expect(page.getByText('Simple, Transparent Pricing')).toBeVisible()
    await expect(page.getByText('Free')).toBeVisible()
    await expect(page.getByText('Pro')).toBeVisible()
    await expect(page.getByText('Team')).toBeVisible()
  })

  test('displays CTA section', async ({ page }) => {
    await expect(page.getByText('Ready to Analyze Your Next Deal?')).toBeVisible()
  })

  test('displays key metrics section', async ({ page }) => {
    await expect(page.getByText('Key Metrics at a Glance')).toBeVisible()
    await expect(page.getByText('Cash-on-Cash Return')).toBeVisible()
    await expect(page.getByText('Cap Rate')).toBeVisible()
  })

  test('navigates to signup from hero CTA', async ({ page }) => {
    await page.getByRole('link', { name: 'Start Analyzing Free' }).click()
    await expect(page).toHaveURL(/\/signup/)
  })

  test('navigates to login from sign in link', async ({ page }) => {
    await page.getByRole('link', { name: 'Sign in' }).click()
    await expect(page).toHaveURL(/\/login/)
  })
})
