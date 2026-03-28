import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('clicking "Villes" navigates to /villes', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Villes/i }).click();
    await expect(page).toHaveURL(/\/villes/);
  });

  test('clicking "Tendances" navigates to /tendances', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Tendances/i }).click();
    await expect(page).toHaveURL(/\/tendances/);
  });

  test('clicking "Annonces" navigates to /annonces and shows "Marketplace" badge', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Annonces/i }).click();
    await expect(page).toHaveURL(/\/annonces/);
    await expect(page.getByText('Marketplace')).toBeVisible();
  });

  test('back to forum shows "Communauté" badge', async ({ page }) => {
    await page.goto('/annonces');
    await page.getByRole('link', { name: /Fil/i }).click();
    await expect(page).toHaveURL('/');
    await expect(page.getByText('Communauté')).toBeVisible();
  });
});
