import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('landing page loads correctly', async ({ page }) => {
    await page.goto('/')

    // Check for main heading
    await expect(page.getByRole('heading', { name: /the real project/i })).toBeVisible()

    // Check for Sign In button
    await expect(page.getByRole('link', { name: /sign in/i })).toBeVisible()

    // Check for Get Started button
    await expect(page.getByRole('link', { name: /get started/i })).toBeVisible()
  })

  test('can navigate to login page', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('link', { name: /sign in/i }).click()

    await expect(page).toHaveURL(/\/login/)
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible()
  })

  test('can navigate to signup page', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('link', { name: /get started/i }).click()

    await expect(page).toHaveURL(/\/signup/)
    await expect(page.getByRole('heading', { name: /create account/i })).toBeVisible()
  })

  test('login page has required fields', async ({ page }) => {
    await page.goto('/login')

    // Check for email and password inputs
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()

    // Check for submit button
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()

    // Check for forgot password link
    await expect(page.getByRole('link', { name: /forgot password/i })).toBeVisible()
  })

  test('signup page has required fields', async ({ page }) => {
    await page.goto('/signup')

    // Check for all signup fields
    await expect(page.getByLabel(/full name/i)).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel('Password', { exact: true })).toBeVisible()
    await expect(page.getByLabel(/confirm password/i)).toBeVisible()

    // Check for submit button
    await expect(page.getByRole('button', { name: /create account/i })).toBeVisible()
  })

  test('login form shows validation errors', async ({ page }) => {
    await page.goto('/login')

    // Click submit without filling form
    await page.getByRole('button', { name: /sign in/i }).click()

    // Browser validation should prevent submission
    const emailInput = page.getByLabel(/email/i)
    const isInvalid = await emailInput.evaluate((el) => !(el as HTMLInputElement).validity.valid)
    expect(isInvalid).toBe(true)
  })

  test('signup form validates password match', async ({ page }) => {
    await page.goto('/signup')

    await page.getByLabel(/full name/i).fill('Test User')
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel('Password', { exact: true }).fill('password123')
    await page.getByLabel(/confirm password/i).fill('different123')

    await page.getByRole('button', { name: /create account/i }).click()

    // Should show error about passwords not matching
    await expect(page.getByText(/passwords do not match/i)).toBeVisible()
  })

  test('protected routes redirect to login', async ({ page }) => {
    await page.goto('/properties')

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/)
  })

  test('login page has link to signup', async ({ page }) => {
    await page.goto('/login')

    await expect(page.getByRole('link', { name: /sign up/i })).toBeVisible()
  })

  test('signup page has link to login', async ({ page }) => {
    await page.goto('/signup')

    await expect(page.getByRole('link', { name: /sign in/i })).toBeVisible()
  })
})

test.describe('Navigation', () => {
  test('landing page features section is visible', async ({ page }) => {
    await page.goto('/')

    // Check for feature cards
    await expect(page.getByText(/brrr analysis/i)).toBeVisible()
    await expect(page.getByText(/transparency/i)).toBeVisible()
  })

  test('landing page is responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Navigation should still work
    await expect(page.getByRole('link', { name: /sign in/i })).toBeVisible()
  })
})
