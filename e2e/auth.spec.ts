import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('landing page loads correctly', async ({ page }) => {
    await page.goto('/')

    // Check for main hero heading
    await expect(page.getByRole('heading', { name: /analyze real estate/i })).toBeVisible()

    // Check for Sign In button in header
    await expect(page.getByRole('button', { name: /sign in/i }).first()).toBeVisible()

    // Check for Get Started button
    await expect(page.getByRole('button', { name: /get started/i }).first()).toBeVisible()
  })

  test('can navigate to login page', async ({ page }) => {
    await page.goto('/')

    // Click first Sign in link (header)
    await page.getByRole('link', { name: 'Sign in' }).first().click()

    await expect(page).toHaveURL(/\/login/)
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible()
  })

  test('can navigate to signup page', async ({ page }) => {
    await page.goto('/')

    // Click first Get Started link (header)
    await page.getByRole('link', { name: 'Get Started' }).first().click()

    await expect(page).toHaveURL(/\/signup/)
    await expect(page.getByRole('heading', { name: /create.*account/i })).toBeVisible()
  })

  test('login page has required fields', async ({ page }) => {
    await page.goto('/login')

    // Check for email and password inputs
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()

    // Check for submit button
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
  })

  test('signup page has required fields', async ({ page }) => {
    await page.goto('/signup')

    // Check for signup fields
    await expect(page.getByLabel(/name/i).first()).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i).first()).toBeVisible()

    // Check for submit button
    await expect(page.getByRole('button', { name: /create account|sign up/i })).toBeVisible()
  })

  test('protected routes redirect to login', async ({ page }) => {
    await page.goto('/properties')

    // Should redirect to login
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
})

test.describe('Navigation', () => {
  test('landing page features section is visible', async ({ page }) => {
    await page.goto('/')

    // Check for feature cards
    await expect(page.getByText(/brrr analysis/i)).toBeVisible()
    await expect(page.getByText(/transparency/i).first()).toBeVisible()
  })

  test('landing page is responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Page should load without errors
    await expect(page.getByRole('heading', { name: /analyze real estate/i })).toBeVisible()
  })
})
