import { test, expect } from '@playwright/test'

test.describe('Markets - Unauthenticated Access', () => {
  test('markets page redirects to login', async ({ page }) => {
    await page.goto('/markets')
    await expect(page).toHaveURL(/\/login/)
  })

  test('market detail page redirects to login', async ({ page }) => {
    await page.goto('/markets/90210')
    await expect(page).toHaveURL(/\/login/)
  })

  test('redirect preserves markets path', async ({ page }) => {
    await page.goto('/markets')
    await expect(page).toHaveURL(/\/login\?redirect=%2Fmarkets/)
  })
})
