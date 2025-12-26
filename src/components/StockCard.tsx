import { useState, useEffect } from 'react';
import { Stock } from '../types/stock';
import TradingViewChart from './TradingViewChart';
import { fetchStockPerformance, formatPercentage, getPercentageColor, type StockPerformance } from '../utils/stockData';

interface StockCardProps {
  stock: Stock;
  onClick: () => void;
}

export default function StockCard({ stock, onClick }: StockCardProps) {
  const [performance, setPerformance] = useState<StockPerformance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadPerformance = async () => {
      const data = await fetchStockPerformance(stock.symbol);
      if (mounted) {
        setPerformance(data);
        setLoading(false);
      }
    };

    loadPerformance();

    return () => {
      mounted = false;
    };
  }, [stock.symbol]);

  return (
    <div
      onClick={onClick}
      className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/30 border border-slate-700/50 hover:border-blue-500/50 backdrop-blur-sm group"
    >
      {/* Header with stock info and performance */}
      <div className="p-4 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50 group-hover:bg-slate-900 transition-colors">
        <div className="flex items-start justify-between gap-4">
          {/* Left: Stock info */}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-500 mb-1 font-medium uppercase tracking-wide">{stock.exchange}</p>
            <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{stock.symbol}</h3>
            <p className="text-sm text-slate-400 truncate group-hover:text-slate-300 transition-colors">{stock.companyName}</p>
          </div>

          {/* Right: Performance metrics */}
          <div className="flex gap-3 text-xs">
            {loading ? (
              <>
                <div className="flex flex-col items-center min-w-[3rem]">
                  <span className="text-slate-500 mb-1 text-xs">1D</span>
                  <div className="w-12 h-4 bg-slate-700 rounded loading-shimmer"></div>
                </div>
                <div className="flex flex-col items-center min-w-[3rem]">
                  <span className="text-slate-500 mb-1 text-xs">1W</span>
                  <div className="w-12 h-4 bg-slate-700 rounded loading-shimmer"></div>
                </div>
                <div className="flex flex-col items-center min-w-[3rem]">
                  <span className="text-slate-500 mb-1 text-xs">1M</span>
                  <div className="w-12 h-4 bg-slate-700 rounded loading-shimmer"></div>
                </div>
              </>
            ) : performance ? (
              <>
                <div className="flex flex-col items-center min-w-[3rem]">
                  <span className="text-slate-500 mb-1 text-xs font-medium">1D</span>
                  <span className={`font-bold text-sm ${getPercentageColor(performance.day)} transition-all`}>
                    {formatPercentage(performance.day)}
                  </span>
                </div>
                <div className="flex flex-col items-center min-w-[3rem]">
                  <span className="text-slate-500 mb-1 text-xs font-medium">1W</span>
                  <span className={`font-bold text-sm ${getPercentageColor(performance.week)} transition-all`}>
                    {formatPercentage(performance.week)}
                  </span>
                </div>
                <div className="flex flex-col items-center min-w-[3rem]">
                  <span className="text-slate-500 mb-1 text-xs font-medium">1M</span>
                  <span className={`font-bold text-sm ${getPercentageColor(performance.month)} transition-all`}>
                    {formatPercentage(performance.month)}
                  </span>
                </div>
              </>
            ) : (
              <div className="text-slate-600 text-xs font-medium">N/A</div>
            )}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-slate-900/50 backdrop-blur-sm group-hover:bg-slate-900 transition-colors relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
        <TradingViewChart
          symbol={stock.symbol}
          exchange={stock.exchange}
          type="mini"
          height={250}
        />
      </div>
    </div>
  );
}
