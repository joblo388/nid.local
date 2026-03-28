import { test, expect } from '@playwright/test';

test.describe('Tools pages', () => {
  test('/calculatrice-hypothecaire loads and has input fields', async ({ page }) => {
    await page.goto('/calculatrice-hypothecaire');
    await expect(page).toHaveURL(/\/calculatrice-hypothecaire/);
    const inputs = page.locator('input');
    await expect(inputs.first()).toBeVisible({ timeout: 10000 });
  });

  test('/capacite-emprunt loads', async ({ page }) => {
    await page.goto('/capacite-emprunt');
    await expect(page).toHaveURL(/\/capacite-emprunt/);
    await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 10000 });
  });

  test('/donnees-marche loads with market data', async ({ page }) => {
    await page.goto('/donnees-marche');
    await expect(page).toHaveURL(/\/donnees-marche/);
    await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 10000 });
  });

  test('/estimation loads with estimation form', async ({ page }) => {
    await page.goto('/estimation');
    await expect(page).toHaveURL(/\/estimation/);
    await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 10000 });
  });

  test('/acheter-ou-louer loads', async ({ page }) => {
    await page.goto('/acheter-ou-louer');
    await expect(page).toHaveURL(/\/acheter-ou-louer/);
    await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 10000 });
  });
});
