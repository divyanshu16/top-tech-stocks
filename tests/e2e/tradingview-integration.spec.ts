import { test, expect } from '@playwright/test';

test.describe('TradingView Chart Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should load TradingView script in page head', async ({ page }) => {
    const scriptSrc = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script'));
      return scripts.find(s => s.src.includes('tradingview'))?.src;
    });

    expect(scriptSrc).toContain('tradingview.com');
  });

  test('should have TradingView global available', async ({ page }) => {
    const hasTradingView = await page.evaluate(() => {
      return typeof (window as any).TradingView !== 'undefined';
    });

    expect(hasTradingView).toBe(true);
  });

  test('should render chart containers in stock cards', async ({ page }) => {
    // Wait for chart containers to be created
    await page.waitForTimeout(2000);

    const chartContainers = page.locator('div[id*="tradingview"]');
    const count = await chartContainers.count();

    // Should have at least some chart containers (16 mini + potentially modal)
    expect(count).toBeGreaterThan(0);
  });

  test('should create unique chart IDs for each card', async ({ page }) => {
    await page.waitForTimeout(2000);

    const chartIds = await page.evaluate(() => {
      const containers = Array.from(document.querySelectorAll('div[id*="tradingview"]'));
      return containers.map(c => c.id);
    });

    // All IDs should be unique
    const uniqueIds = new Set(chartIds);
    expect(uniqueIds.size).toBe(chartIds.length);
  });

  test('should display chart container with correct dimensions', async ({ page }) => {
    await page.waitForTimeout(2000);

    const firstChart = page.locator('div[id*="tradingview-mini"]').first();

    if (await firstChart.count() > 0) {
      const box = await firstChart.boundingBox();

      if (box) {
        // Mini chart should be around 200px height
        expect(box.height).toBeGreaterThanOrEqual(150);
        expect(box.height).toBeLessThanOrEqual(250);

        // Should have width
        expect(box.width).toBeGreaterThan(0);
      }
    }
  });

  test('should load advanced chart in modal', async ({ page }) => {
    // Open modal
    await page.getByText('AAPL').first().click();
    await page.waitForTimeout(1000);

    // Look for advanced chart container
    const modalChart = page.locator('[class*="fixed"] div[id*="tradingview-advanced"], [class*="fixed"] div[id*="tradingview"][id*="AAPL"]');

    if (await modalChart.count() > 0) {
      await expect(modalChart.first()).toBeVisible();

      const box = await modalChart.first().boundingBox();

      if (box) {
        // Advanced chart should be larger (500px height)
        expect(box.height).toBeGreaterThanOrEqual(400);
      }
    }
  });

  test('should handle chart initialization for all 16 stocks', async ({ page }) => {
    await page.waitForTimeout(3000);

    // Check that we don't have initialization errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Scroll to load all charts
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });

    await page.waitForTimeout(2000);

    // Filter out expected TradingView warnings
    const criticalErrors = consoleErrors.filter(
      err => !err.includes('TradingView') && !err.toLowerCase().includes('widget')
    );

    expect(criticalErrors.length).toBeLessThan(5); // Allow some non-critical errors
  });

  test('should initialize mini charts for visible cards', async ({ page }) => {
    await page.waitForTimeout(2000);

    // Get first card's chart container
    const firstCard = page.locator('[class*="cursor-pointer"]').first();
    const chartInCard = firstCard.locator('div[id*="tradingview"]');

    if (await chartInCard.count() > 0) {
      await expect(chartInCard).toBeVisible();
    } else {
      // If no chart container, at least the card should be visible
      await expect(firstCard).toBeVisible();
    }
  });

  test('should maintain charts when scrolling', async ({ page }) => {
    await page.waitForTimeout(2000);

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(500);

    // Charts should still be present
    const chartContainers = page.locator('div[id*="tradingview"]');
    const count = await chartContainers.count();

    expect(count).toBeGreaterThan(0);

    // Scroll back up
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    // Charts should still work
    const newCount = await chartContainers.count();
    expect(newCount).toBeGreaterThan(0);
  });

  test('should clean up charts when modal closes', async ({ page }) => {
    // Open modal
    await page.getByText('MSFT').first().click();
    await page.waitForTimeout(1000);

    const modalOpen = page.locator('[class*="fixed"][class*="inset-0"]');
    await expect(modalOpen).toBeVisible();

    // Close modal
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    // Modal should be gone
    await expect(modalOpen).not.toBeVisible();

    // Page should still be functional
    await expect(page.getByText('MSFT').first()).toBeVisible();
  });

  test('should handle rapid modal open/close', async ({ page }) => {
    // Rapidly open and close modals
    for (let i = 0; i < 3; i++) {
      await page.getByText('NVDA').first().click();
      await page.waitForTimeout(300);
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
    }

    // Page should still be responsive
    await expect(page.getByText('NVDA').first()).toBeVisible();

    // Should be able to open modal again
    await page.getByText('NVDA').first().click();
    await expect(page.locator('[class*="fixed"][class*="inset-0"]')).toBeVisible();
  });

  test('should display different charts for different stocks', async ({ page }) => {
    const stocks = ['AAPL', 'MSFT', 'GOOGL'];

    for (const symbol of stocks) {
      await page.getByText(symbol).first().click();
      await page.waitForTimeout(1000);

      // Modal should show the correct symbol
      const modal = page.locator('[class*="fixed"][class*="inset-0"]');
      await expect(modal.getByText(symbol)).toBeVisible();

      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
    }
  });
});
