# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Authentication & Route Protection (E2E) >> E2E-AUTH-002: login form validates empty/invalid fields and toggles password visibility
- Location: tests\e2e\auth.spec.ts:10:3

# Error details

```
Error: expect(locator).toHaveAttribute(expected) failed

Locator:  locator('#login-password')
Expected: "text"
Received: "password"
Timeout:  5000ms

Call log:
  - Expect "toHaveAttribute" locator('#login-password') with timeout 5000ms
  - waiting for locator('#login-password')
    14 × locator resolved to <input value="" type="password" id="login-password" autocomplete="current-password" placeholder="Enter your password" class="w-full border placeholder:text-muted-foreground transition-colors duration-150 outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-hover px-3.5 pl-10 pr-10 h-11 sm:h-[46px] rounded-xl border-[#E5D4DA] hover:border-[#D5C0C8] focus:border-[#7F1D3F] focus:ring-4 focus:ring-[#7F1D3F]/10 text-sm text-[#2B1220] bg-white shadow-[inset_0_1px_2px_rgba(0,0,0,…/>
       - unexpected value "password"

```

```yaml
- textbox "Password":
  - /placeholder: Enter your password
  - text: Secret123!
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Authentication & Route Protection (E2E)', () => {
  4  |   test('E2E-AUTH-001: unauthenticated user on /dashboard is redirected to /login', async ({ page }) => {
  5  |     await page.goto('/dashboard');
  6  |     await expect(page).toHaveURL(/\/login\?redirect=%2Fdashboard/);
  7  |     await expect(page.getByRole('button', { name: /sign in|login/i })).toBeVisible();
  8  |   });
  9  | 
  10 |   test('E2E-AUTH-002: login form validates empty/invalid fields and toggles password visibility', async ({ page }) => {
  11 |     await page.goto('/login');
  12 | 
  13 |     const emailInput = page.locator('#login-email');
  14 |     const passwordInput = page.locator('#login-password');
  15 | 
  16 |     await expect(emailInput).toBeVisible();
  17 |     await expect(passwordInput).toBeVisible();
  18 | 
  19 |     await passwordInput.fill('Secret123!');
  20 |     await expect(passwordInput).toHaveAttribute('type', 'password');
  21 |     await page.getByRole('button', { name: 'Show password' }).click();
> 22 |     await expect(passwordInput).toHaveAttribute('type', 'text');
     |                                 ^ Error: expect(locator).toHaveAttribute(expected) failed
  23 | 
  24 |     await emailInput.fill('not-an-email');
  25 |     await page.getByRole('button', { name: /sign in|login/i }).click();
  26 |     await expect(page.getByText(/valid email/i)).toBeVisible();
  27 |   });
  28 | });
  29 | 
```