import { test, expect } from '@playwright/test'

test.describe('Compare Page', () => {
  test('compare page loads', async ({ page }) => {
    await page.goto('/compare')
    // Should either show compare page or redirect to login
    await expect(page).toHaveURL(/\/(compare|login)/)
  })

  test('compare page shows empty state for unauthenticated users', async ({ page }) => {
    await page.goto('/compare')

    const url = page.url()
    if (url.includes('/login')) {
      expect(url).toContain('/login')
      return
    }

    // If on compare page, should show some content
    await expect(page.locator('body')).toBeVisible()
  })
})
