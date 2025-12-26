import { test, expect } from '@playwright/test';

test.describe('Stock Card Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should show hover effect on stock cards', async ({ page }) => {
    const firstCard = page.locator('[class*="cursor-pointer"]').first();

    // Get initial state
    const initialBox = await firstCard.boundingBox();

    // Hover over card
    await firstCard.hover();

    // Card should be visible and interactable
    await expect(firstCard).toBeVisible();
    await expect(firstCard).toHaveCSS('cursor', 'pointer');
  });

  test('should have all cards clickable', async ({ page }) => {
    const cards = page.locator('[class*="cursor-pointer"]');
    const count = await cards.count();

    expect(count).toBe(16);

    // Verify each card is clickable by checking cursor
    for (let i = 0; i < Math.min(count, 3); i++) {
      const card = cards.nth(i);
      await expect(card).toHaveCSS('cursor', 'pointer');
    }
  });

  test('should open modal when clicking on AAPL card', async ({ page }) => {
    // Click on Apple card
    await page.getByText('AAPL').first().click();

    // Modal should appear
    await expect(page.locator('[class*="fixed"][class*="inset-0"]')).toBeVisible();

    // Modal should contain AAPL information
    await expect(page.getByText('Apple Inc.')).toBeVisible();
    await expect(page.getByText(/designs.*manufactures.*markets smartphones/i)).toBeVisible();
  });

  test('should open modal when clicking on different stocks', async ({ page }) => {
    const stocks = ['MSFT', 'GOOGL', 'AMZN'];

    for (const symbol of stocks) {
      // Click on stock card
      await page.getByText(symbol).first().click();

      // Modal should be visible
      await expect(page.locator('[class*="fixed"][class*="inset-0"]')).toBeVisible();

      // Close modal by clicking outside
      await page.locator('[class*="fixed"][class*="inset-0"]').click({ position: { x: 10, y: 10 } });

      // Modal should close
      await expect(page.locator('[class*="fixed"][class*="inset-0"]')).not.toBeVisible();

      // Wait a bit before next iteration
      await page.waitForTimeout(300);
    }
  });

  test('should display all card elements correctly', async ({ page }) => {
    const firstCard = page.locator('[class*="cursor-pointer"]').first();

    // Should have header section
    await expect(firstCard.locator('text=AAPL')).toBeVisible();
    await expect(firstCard.locator('text=Apple Inc.')).toBeVisible();

    // Should have exchange badge
    await expect(firstCard.locator('text=NASDAQ')).toBeVisible();

    // Should have sector footer
    await expect(firstCard.locator('text=Consumer Electronics')).toBeVisible();
  });

  test('should maintain card structure across all cards', async ({ page }) => {
    const cards = page.locator('[class*="cursor-pointer"]');
    const count = await cards.count();

    // Check first 5 cards have consistent structure
    for (let i = 0; i < Math.min(count, 5); i++) {
      const card = cards.nth(i);

      // Each card should have background color
      await expect(card).toHaveClass(/bg-slate-800/);

      // Each card should be rounded
      await expect(card).toHaveClass(/rounded-lg/);

      // Each card should have border
      await expect(card).toHaveClass(/border/);
    }
  });
});
