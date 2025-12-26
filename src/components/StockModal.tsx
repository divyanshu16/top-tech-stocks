import { useEffect } from 'react';
import { Stock } from '../types/stock';
import TradingViewChart from './TradingViewChart';

interface StockModalProps {
  stock: Stock | null;
  onClose: () => void;
}

export default function StockModal({ stock, onClose }: StockModalProps) {
  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (stock) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [stock]);

  if (!stock) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-700 animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              {stock.symbol}
              <span className="text-sm font-normal text-slate-400 bg-slate-700 px-3 py-1 rounded">
                {stock.exchange}
              </span>
            </h2>
            <p className="text-slate-300 mt-1">{stock.companyName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-700 rounded-lg"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Chart */}
          <div className="p-6 bg-slate-900">
            <TradingViewChart
              symbol={stock.symbol}
              exchange={stock.exchange}
              type="advanced"
              height={500}
            />
          </div>

          {/* Stock Info */}
          <div className="p-6 bg-slate-800 border-t border-slate-700">
            <h3 className="text-xl font-semibold text-white mb-4">Company Overview</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Description */}
              <div className="col-span-2">
                <h4 className="text-sm font-medium text-slate-400 mb-2">About</h4>
                <p className="text-slate-300 leading-relaxed">{stock.description}</p>
              </div>

              {/* Sector */}
              <div>
                <h4 className="text-sm font-medium text-slate-400 mb-2">Sector</h4>
                <p className="text-white font-medium bg-slate-700 px-4 py-2 rounded inline-block">
                  {stock.sector}
                </p>
              </div>

              {/* Exchange */}
              <div>
                <h4 className="text-sm font-medium text-slate-400 mb-2">Exchange</h4>
                <p className="text-white font-medium bg-slate-700 px-4 py-2 rounded inline-block">
                  {stock.exchange}
                </p>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-6 p-4 bg-slate-900 rounded-lg border border-slate-700">
              <p className="text-xs text-slate-500">
                <strong className="text-slate-400">Disclaimer:</strong> This information is for educational purposes only.
                Real-time market data provided by TradingView. Always conduct your own research before making investment decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
