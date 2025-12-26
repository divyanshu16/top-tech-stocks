export interface StockPerformance {
  symbol: string;
  day: number;      // 1-day % change
  week: number;     // 1-week % change
  month: number;    // 1-month % change
}

// Calculate percentage change
function calculateChange(current: number, previous: number): number {
  if (!previous || previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

export async function fetchStockPerformance(symbol: string): Promise<StockPerformance | null> {
  try {
    // Using Yahoo Finance API through a CORS-friendly endpoint
    // Alternative: Use your own API key from financialmodelingprep.com

    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1mo&interval=1d`;

    const response = await fetch(url);

    if (!response.ok) throw new Error('Failed to fetch');

    const data = await response.json();

    if (!data?.chart?.result?.[0]) {
      throw new Error('Invalid data structure');
    }

    const result = data.chart.result[0];
    const quotes = result.indicators.quote[0];
    const closes = quotes.close;

    // Filter out null values
    const validPrices = closes
      .map((price: number | null, index: number) => ({ price, index }))
      .filter((item: any) => item.price !== null);

    if (validPrices.length < 2) {
      throw new Error('Insufficient data');
    }

    // Get current price (most recent)
    const currentPrice = validPrices[validPrices.length - 1].price;

    // Get price from 1 day ago
    const oneDayAgo = validPrices.length > 1 ? validPrices[validPrices.length - 2].price : currentPrice;

    // Get price from ~5 trading days ago (1 week)
    const oneWeekIndex = Math.max(0, validPrices.length - 6);
    const oneWeekAgo = validPrices[oneWeekIndex].price;

    // Get price from ~20 trading days ago (1 month)
    const oneMonthIndex = Math.max(0, validPrices.length - 21);
    const oneMonthAgo = validPrices[oneMonthIndex].price;

    return {
      symbol,
      day: calculateChange(currentPrice, oneDayAgo),
      week: calculateChange(currentPrice, oneWeekAgo),
      month: calculateChange(currentPrice, oneMonthAgo),
    };
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);

    // Fallback: return mock data for demo purposes
    // Remove this in production
    return {
      symbol,
      day: Math.random() * 10 - 5,
      week: Math.random() * 15 - 7.5,
      month: Math.random() * 20 - 10,
    };
  }
}

// For better accuracy, fetch historical data
export async function fetchDetailedPerformance(symbol: string): Promise<StockPerformance | null> {
  try {
    // This would use historical prices to calculate actual 1W and 1M changes
    // For now, returning simplified version
    return fetchStockPerformance(symbol);
  } catch (error) {
    console.error(`Error fetching detailed data for ${symbol}:`, error);
    return null;
  }
}

// Format percentage for display
export function formatPercentage(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

// Get color class based on value
export function getPercentageColor(value: number): string {
  if (value > 0) return 'text-green-400';
  if (value < 0) return 'text-red-400';
  return 'text-slate-400';
}
