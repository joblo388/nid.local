import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('page loads with correct title containing "nid.local"', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/nid\.local/i);
  });

  test('header shows logo with "nid" and ".local"', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('header');
    await expect(header).toBeVisible();
    await expect(header).toContainText('nid');
    await expect(header).toContainText('.local');
  });

  test('navigation links are visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: /Fil/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Tendances/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Villes/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Annonces/i })).toBeVisible();
  });

  test('sidebar is visible on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    const sidebar = page.locator('aside');
    await expect(sidebar).toBeVisible();
  });

  test('"Communauté" badge is visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Communauté')).toBeVisible();
  });
});
