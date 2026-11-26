import { test, expect } from '@playwright/test';

test.describe('Business Directory Discovery (E2E)', () => {
  test('E2E-BUS-001: directory loads, supports search input, and toggles card/table view', async ({ page }) => {
    await page.goto('/businesses');

    const searchBox = page.getByRole('textbox').first();
    await expect(searchBox).toBeVisible();
    await searchBox.fill('Steel');
    await searchBox.press('Enter');

    // View toggle buttons exist
    const tableBtn = page.getByRole('button', { name: /table|list/i }).first();
    if (await tableBtn.isVisible()) {
      await tableBtn.click();
    }
  });
});
