import { useState, useEffect } from 'react';
import { Stock } from '../types/stock';
import StockCard from './StockCard';
import { fetchStockPerformance, formatPercentage, getPercentageColor, StockPerformance } from '../utils/stockData';

interface StockGridProps {
  stocks: Stock[];
  onStockClick: (stock: Stock) => void;
}

interface StockWithPerformance {
  stock: Stock;
  performance: StockPerformance | null;
}

export default function StockGrid({ stocks, onStockClick }: StockGridProps) {
  const [stocksWithPerformance, setStocksWithPerformance] = useState<StockWithPerformance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllPerformance = async () => {
      setLoading(true);
      const results = await Promise.all(
        stocks.map(async (stock) => ({
          stock,
          performance: await fetchStockPerformance(stock.symbol),
        }))
      );
      setStocksWithPerformance(results);
      setLoading(false);
    };

    fetchAllPerformance();
  }, [stocks]);

  // Sort by 1D performance (ascending - worst to best)
  const sortedBy1D = [...stocksWithPerformance]
    .filter(s => s.performance !== null)
    .sort((a, b) => (a.performance?.day || 0) - (b.performance?.day || 0));

  // Sort by 1W performance (ascending - worst to best)
  const sortedBy1W = [...stocksWithPerformance]
    .filter(s => s.performance !== null)
    .sort((a, b) => (a.performance?.week || 0) - (b.performance?.week || 0));

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-5xl md:text-6xl font-bold gradient-text tracking-tight">
          Top Tech Stocks - covering Mag 7
        </h1>
      </div>

      {/* Three-panel layout */}
      <div className="flex gap-6 max-w-[1920px] mx-auto">
        {/* Left Panel - 1D Performance - Hidden on small/medium screens */}
        <div className="hidden xl:block w-64 flex-shrink-0">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 border border-slate-700/50 sticky top-4">
            <h2 className="text-lg font-bold text-white mb-4">1D Performance</h2>
            {loading ? (
              <div className="space-y-2">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="h-12 bg-slate-700 rounded loading-shimmer"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {sortedBy1D.map(({ stock, performance }) => (
                  <div
                    key={stock.symbol}
                    className="flex items-center justify-between p-2 bg-slate-900/50 rounded hover:bg-slate-800 transition-colors cursor-pointer"
                    onClick={() => onStockClick(stock)}
                  >
                    <span className="font-bold text-white text-sm">{stock.symbol}</span>
                    <span className={`text-sm font-bold ${getPercentageColor(performance?.day || 0)}`}>
                      {formatPercentage(performance?.day || 0)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center - Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stocks.map((stock) => (
              <StockCard
                key={stock.symbol}
                stock={stock}
                onClick={() => onStockClick(stock)}
              />
            ))}
          </div>
        </div>

        {/* Right Panel - 1W Performance - Hidden on small/medium/large screens */}
        <div className="hidden 2xl:block w-64 flex-shrink-0">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 border border-slate-700/50 sticky top-4">
            <h2 className="text-lg font-bold text-white mb-4">1W Performance</h2>
            {loading ? (
              <div className="space-y-2">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="h-12 bg-slate-700 rounded loading-shimmer"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {sortedBy1W.map(({ stock, performance }) => (
                  <div
                    key={stock.symbol}
                    className="flex items-center justify-between p-2 bg-slate-900/50 rounded hover:bg-slate-800 transition-colors cursor-pointer"
                    onClick={() => onStockClick(stock)}
                  >
                    <span className="font-bold text-white text-sm">{stock.symbol}</span>
                    <span className={`text-sm font-bold ${getPercentageColor(performance?.week || 0)}`}>
                      {formatPercentage(performance?.week || 0)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-slate-500 text-sm">
        <p>
          For educational and informational purposes only. Not financial advice. Do your own research before making investment decisions.
        </p>
      </div>
    </div>
  );
}
