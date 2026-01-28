import { test, expect } from '@playwright/test'

test.describe('Settings - Unauthenticated Access', () => {
  test('settings page redirects to login', async ({ page }) => {
    await page.goto('/settings')
    await expect(page).toHaveURL(/\/login/)
  })

  test('settings defaults page redirects to login', async ({ page }) => {
    await page.goto('/settings/defaults')
    await expect(page).toHaveURL(/\/login/)
  })

  test('settings profile page redirects to login', async ({ page }) => {
    await page.goto('/settings/profile')
    await expect(page).toHaveURL(/\/login/)
  })

  test('redirect preserves settings path', async ({ page }) => {
    await page.goto('/settings')
    await expect(page).toHaveURL(/\/login\?redirect=%2Fsettings/)
  })
})
