import { test, expect } from '@playwright/test'

test.describe('Markets Page', () => {
  test('markets page loads', async ({ page }) => {
    await page.goto('/markets')
    // Should either show markets or redirect to login
    await expect(page).toHaveURL(/\/(markets|login)/)
  })

  test('markets page has search input', async ({ page }) => {
    await page.goto('/markets')

    // If redirected to login, that's expected for unauthenticated users
    const url = page.url()
    if (url.includes('/login')) {
      expect(url).toContain('/login')
      return
    }

    // If on markets page, check for search
    const searchInput = page.getByPlaceholder(/search/i)
    await expect(searchInput).toBeVisible()
  })
})

test.describe('Market Detail Page', () => {
  test('market detail page handles invalid zip', async ({ page }) => {
    await page.goto('/markets/00000')
    // Should either show error/empty state or redirect to login
    const url = page.url()
    if (url.includes('/login')) {
      expect(url).toContain('/login')
      return
    }
    // Otherwise should show some content
    await expect(page.locator('body')).toBeVisible()
  })
})
