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

    // Use the standard widget for both mini and advanced
    const config: any = {
      container_id: containerRef.current.id,
      symbol: fullSymbol,
      interval: 'D',
      timezone: 'America/New_York',
      theme: 'dark',
      style: '1',
      locale: 'en',
      enable_publishing: false,
      allow_symbol_change: false,
      save_image: false,
      width: '100%',
      height: height,
    };

    if (type === 'mini') {
      // Simplified settings for mini cards
      config.hide_top_toolbar = true;
      config.hide_legend = true;
      config.hide_side_toolbar = true;
      config.toolbar_bg = '#0f172a';
      config.withdateranges = false;
    } else {
      // Full settings for modal
      config.toolbar_bg = '#1e293b';
      config.hide_side_toolbar = false;
      config.studies = ['MASimple@tv-basicstudies'];
    }

    try {
      widgetRef.current = new window.TradingView.widget(config);
    } catch (error) {
      console.error('TradingView widget error:', error);
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
