import { test, expect } from '@playwright/test';

test.describe('Stock Grid Rendering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the page title and subtitle', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /top tech stocks dashboard/i })).toBeVisible();
    await expect(page.getByText(/compare.*leading us technology stocks/i)).toBeVisible();
  });

  test('should render all 16 stock cards', async ({ page }) => {
    // Wait for cards to load
    await page.waitForSelector('[class*="bg-slate-800"]', { timeout: 10000 });

    // Count stock cards
    const cards = page.locator('[class*="bg-slate-800"][class*="rounded-lg"][class*="cursor-pointer"]');
    await expect(cards).toHaveCount(16);
  });

  test('should display all expected stock symbols', async ({ page }) => {
    const expectedSymbols = [
      'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'NVDA', 'TSLA', 'AVGO',
      'ORCL', 'AMD', 'CRM', 'ADBE', 'NFLX', 'CSCO', 'INTC', 'QCOM'
    ];

    for (const symbol of expectedSymbols) {
      await expect(page.getByText(symbol, { exact: true })).toBeVisible();
    }
  });

  test('should display company names for each stock', async ({ page }) => {
    const companies = [
      'Apple Inc.',
      'Microsoft Corporation',
      'Alphabet Inc.',
      'Amazon.com Inc.',
    ];

    for (const company of companies) {
      await expect(page.getByText(company)).toBeVisible();
    }
  });

  test('should display exchange badges', async ({ page }) => {
    await expect(page.getByText('NASDAQ').first()).toBeVisible();
    await expect(page.getByText('NYSE').first()).toBeVisible();
  });

  test('should display sector information', async ({ page }) => {
    await expect(page.getByText('Consumer Electronics')).toBeVisible();
    await expect(page.getByText('Software & Cloud')).toBeVisible();
    await expect(page.getByText('Internet & Search')).toBeVisible();
  });

  test('should display footer with attribution', async ({ page }) => {
    await expect(page.getByText(/real-time data powered by tradingview/i)).toBeVisible();
  });

  test('should have proper grid layout on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });

    const grid = page.locator('div.grid');
    await expect(grid).toBeVisible();

    // Check for grid classes
    const gridClasses = await grid.getAttribute('class');
    expect(gridClasses).toContain('grid');
  });

  test('should load without console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Filter out TradingView related errors (external library)
    const relevantErrors = consoleErrors.filter(
      err => !err.includes('TradingView') && !err.includes('tradingview')
    );

    expect(relevantErrors).toHaveLength(0);
  });
});
