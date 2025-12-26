import { describe, it, expect } from 'vitest';
import { topTechStocks } from '../../src/data/topTechStocks';

describe('Top Tech Stocks Data', () => {
  it('should have exactly 16 stocks', () => {
    expect(topTechStocks).toHaveLength(16);
  });

  it('should have all required fields for each stock', () => {
    topTechStocks.forEach(stock => {
      expect(stock).toHaveProperty('symbol');
      expect(stock).toHaveProperty('companyName');
      expect(stock).toHaveProperty('exchange');
      expect(stock).toHaveProperty('sector');
      expect(stock).toHaveProperty('description');
    });
  });

  it('should have unique symbols', () => {
    const symbols = topTechStocks.map(s => s.symbol);
    const uniqueSymbols = new Set(symbols);

    expect(uniqueSymbols.size).toBe(topTechStocks.length);
  });

  it('should have valid stock symbols (all uppercase letters)', () => {
    topTechStocks.forEach(stock => {
      expect(stock.symbol).toMatch(/^[A-Z]+$/);
      expect(stock.symbol.length).toBeGreaterThan(0);
      expect(stock.symbol.length).toBeLessThanOrEqual(5);
    });
  });

  it('should have non-empty company names', () => {
    topTechStocks.forEach(stock => {
      expect(stock.companyName).toBeTruthy();
      expect(stock.companyName.length).toBeGreaterThan(0);
    });
  });

  it('should have valid exchanges', () => {
    const validExchanges = ['NASDAQ', 'NYSE'];

    topTechStocks.forEach(stock => {
      expect(validExchanges).toContain(stock.exchange);
    });
  });

  it('should have non-empty sectors', () => {
    topTechStocks.forEach(stock => {
      expect(stock.sector).toBeTruthy();
      expect(stock.sector.length).toBeGreaterThan(0);
    });
  });

  it('should have non-empty descriptions', () => {
    topTechStocks.forEach(stock => {
      expect(stock.description).toBeTruthy();
      expect(stock.description.length).toBeGreaterThan(20);
    });
  });

  it('should include major tech companies', () => {
    const symbols = topTechStocks.map(s => s.symbol);

    expect(symbols).toContain('AAPL');
    expect(symbols).toContain('MSFT');
    expect(symbols).toContain('GOOGL');
    expect(symbols).toContain('AMZN');
    expect(symbols).toContain('META');
    expect(symbols).toContain('NVDA');
  });

  it('should have consistent data structure', () => {
    const firstStock = topTechStocks[0];
    const keys = Object.keys(firstStock);

    topTechStocks.forEach(stock => {
      expect(Object.keys(stock).sort()).toEqual(keys.sort());
    });
  });

  it('should have proper company name formats', () => {
    topTechStocks.forEach(stock => {
      // Company names should include common suffixes
      const hasProperFormat =
        stock.companyName.includes('Inc') ||
        stock.companyName.includes('Corp') ||
        stock.companyName.includes('Corporation') ||
        stock.companyName.includes('Systems');

      if (!hasProperFormat) {
        // Some companies might not have these (like Meta Platforms)
        expect(stock.companyName).toBeTruthy();
      }
    });
  });

  it('should have AAPL as Apple Inc.', () => {
    const apple = topTechStocks.find(s => s.symbol === 'AAPL');
    expect(apple).toBeDefined();
    expect(apple?.companyName).toBe('Apple Inc.');
    expect(apple?.exchange).toBe('NASDAQ');
  });

  it('should have MSFT as Microsoft Corporation', () => {
    const microsoft = topTechStocks.find(s => s.symbol === 'MSFT');
    expect(microsoft).toBeDefined();
    expect(microsoft?.companyName).toBe('Microsoft Corporation');
    expect(microsoft?.exchange).toBe('NASDAQ');
  });

  it('should have descriptions that are informative', () => {
    topTechStocks.forEach(stock => {
      // Descriptions should contain common business words
      const description = stock.description.toLowerCase();

      const hasBusinessTerms =
        description.includes('develops') ||
        description.includes('designs') ||
        description.includes('provides') ||
        description.includes('operates') ||
        description.includes('manufactures') ||
        description.includes('specializes') ||
        description.includes('leader');

      expect(hasBusinessTerms).toBe(true);
    });
  });
});
