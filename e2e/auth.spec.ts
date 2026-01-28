import { test, expect } from '@playwright/test'

test.describe('Authentication Pages', () => {
  test('landing page loads correctly', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Analyze Real Estate Investments')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Sign in' }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: 'Get Started' }).first()).toBeVisible()
  })

  test('can navigate to login page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Sign in' }).first().click()
    await expect(page).toHaveURL(/\/login/)
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible()
  })

  test('can navigate to signup page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Get Started' }).first().click()
    await expect(page).toHaveURL(/\/signup/)
    await expect(page.getByRole('heading', { name: /create.*account/i })).toBeVisible()
  })

  test('login page has required fields', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
  })

  test('signup page has required fields', async ({ page }) => {
    await page.goto('/signup')
    await expect(page.getByLabel(/name/i).first()).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i).first()).toBeVisible()
    await expect(page.getByRole('button', { name: /create account|sign up/i })).toBeVisible()
  })

  test('forgot password page has email field', async ({ page }) => {
    await page.goto('/forgot-password')
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /reset|send/i })).toBeVisible()
  })

  test('protected routes redirect to login', async ({ page }) => {
    await page.goto('/properties')
    await expect(page).toHaveURL(/\/login/)
  })

  test('login page has link to signup', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('link', { name: /sign up|create account/i })).toBeVisible()
  })

  test('signup page has link to login', async ({ page }) => {
    await page.goto('/signup')
    await expect(page.getByRole('link', { name: /sign in|log in/i })).toBeVisible()
  })

  test('login form requires email', async ({ page }) => {
    await page.goto('/login')
    const emailInput = page.getByLabel(/email/i)
    await expect(emailInput).toHaveAttribute('required', '')
  })
})

test.describe('Navigation from Landing', () => {
  test('landing page features section is visible', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText(/brrr analysis/i).first()).toBeVisible()
    await expect(page.getByText(/transparency/i).first()).toBeVisible()
  })

  test('landing page is responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await expect(page.getByText('Analyze Real Estate Investments')).toBeVisible()
  })
})
