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
          <div>
            <h3 className="text-xl font-bold text-white">{stock.symbol}</h3>
            <p className="text-sm text-slate-400 truncate">{stock.companyName}</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">
              {stock.exchange}
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-slate-900">
        <TradingViewChart
          symbol={stock.symbol}
          exchange={stock.exchange}
          type="mini"
          height={200}
        />
      </div>

      {/* Footer */}
      <div className="p-3 bg-slate-800">
        <p className="text-xs text-slate-400">{stock.sector}</p>
      </div>
    </div>
  );
}
