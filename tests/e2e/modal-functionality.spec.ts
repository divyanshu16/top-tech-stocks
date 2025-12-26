import { test, expect } from '@playwright/test';

test.describe('Stock Modal Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should open modal when clicking a stock card', async ({ page }) => {
    // Click on first stock card
    await page.locator('[class*="cursor-pointer"]').first().click();

    // Modal should be visible
    const modal = page.locator('[class*="fixed"][class*="inset-0"]');
    await expect(modal).toBeVisible();
  });

  test('should close modal when clicking X button', async ({ page }) => {
    // Open modal
    await page.getByText('AAPL').first().click();
    await expect(page.locator('[class*="fixed"][class*="inset-0"]')).toBeVisible();

    // Click close button
    await page.getByRole('button', { name: /close modal/i }).click();

    // Modal should close
    await expect(page.locator('[class*="fixed"][class*="inset-0"]')).not.toBeVisible();
  });

  test('should close modal when clicking backdrop', async ({ page }) => {
    // Open modal
    await page.getByText('MSFT').first().click();
    await expect(page.locator('[class*="fixed"][class*="inset-0"]')).toBeVisible();

    // Click outside modal (on backdrop)
    await page.locator('[class*="fixed"][class*="inset-0"]').click({ position: { x: 10, y: 10 } });

    // Modal should close
    await expect(page.locator('[class*="fixed"][class*="inset-0"]')).not.toBeVisible();
  });

  test('should close modal when pressing Escape key', async ({ page }) => {
    // Open modal
    await page.getByText('GOOGL').first().click();
    await expect(page.locator('[class*="fixed"][class*="inset-0"]')).toBeVisible();

    // Press Escape key
    await page.keyboard.press('Escape');

    // Modal should close
    await expect(page.locator('[class*="fixed"][class*="inset-0"]')).not.toBeVisible();
  });

  test('should display stock details in modal', async ({ page }) => {
    // Open Apple modal
    await page.getByText('AAPL').first().click();

    const modal = page.locator('[class*="fixed"][class*="inset-0"]');
    await expect(modal).toBeVisible();

    // Should show symbol
    await expect(modal.getByText('AAPL')).toBeVisible();

    // Should show company name
    await expect(modal.getByText('Apple Inc.')).toBeVisible();

    // Should show exchange
    await expect(modal.getByText('NASDAQ')).toBeVisible();

    // Should show company overview section
    await expect(modal.getByText('Company Overview')).toBeVisible();

    // Should show description
    await expect(modal.getByText(/designs.*manufactures/i)).toBeVisible();

    // Should show sector
    await expect(modal.getByText('Consumer Electronics')).toBeVisible();
  });

  test('should display disclaimer in modal', async ({ page }) => {
    await page.getByText('NVDA').first().click();

    const modal = page.locator('[class*="fixed"][class*="inset-0"]');
    await expect(modal.getByText(/disclaimer/i)).toBeVisible();
    await expect(modal.getByText(/educational purposes only/i)).toBeVisible();
  });

  test('should prevent body scroll when modal is open', async ({ page }) => {
    // Open modal
    await page.getByText('TSLA').first().click();

    // Check if body has overflow hidden (indicates scroll prevention)
    const bodyOverflow = await page.evaluate(() => {
      return window.getComputedStyle(document.body).overflow;
    });

    expect(bodyOverflow).toBe('hidden');
  });

  test('should restore body scroll when modal is closed', async ({ page }) => {
    // Open modal
    await page.getByText('META').first().click();
    await page.waitForTimeout(300);

    // Close modal
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);

    // Check if body overflow is restored
    const bodyOverflow = await page.evaluate(() => {
      return window.getComputedStyle(document.body).overflow;
    });

    expect(bodyOverflow).not.toBe('hidden');
  });

  test('should not close modal when clicking inside modal content', async ({ page }) => {
    // Open modal
    await page.getByText('AMD').first().click();

    const modal = page.locator('[class*="fixed"][class*="inset-0"]');
    await expect(modal).toBeVisible();

    // Click inside modal content
    await page.getByText('Company Overview').click();

    // Modal should still be visible
    await expect(modal).toBeVisible();
  });

  test('should switch between different stock modals', async ({ page }) => {
    // Open first stock
    await page.getByText('AAPL').first().click();
    await expect(page.getByText('Apple Inc.')).toBeVisible();

    // Close and open another
    await page.keyboard.press('Escape');
    await page.getByText('MSFT').first().click();
    await expect(page.getByText('Microsoft Corporation')).toBeVisible();

    // Close and open third
    await page.keyboard.press('Escape');
    await page.getByText('NVDA').first().click();
    await expect(page.getByText('NVIDIA Corporation')).toBeVisible();
  });

  test('should display larger chart in modal', async ({ page }) => {
    await page.getByText('CRM').first().click();

    // Modal should contain a TradingView chart container
    const modal = page.locator('[class*="fixed"][class*="inset-0"]');

    // Look for chart container (TradingView creates divs with specific IDs)
    const chartContainer = modal.locator('div[id*="tradingview"]');
    await expect(chartContainer).toBeVisible();
  });
});
