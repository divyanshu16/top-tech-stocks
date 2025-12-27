interface TradingViewChartProps {
  symbol: string;
  exchange: string;
  type?: 'mini' | 'advanced';
  height?: number;
}

export default function TradingViewChart({
  symbol,
  exchange,
  height = 300
}: TradingViewChartProps) {
  // TradingView widget disabled to avoid CORS issues
  // To enable, add the TradingView script to index.html:
  // <script type="text/javascript" src="https://s3.tradingview.com/tv.js"></script>

  return (
    <div
      className="w-full flex items-center justify-center bg-slate-800 rounded-lg border border-slate-700"
      style={{ height: `${height}px` }}
    >
      <div className="text-center p-6">
        <svg
          className="w-16 h-16 mx-auto mb-4 text-slate-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        <p className="text-slate-400 text-sm">
          Chart unavailable
        </p>
        <p className="text-slate-500 text-xs mt-2">
          {exchange}:{symbol}
        </p>
      </div>
    </div>
  );
}
