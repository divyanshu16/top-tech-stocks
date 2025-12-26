import { test, expect } from '@playwright/test';

test.describe('Responsive Design', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Desktop View (1920x1080)', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
    });

    test('should display 4-column grid layout', async ({ page }) => {
      const grid = page.locator('div.grid').first();
      const gridClasses = await grid.getAttribute('class');

      // Should have xl:grid-cols-4 class
      expect(gridClasses).toContain('xl:grid-cols-4');
    });

    test('should display all cards without scrolling horizontally', async ({ page }) => {
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      expect(hasHorizontalScroll).toBe(false);
    });

    test('should show full card content', async ({ page }) => {
      const firstCard = page.locator('[class*="cursor-pointer"]').first();

      await expect(firstCard.getByText('AAPL')).toBeVisible();
      await expect(firstCard.getByText('Apple Inc.')).toBeVisible();
      await expect(firstCard.getByText('NASDAQ')).toBeVisible();
      await expect(firstCard.getByText('Consumer Electronics')).toBeVisible();
    });
  });

  test.describe('Tablet View (768x1024)', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
    });

    test('should display 2-3 column grid layout', async ({ page }) => {
      const grid = page.locator('div.grid').first();
      const gridClasses = await grid.getAttribute('class');

      // Should have md:grid-cols-2 or lg:grid-cols-3 class
      expect(gridClasses).toMatch(/md:grid-cols-2|lg:grid-cols-3/);
    });

    test('should display all 16 stock cards', async ({ page }) => {
      const cards = page.locator('[class*="cursor-pointer"]');
      await expect(cards).toHaveCount(16);
    });

    test('should show readable text', async ({ page }) => {
      await expect(page.getByText('AAPL')).toBeVisible();
      await expect(page.getByText('Apple Inc.')).toBeVisible();
    });

    test('should open modal correctly', async ({ page }) => {
      await page.getByText('MSFT').first().click();
      await expect(page.locator('[class*="fixed"][class*="inset-0"]')).toBeVisible();
    });
  });

  test.describe('Mobile View (375x667 - iPhone SE)', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
    });

    test('should display single column layout', async ({ page }) => {
      const grid = page.locator('div.grid').first();
      const gridClasses = await grid.getAttribute('class');

      // Should have grid-cols-1 as base
      expect(gridClasses).toContain('grid-cols-1');
    });

    test('should display all cards in vertical stack', async ({ page }) => {
      const cards = page.locator('[class*="cursor-pointer"]');
      await expect(cards).toHaveCount(16);

      // Check first few cards are stacked vertically
      const positions = [];
      for (let i = 0; i < 3; i++) {
        const box = await cards.nth(i).boundingBox();
        if (box) positions.push(box.y);
      }

      // Each card should be below the previous one
      expect(positions[1]).toBeGreaterThan(positions[0]);
      expect(positions[2]).toBeGreaterThan(positions[1]);
    });

    test('should have scrollable content', async ({ page }) => {
      const hasVerticalScroll = await page.evaluate(() => {
        return document.documentElement.scrollHeight > document.documentElement.clientHeight;
      });

      expect(hasVerticalScroll).toBe(true);
    });

    test('should not have horizontal overflow', async ({ page }) => {
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      expect(hasHorizontalScroll).toBe(false);
    });

    test('should display modal in mobile view', async ({ page }) => {
      await page.getByText('NVDA').first().click();

      const modal = page.locator('[class*="fixed"][class*="inset-0"]');
      await expect(modal).toBeVisible();

      // Modal should fit within viewport
      const modalBox = await modal.boundingBox();
      expect(modalBox?.width).toBeLessThanOrEqual(375);
    });

    test('should have tappable card elements', async ({ page }) => {
      const firstCard = page.locator('[class*="cursor-pointer"]').first();

      // Card should be large enough for touch interaction (min 44x44 for accessibility)
      const box = await firstCard.boundingBox();
      expect(box?.height).toBeGreaterThan(44);
    });

    test('should show readable header on mobile', async ({ page }) => {
      await expect(page.getByRole('heading', { name: /top tech stocks/i })).toBeVisible();
    });
  });

  test.describe('Large Desktop (2560x1440)', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 2560, height: 1440 });
    });

    test('should display 4-column grid without stretching', async ({ page }) => {
      const grid = page.locator('div.grid').first();
      await expect(grid).toBeVisible();

      // Cards should have max container width (container mx-auto)
      const containerClasses = await page.locator('.container').first().getAttribute('class');
      expect(containerClasses).toContain('container');
      expect(containerClasses).toContain('mx-auto');
    });

    test('should center content with margins', async ({ page }) => {
      const container = page.locator('.container').first();
      const box = await container.boundingBox();

      // Container should be centered (has left margin)
      expect(box?.x).toBeGreaterThan(0);
    });
  });

  test.describe('iPad Pro (1024x1366)', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 1024, height: 1366 });
    });

    test('should display 3-column grid', async ({ page }) => {
      const grid = page.locator('div.grid').first();
      const gridClasses = await grid.getAttribute('class');

      expect(gridClasses).toContain('lg:grid-cols-3');
    });

    test('should have proper spacing between cards', async ({ page }) => {
      const cards = page.locator('[class*="cursor-pointer"]');

      const firstBox = await cards.nth(0).boundingBox();
      const secondBox = await cards.nth(1).boundingBox();

      if (firstBox && secondBox) {
        const gap = secondBox.x - (firstBox.x + firstBox.width);
        expect(gap).toBeGreaterThan(0); // Should have gap between cards
      }
    });
  });

  test.describe('Landscape Mobile (667x375)', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 667, height: 375 });
    });

    test('should adapt to landscape orientation', async ({ page }) => {
      await expect(page.getByRole('heading')).toBeVisible();

      const cards = page.locator('[class*="cursor-pointer"]');
      await expect(cards.first()).toBeVisible();
    });

    test('should be scrollable in landscape', async ({ page }) => {
      const hasScroll = await page.evaluate(() => {
        return document.documentElement.scrollHeight > document.documentElement.clientHeight;
      });

      expect(hasScroll).toBe(true);
    });
  });

  test('should maintain aspect ratios across viewports', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667 },
      { width: 768, height: 1024 },
      { width: 1920, height: 1080 },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(300);

      const firstCard = page.locator('[class*="cursor-pointer"]').first();
      const box = await firstCard.boundingBox();

      // Card should have reasonable proportions
      if (box) {
        expect(box.height).toBeGreaterThan(100); // Not too small
        expect(box.width).toBeGreaterThan(100);
      }
    }
  });
});
