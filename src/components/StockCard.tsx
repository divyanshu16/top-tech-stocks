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
      {/* Header */}
      <div className="p-4 bg-slate-900 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white">{stock.symbol}</h3>
            <p className="text-sm text-slate-400 truncate">{stock.companyName}</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">
              {stock.exchange}
            </span>
          </div>
        </div>
      </div>

      {/* Chart - showing 1D, 1W, 1M fluctuations via TradingView */}
      <div className="bg-slate-900">
        <TradingViewChart
          symbol={stock.symbol}
          exchange={stock.exchange}
          type="mini"
          height={250}
        />
      </div>

      {/* Performance metrics */}
      <div className="px-4 py-3 bg-slate-800 border-t border-slate-700">
        {loading ? (
          <div className="flex justify-center gap-6 text-xs">
            <div className="flex flex-col items-center">
              <span className="text-slate-500 mb-1">1D</span>
              <span className="text-slate-600">...</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-slate-500 mb-1">1W</span>
              <span className="text-slate-600">...</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-slate-500 mb-1">1M</span>
              <span className="text-slate-600">...</span>
            </div>
          </div>
        ) : performance ? (
          <div className="flex justify-center gap-6 text-xs">
            <div className="flex flex-col items-center">
              <span className="text-slate-500 mb-1">1D</span>
              <span className={`font-semibold ${getPercentageColor(performance.day)}`}>
                {formatPercentage(performance.day)}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-slate-500 mb-1">1W</span>
              <span className={`font-semibold ${getPercentageColor(performance.week)}`}>
                {formatPercentage(performance.week)}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-slate-500 mb-1">1M</span>
              <span className={`font-semibold ${getPercentageColor(performance.month)}`}>
                {formatPercentage(performance.month)}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center text-xs text-slate-600">
            Data unavailable
          </div>
        )}
      </div>
    </div>
  );
}
