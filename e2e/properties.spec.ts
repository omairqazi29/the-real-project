import { test, expect } from '@playwright/test'

test.describe('Properties - Unauthenticated Access', () => {
  test('properties list redirects to login', async ({ page }) => {
    await page.goto('/properties')
    await expect(page).toHaveURL(/\/login/)
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible()
  })

  test('new property page redirects to login', async ({ page }) => {
    await page.goto('/properties/new')
    await expect(page).toHaveURL(/\/login/)
  })

  test('property detail page redirects to login', async ({ page }) => {
    await page.goto('/properties/test-id')
    await expect(page).toHaveURL(/\/login/)
  })

  test('property edit page redirects to login', async ({ page }) => {
    await page.goto('/properties/test-id/edit')
    await expect(page).toHaveURL(/\/login/)
  })

  test('property export page redirects to login', async ({ page }) => {
    await page.goto('/properties/test-id/export')
    await expect(page).toHaveURL(/\/login/)
  })

  test('redirect includes original path for properties', async ({ page }) => {
    await page.goto('/properties')
    await expect(page).toHaveURL(/\/login\?redirect=%2Fproperties/)
  })

  test('redirect includes original path for new property', async ({ page }) => {
    await page.goto('/properties/new')
    await expect(page).toHaveURL(/\/login\?redirect=%2Fproperties%2Fnew/)
  })
})

test.describe('Mobile Responsiveness - Auth Pages', () => {
  test('login page is responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/login')
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
  })

  test('signup page is responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/signup')
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /create account|sign up/i })).toBeVisible()
  })
})
