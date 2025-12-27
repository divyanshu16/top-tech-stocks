export interface StockPerformance {
  symbol: string;
  day: number;      // 1-day % change
  week: number;     // 1-week % change
  month: number;    // 1-month % change
}

export interface StockMetrics {
  symbol: string;
  currentPrice: number;
  dayHigh: number;
  dayLow: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  marketCap: number;
  peRatio: number | null;
  eps: number | null;
  volume: number;
  avgVolume: number;
  dividendYield: number | null;
  ytdChange: number;
  oneYearChange: number;
  beta: number | null;
}

export async function fetchStockPerformance(symbol: string): Promise<StockPerformance | null> {
  // Return mock data to avoid CORS issues with Yahoo Finance API
  // To enable real data, use a backend proxy or alternative API with CORS support
  return {
    symbol,
    day: Math.random() * 10 - 5,
    week: Math.random() * 15 - 7.5,
    month: Math.random() * 20 - 10,
  };
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

// Fetch detailed stock metrics
export async function fetchStockMetrics(symbol: string): Promise<StockMetrics | null> {
  // Return mock data to avoid CORS issues with Yahoo Finance API
  // To enable real data, use a backend proxy or alternative API with CORS support

  // Generate mock realistic data for demo purposes
  const basePrice = 100 + Math.random() * 300;
  const dayVolatility = basePrice * 0.02;
  const yearVolatility = basePrice * 0.3;

  return {
    symbol,
    currentPrice: basePrice,
    dayHigh: basePrice + dayVolatility * Math.random(),
    dayLow: basePrice - dayVolatility * Math.random(),
    fiftyTwoWeekHigh: basePrice + yearVolatility * Math.random(),
    fiftyTwoWeekLow: basePrice - yearVolatility * Math.random(),
    marketCap: (Math.random() * 2000 + 500) * 1e9, // 500B - 2.5T
    peRatio: Math.random() * 50 + 10,
    eps: basePrice / (Math.random() * 50 + 10),
    volume: Math.random() * 100e6 + 10e6,
    avgVolume: Math.random() * 80e6 + 15e6,
    dividendYield: Math.random() < 0.5 ? Math.random() * 3 : null,
    ytdChange: Math.random() * 60 - 20,
    oneYearChange: Math.random() * 80 - 30,
    beta: Math.random() * 2 + 0.5,
  };
}

// Format large numbers (market cap, volume)
export function formatLargeNumber(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
}

// Format volume
export function formatVolume(value: number): string {
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
  return value.toFixed(0);
}

// Format currency
export function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`;
}
