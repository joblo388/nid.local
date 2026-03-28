import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('/auth/connexion page loads with login form', async ({ page }) => {
    await page.goto('/auth/connexion');
    await expect(page.getByRole('button', { name: /connexion/i })).toBeVisible();
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('/auth/inscription page loads with registration form', async ({ page }) => {
    await page.goto('/auth/inscription');
    await expect(page.getByRole('button', { name: /inscrire/i })).toBeVisible();
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('login with invalid credentials shows error', async ({ page }) => {
    await page.goto('/auth/connexion');
    await page.locator('input[type="email"], input[name="email"]').fill('faux@test.com');
    await page.locator('input[type="password"]').fill('mauvaismdp123');
    await page.getByRole('button', { name: /connexion/i }).click();
    await expect(page.getByText(/erreur|invalide|incorrect/i)).toBeVisible({ timeout: 10000 });
  });

  test('"S\'inscrire" button links to inscription page', async ({ page }) => {
    await page.goto('/auth/connexion');
    await page.getByRole('link', { name: /inscrire/i }).click();
    await expect(page).toHaveURL(/\/auth\/inscription/);
  });
});
