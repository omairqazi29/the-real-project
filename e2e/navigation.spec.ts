import { test, expect } from '@playwright/test'

test.describe('Navigation - Unauthenticated User Flow', () => {
  test('landing page → sign in → login page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Sign in' }).first().click()
    await expect(page).toHaveURL(/\/login/)
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible()
  })

  test('landing page → get started → signup page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Get Started' }).first().click()
    await expect(page).toHaveURL(/\/signup/)
    await expect(page.getByRole('heading', { name: /create.*account/i })).toBeVisible()
  })

  test('login page → forgot password link', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('link', { name: /forgot password/i }).click()
    await expect(page).toHaveURL(/\/forgot-password/)
  })

  test('login page → signup link', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('link', { name: /sign up/i }).click()
    await expect(page).toHaveURL(/\/signup/)
  })

  test('signup page → login link', async ({ page }) => {
    await page.goto('/signup')
    await page.getByRole('link', { name: /sign in/i }).click()
    await expect(page).toHaveURL(/\/login/)
  })
})

test.describe('Protected Route Redirects', () => {
  const protectedRoutes = [
    '/dashboard',
    '/properties',
    '/properties/new',
    '/properties/some-uuid',
    '/properties/some-uuid/edit',
    '/properties/some-uuid/export',
    '/markets',
    '/markets/12345',
    '/compare',
    '/settings',
    '/settings/profile',
    '/settings/defaults',
  ]

  for (const route of protectedRoutes) {
    test(`${route} redirects to login`, async ({ page }) => {
      await page.goto(route)
      await expect(page).toHaveURL(/\/login/)
    })
  }

  test('redirect preserves original path', async ({ page }) => {
    await page.goto('/properties')
    await expect(page).toHaveURL(/\/login\?redirect=.*properties/)
  })
})

test.describe('404 Page', () => {
  test('shows 404 for non-existent routes', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist')
    // Next.js returns 404 status
    expect(response?.status()).toBe(404)
    // Should show 404 content
    await expect(page.getByText('404')).toBeVisible()
    await expect(page.getByText(/page not found/i)).toBeVisible()
  })

  test('404 page has navigation links', async ({ page }) => {
    await page.goto('/nonexistent-route')
    await expect(page.getByRole('link', { name: /go home/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /view properties/i })).toBeVisible()
  })
})
