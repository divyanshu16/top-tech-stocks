import { Stock } from '../types/stock';
import StockCard from './StockCard';

interface StockGridProps {
  stocks: Stock[];
  onStockClick: (stock: Stock) => void;
}

export default function StockGrid({ stocks, onStockClick }: StockGridProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-4 tracking-tight">
          Top Tech Stocks Dashboard
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
          Compare {stocks.length} leading US technology stocks • Real-time data & insights
        </p>
        <div className="mt-6 flex justify-center gap-4 text-sm text-slate-500">
          <span className="px-3 py-1 bg-slate-800 rounded-full">Live Charts</span>
          <span className="px-3 py-1 bg-slate-800 rounded-full">1D / 1W / 1M</span>
          <span className="px-3 py-1 bg-slate-800 rounded-full">16 Stocks</span>
        </div>
      </div>

      {/* Grid - 3 columns max for better comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {stocks.map((stock) => (
          <StockCard
            key={stock.symbol}
            stock={stock}
            onClick={() => onStockClick(stock)}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-slate-500 text-sm">
        <p>
          Real-time data powered by TradingView • View 1D, 1W, 1M fluctuations • Click for detailed view
        </p>
      </div>
    </div>
  );
}
