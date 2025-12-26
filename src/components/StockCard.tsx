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
      className="bg-slate-800 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20 border border-slate-700 hover:border-blue-500"
    >
      {/* Header with stock info and performance */}
      <div className="p-4 bg-slate-900">
        <div className="flex items-start justify-between gap-4">
          {/* Left: Stock info */}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-500 mb-1">{stock.exchange}</p>
            <h3 className="text-2xl font-bold text-white mb-1">{stock.symbol}</h3>
            <p className="text-sm text-slate-400 truncate">{stock.companyName}</p>
          </div>

          {/* Right: Performance metrics */}
          <div className="flex gap-3 text-xs">
            {loading ? (
              <>
                <div className="flex flex-col items-center min-w-[3rem]">
                  <span className="text-slate-500 mb-1">1D</span>
                  <span className="text-slate-600">...</span>
                </div>
                <div className="flex flex-col items-center min-w-[3rem]">
                  <span className="text-slate-500 mb-1">1W</span>
                  <span className="text-slate-600">...</span>
                </div>
                <div className="flex flex-col items-center min-w-[3rem]">
                  <span className="text-slate-500 mb-1">1M</span>
                  <span className="text-slate-600">...</span>
                </div>
              </>
            ) : performance ? (
              <>
                <div className="flex flex-col items-center min-w-[3rem]">
                  <span className="text-slate-500 mb-1">1D</span>
                  <span className={`font-semibold ${getPercentageColor(performance.day)}`}>
                    {formatPercentage(performance.day)}
                  </span>
                </div>
                <div className="flex flex-col items-center min-w-[3rem]">
                  <span className="text-slate-500 mb-1">1W</span>
                  <span className={`font-semibold ${getPercentageColor(performance.week)}`}>
                    {formatPercentage(performance.week)}
                  </span>
                </div>
                <div className="flex flex-col items-center min-w-[3rem]">
                  <span className="text-slate-500 mb-1">1M</span>
                  <span className={`font-semibold ${getPercentageColor(performance.month)}`}>
                    {formatPercentage(performance.month)}
                  </span>
                </div>
              </>
            ) : (
              <div className="text-slate-600 text-xs">N/A</div>
            )}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-slate-900">
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
