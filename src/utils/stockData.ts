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

// Calculate percentage change
function calculateChange(current: number, previous: number): number {
  if (!previous || previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

export async function fetchStockPerformance(symbol: string): Promise<StockPerformance | null> {
  try {
    // Fetch 2 months of data to ensure we have enough for 1-month calculations
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=2mo&interval=1d`;

    const response = await fetch(url);

    if (!response.ok) throw new Error('Failed to fetch');

    const data = await response.json();

    if (!data?.chart?.result?.[0]) {
      throw new Error('Invalid data structure');
    }

    const result = data.chart.result[0];
    const timestamps = result.timestamp;
    const quotes = result.indicators.quote[0];
    const closes = quotes.close;

    // Create array of valid price points with timestamps
    const priceData = timestamps
      .map((timestamp: number, index: number) => ({
        timestamp: timestamp * 1000, // Convert to milliseconds
        price: closes[index],
      }))
      .filter((item: any) => item.price !== null && item.price !== undefined);

    if (priceData.length < 2) {
      throw new Error('Insufficient data');
    }

    // Get current price and timestamp (most recent)
    const currentData = priceData[priceData.length - 1];
    const currentPrice = currentData.price;
    const currentTime = currentData.timestamp;

    // Calculate target timestamps
    const oneDayAgoTime = currentTime - (24 * 60 * 60 * 1000); // 1 day in milliseconds
    const oneWeekAgoTime = currentTime - (7 * 24 * 60 * 60 * 1000); // 7 days in milliseconds
    const oneMonthAgoTime = currentTime - (30 * 24 * 60 * 60 * 1000); // 30 days in milliseconds

    // Find closest price to each target time
    const findClosestPrice = (targetTime: number): number => {
      let closestData = priceData[0];
      let minDiff = Math.abs(priceData[0].timestamp - targetTime);

      for (const data of priceData) {
        const diff = Math.abs(data.timestamp - targetTime);
        if (diff < minDiff) {
          minDiff = diff;
          closestData = data;
        }
        // If we've passed the target time, use the previous data point
        if (data.timestamp > targetTime) {
          break;
        }
      }

      return closestData.price;
    };

    const oneDayAgoPrice = findClosestPrice(oneDayAgoTime);
    const oneWeekAgoPrice = findClosestPrice(oneWeekAgoTime);
    const oneMonthAgoPrice = findClosestPrice(oneMonthAgoTime);

    return {
      symbol,
      day: calculateChange(currentPrice, oneDayAgoPrice),
      week: calculateChange(currentPrice, oneWeekAgoPrice),
      month: calculateChange(currentPrice, oneMonthAgoPrice),
    };
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);

    // Fallback: return null instead of mock data
    return null;
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

// Fetch detailed stock metrics
export async function fetchStockMetrics(symbol: string): Promise<StockMetrics | null> {
  try {
    // Fetch quote data from Yahoo Finance
    const quoteUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1y&interval=1d`;
    const response = await fetch(quoteUrl);

    if (!response.ok) throw new Error('Failed to fetch quote');

    const data = await response.json();
    const result = data?.chart?.result?.[0];

    if (!result) throw new Error('Invalid data structure');

    const meta = result.meta;
    const quotes = result.indicators.quote[0];
    const closes = quotes.close.filter((p: number | null) => p !== null);
    const highs = quotes.high.filter((p: number | null) => p !== null);
    const lows = quotes.low.filter((p: number | null) => p !== null);
    const volumes = quotes.volume.filter((p: number | null) => p !== null);

    // Current price
    const currentPrice = meta.regularMarketPrice || closes[closes.length - 1];

    // 52-week high/low
    const fiftyTwoWeekHigh = Math.max(...highs);
    const fiftyTwoWeekLow = Math.min(...lows);

    // Day range
    const dayHigh = meta.regularMarketDayHigh || highs[highs.length - 1];
    const dayLow = meta.regularMarketDayLow || lows[lows.length - 1];

    // Volume
    const volume = meta.regularMarketVolume || volumes[volumes.length - 1];
    const avgVolume = volumes.reduce((a: number, b: number) => a + b, 0) / volumes.length;

    // YTD and 1Y change
    const yearAgoPrice = closes[0];
    const oneYearChange = calculateChange(currentPrice, yearAgoPrice);

    // YTD - approximate based on available data
    const ytdIndex = Math.max(0, closes.length - 252); // ~252 trading days in a year
    const ytdStartPrice = closes[ytdIndex];
    const ytdChange = calculateChange(currentPrice, ytdStartPrice);

    return {
      symbol,
      currentPrice,
      dayHigh,
      dayLow,
      fiftyTwoWeekHigh,
      fiftyTwoWeekLow,
      marketCap: meta.marketCap || 0,
      peRatio: meta.trailingPE || null,
      eps: meta.epsTrailingTwelveMonths || null,
      volume,
      avgVolume,
      dividendYield: meta.dividendYield ? meta.dividendYield * 100 : null,
      ytdChange,
      oneYearChange,
      beta: meta.beta || null,
    };
  } catch (error) {
    console.error(`Error fetching metrics for ${symbol}:`, error);
    return null;
  }
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
