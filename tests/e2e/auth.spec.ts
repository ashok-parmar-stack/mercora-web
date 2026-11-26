import { test, expect } from '@playwright/test';

test.describe('Authentication & Route Protection (E2E)', () => {
  test('E2E-AUTH-001: unauthenticated user on /dashboard is redirected to /login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login\?redirect=%2Fdashboard/);
    await expect(page.getByRole('button', { name: /sign in|login/i })).toBeVisible();
  });

  test('E2E-AUTH-002: login form validates empty/invalid fields and toggles password visibility', async ({ page }) => {
    await page.goto('/login');

    const emailInput = page.locator('#login-email');
    const passwordInput = page.locator('#login-password');

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();

    await passwordInput.fill('Secret123!');
    await expect(passwordInput).toHaveAttribute('type', 'password');
    await page.getByRole('button', { name: 'Show password' }).click();
    await expect(passwordInput).toHaveAttribute('type', 'text');

    await emailInput.fill('not-an-email');
    await page.getByRole('button', { name: /sign in|login/i }).click();
    await expect(page.getByText(/valid email/i)).toBeVisible();
  });
});
