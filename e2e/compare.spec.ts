import { test, expect } from '@playwright/test'

test.describe('Compare - Unauthenticated Access', () => {
  test('compare page redirects to login', async ({ page }) => {
    await page.goto('/compare')
    await expect(page).toHaveURL(/\/login/)
  })

  test('redirect preserves compare path', async ({ page }) => {
    await page.goto('/compare')
    await expect(page).toHaveURL(/\/login\?redirect=%2Fcompare/)
  })
})
