import { Stock } from '../types/stock';
import TradingViewChart from './TradingViewChart';

interface StockCardProps {
  stock: Stock;
  onClick: () => void;
}

export default function StockCard({ stock, onClick }: StockCardProps) {
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

      {/* Time period indicators */}
      <div className="px-4 py-2 bg-slate-800 border-t border-slate-700">
        <div className="flex justify-center gap-4 text-xs text-slate-500">
          <span className="hover:text-blue-400 cursor-pointer">1D</span>
          <span className="hover:text-blue-400 cursor-pointer">1W</span>
          <span className="hover:text-blue-400 cursor-pointer">1M</span>
        </div>
      </div>
    </div>
  );
}
