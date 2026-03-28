import { test, expect } from '@playwright/test';

test.describe('Marketplace', () => {
  test('/annonces page loads with marketplace header', async ({ page }) => {
    await page.goto('/annonces');
    await expect(page.getByText('Marketplace')).toBeVisible();
  });

  test('filter controls are visible', async ({ page }) => {
    await page.goto('/annonces');
    // Check that at least one filter element is present (type, ville, or prix)
    const filters = page.locator('select, input[type="range"], [role="combobox"]');
    await expect(filters.first()).toBeVisible({ timeout: 10000 });
  });

  test('"Publier" link exists in navigation', async ({ page }) => {
    await page.goto('/annonces');
    await expect(page.getByRole('link', { name: /Publier/i })).toBeVisible();
  });
});
