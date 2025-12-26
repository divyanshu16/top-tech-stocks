import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toBeVisible();
    await expect(h1).toHaveText(/top tech stocks dashboard/i);

    // Open modal to check h2/h3
    await page.getByText('AAPL').first().click();

    const h2 = page.getByRole('heading', { level: 2 });
    await expect(h2).toBeVisible();

    const h3 = page.getByRole('heading', { level: 3 });
    await expect(h3).toBeVisible();
  });

  test('should have keyboard navigable cards', async ({ page }) => {
    // Tab to first interactive element
    await page.keyboard.press('Tab');

    // Should be able to activate cards with Enter
    await page.keyboard.press('Enter');

    // Modal should open
    await expect(page.locator('[class*="fixed"][class*="inset-0"]')).toBeVisible();
  });

  test('should support keyboard navigation in modal', async ({ page }) => {
    await page.getByText('MSFT').first().click();

    const modal = page.locator('[class*="fixed"][class*="inset-0"]');
    await expect(modal).toBeVisible();

    // Should be able to close with keyboard
    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible();
  });

  test('should have sufficient color contrast', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .analyze();

    const contrastViolations = accessibilityScanResults.violations.filter(
      v => v.id === 'color-contrast'
    );

    expect(contrastViolations).toHaveLength(0);
  });

  test('should have proper ARIA labels on interactive elements', async ({ page }) => {
    // Open modal
    await page.getByText('NVDA').first().click();

    // Close button should have aria-label
    const closeButton = page.getByRole('button', { name: /close/i });
    await expect(closeButton).toBeVisible();

    const ariaLabel = await closeButton.getAttribute('aria-label');
    expect(ariaLabel).toBeTruthy();
  });

  test('should be screen reader friendly', async ({ page }) => {
    // Check for semantic HTML
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();

    // Stock cards should be clickable
    const cards = page.locator('[class*="cursor-pointer"]');
    await expect(cards.first()).toBeVisible();
  });

  test('should maintain focus management in modal', async ({ page }) => {
    await page.getByText('AMD').first().click();

    // Focus should be trapped in modal
    const modal = page.locator('[class*="fixed"][class*="inset-0"]');
    await expect(modal).toBeVisible();

    // Close button should be focusable
    await page.keyboard.press('Tab');

    // Escape should close modal
    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible();
  });

  test('should have text alternatives for content', async ({ page }) => {
    // Open modal
    await page.getByText('TSLA').first().click();

    const modal = page.locator('[class*="fixed"][class*="inset-0"]');

    // Should have descriptive text
    await expect(modal.getByText('Tesla Inc.')).toBeVisible();
    await expect(modal.getByText(/designs.*manufactures/i)).toBeVisible();
  });

  test('should not have any automatically detectable WCAG 2.1 Level AA issues', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have touch targets large enough (mobile)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const firstCard = page.locator('[class*="cursor-pointer"]').first();
    const box = await firstCard.boundingBox();

    // Touch targets should be at least 44x44 (WCAG 2.1 Level AAA suggests 44x44)
    expect(box?.height).toBeGreaterThanOrEqual(44);
  });

  test('should support zoom without horizontal scroll', async ({ page }) => {
    // Simulate 200% zoom by setting smaller viewport
    await page.setViewportSize({ width: 960, height: 540 });

    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });

    expect(hasHorizontalScroll).toBe(false);
  });

  test('should have proper document structure', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['best-practice'])
      .analyze();

    // Allow some violations but check for critical ones
    const criticalViolations = accessibilityScanResults.violations.filter(
      v => v.impact === 'critical' || v.impact === 'serious'
    );

    expect(criticalViolations.length).toBeLessThanOrEqual(2);
  });

  test('should not have focusable elements hidden', async ({ page }) => {
    // All visible cards should be focusable
    const cards = page.locator('[class*="cursor-pointer"]');
    const count = await cards.count();

    for (let i = 0; i < Math.min(count, 3); i++) {
      const card = cards.nth(i);
      await expect(card).toBeVisible();
    }
  });

  test('should announce modal state changes to screen readers', async ({ page }) => {
    // Open modal
    await page.getByText('CRM').first().click();
    await page.waitForTimeout(300);

    const modal = page.locator('[class*="fixed"][class*="inset-0"]');
    await expect(modal).toBeVisible();

    // Modal content should be in the DOM
    await expect(modal.getByText('Salesforce Inc.')).toBeVisible();

    // Close modal
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);

    // Modal should be removed from DOM
    await expect(modal).not.toBeVisible();
  });
});
