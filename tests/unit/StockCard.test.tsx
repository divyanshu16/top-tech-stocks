import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import StockCard from '../../src/components/StockCard';
import { Stock } from '../../src/types/stock';

describe('StockCard Component', () => {
  const mockStock: Stock = {
    symbol: 'AAPL',
    companyName: 'Apple Inc.',
    exchange: 'NASDAQ',
    sector: 'Consumer Electronics',
    description: 'Apple designs, manufactures, and markets smartphones.',
  };

  const mockOnClick = vi.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it('should render stock symbol', () => {
    render(<StockCard stock={mockStock} onClick={mockOnClick} />);
    expect(screen.getByText('AAPL')).toBeInTheDocument();
  });

  it('should render company name', () => {
    render(<StockCard stock={mockStock} onClick={mockOnClick} />);
    expect(screen.getByText('Apple Inc.')).toBeInTheDocument();
  });

  it('should render exchange badge', () => {
    render(<StockCard stock={mockStock} onClick={mockOnClick} />);
    expect(screen.getByText('NASDAQ')).toBeInTheDocument();
  });

  it('should render sector information', () => {
    render(<StockCard stock={mockStock} onClick={mockOnClick} />);
    expect(screen.getByText('Consumer Electronics')).toBeInTheDocument();
  });

  it('should call onClick when card is clicked', () => {
    render(<StockCard stock={mockStock} onClick={mockOnClick} />);

    const card = screen.getByText('AAPL').closest('div[class*="cursor-pointer"]');
    expect(card).toBeInTheDocument();

    if (card) {
      fireEvent.click(card);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    }
  });

  it('should have cursor-pointer class for clickability', () => {
    render(<StockCard stock={mockStock} onClick={mockOnClick} />);

    const card = screen.getByText('AAPL').closest('div[class*="cursor-pointer"]');
    expect(card).toHaveClass('cursor-pointer');
  });

  it('should render TradingViewChart component', () => {
    render(<StockCard stock={mockStock} onClick={mockOnClick} />);

    // TradingViewChart creates a div with id containing 'tradingview'
    const chartContainer = document.querySelector('div[id*="tradingview"]');
    expect(chartContainer).toBeInTheDocument();
  });

  it('should apply correct styling classes', () => {
    render(<StockCard stock={mockStock} onClick={mockOnClick} />);

    const card = screen.getByText('AAPL').closest('div[class*="cursor-pointer"]');

    expect(card).toHaveClass('bg-slate-800');
    expect(card).toHaveClass('rounded-lg');
    expect(card).toHaveClass('border');
  });

  it('should truncate long company names', () => {
    const longNameStock: Stock = {
      ...mockStock,
      companyName: 'Very Long Company Name That Should Be Truncated',
    };

    render(<StockCard stock={longNameStock} onClick={mockOnClick} />);

    const companyName = screen.getByText('Very Long Company Name That Should Be Truncated');

    // The company name itself should have the truncate class
    expect(companyName).toHaveClass('truncate');
  });

  it('should render different stocks correctly', () => {
    const msftStock: Stock = {
      symbol: 'MSFT',
      companyName: 'Microsoft Corporation',
      exchange: 'NASDAQ',
      sector: 'Software & Cloud',
      description: 'Microsoft develops software and services.',
    };

    const { rerender } = render(<StockCard stock={mockStock} onClick={mockOnClick} />);
    expect(screen.getByText('AAPL')).toBeInTheDocument();

    rerender(<StockCard stock={msftStock} onClick={mockOnClick} />);
    expect(screen.getByText('MSFT')).toBeInTheDocument();
    expect(screen.getByText('Microsoft Corporation')).toBeInTheDocument();
  });
});
