import { useEffect, useRef } from 'react';

interface TradingViewChartProps {
  symbol: string;
  exchange: string;
  type?: 'mini' | 'advanced';
  height?: number;
}

declare global {
  interface Window {
    TradingView: any;
  }
}

export default function TradingViewChart({
  symbol,
  exchange,
  type = 'mini',
  height = 300
}: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current || !window.TradingView) return;

    // Clear previous widget
    if (widgetRef.current) {
      containerRef.current.innerHTML = '';
    }

    const fullSymbol = `${exchange}:${symbol}`;

    if (type === 'mini') {
      // Mini widget for cards
      widgetRef.current = new window.TradingView.MiniChart({
        container_id: containerRef.current.id,
        symbol: fullSymbol,
        locale: 'en',
        width: '100%',
        height: height,
        dateRange: '12M',
        colorTheme: 'dark',
        trendLineColor: 'rgba(41, 98, 255, 1)',
        underLineColor: 'rgba(41, 98, 255, 0.3)',
        isTransparent: true,
        autosize: true,
        largeChartUrl: '',
      });
    } else {
      // Advanced widget for modal
      widgetRef.current = new window.TradingView.widget({
        container_id: containerRef.current.id,
        symbol: fullSymbol,
        interval: 'D',
        timezone: 'America/New_York',
        theme: 'dark',
        style: '1',
        locale: 'en',
        toolbar_bg: '#1e293b',
        enable_publishing: false,
        hide_side_toolbar: false,
        allow_symbol_change: false,
        save_image: false,
        studies: ['MASimple@tv-basicstudies', 'RSI@tv-basicstudies'],
        show_popup_button: false,
        popup_width: '1000',
        popup_height: '650',
        width: '100%',
        height: height,
        backgroundColor: '#0f172a',
        gridColor: '#1e293b',
      });
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [symbol, exchange, type, height]);

  return (
    <div
      ref={containerRef}
      id={`tradingview-${type}-${symbol}-${Math.random().toString(36).substr(2, 9)}`}
      className="w-full"
      style={{ height: `${height}px` }}
    />
  );
}
