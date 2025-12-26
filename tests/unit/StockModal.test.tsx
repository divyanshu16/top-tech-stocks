import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import StockModal from '../../src/components/StockModal';
import { Stock } from '../../src/types/stock';

describe('StockModal Component', () => {
  const mockStock: Stock = {
    symbol: 'AAPL',
    companyName: 'Apple Inc.',
    exchange: 'NASDAQ',
    sector: 'Consumer Electronics',
    description: 'Apple designs, manufactures, and markets smartphones, personal computers, and wearables.',
  };

  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('should not render when stock is null', () => {
    const { container } = render(<StockModal stock={null} onClose={mockOnClose} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render when stock is provided', () => {
    render(<StockModal stock={mockStock} onClose={mockOnClose} />);

    expect(screen.getByText('AAPL')).toBeInTheDocument();
    expect(screen.getByText('Apple Inc.')).toBeInTheDocument();
  });

  it('should display company overview section', () => {
    render(<StockModal stock={mockStock} onClose={mockOnClose} />);

    expect(screen.getByText('Company Overview')).toBeInTheDocument();
  });

  it('should display stock description', () => {
    render(<StockModal stock={mockStock} onClose={mockOnClose} />);

    expect(screen.getByText(/designs, manufactures, and markets smartphones/i)).toBeInTheDocument();
  });

  it('should display sector information', () => {
    render(<StockModal stock={mockStock} onClose={mockOnClose} />);

    expect(screen.getByText('Sector')).toBeInTheDocument();
    expect(screen.getByText('Consumer Electronics')).toBeInTheDocument();
  });

  it('should display exchange information', () => {
    render(<StockModal stock={mockStock} onClose={mockOnClose} />);

    expect(screen.getByText('Exchange')).toBeInTheDocument();
    const exchanges = screen.getAllByText('NASDAQ');
    expect(exchanges.length).toBeGreaterThan(0);
  });

  it('should display disclaimer', () => {
    render(<StockModal stock={mockStock} onClose={mockOnClose} />);

    expect(screen.getByText(/disclaimer/i)).toBeInTheDocument();
    expect(screen.getByText(/educational purposes only/i)).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    render(<StockModal stock={mockStock} onClose={mockOnClose} />);

    const closeButton = screen.getByRole('button', { name: /close modal/i });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when backdrop is clicked', () => {
    render(<StockModal stock={mockStock} onClose={mockOnClose} />);

    const backdrop = screen.getByText('AAPL').closest('div[class*="fixed"]');

    if (backdrop) {
      fireEvent.click(backdrop);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    }
  });

  it('should not close when modal content is clicked', () => {
    render(<StockModal stock={mockStock} onClose={mockOnClose} />);

    const modalContent = screen.getByText('Company Overview');
    fireEvent.click(modalContent);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should render TradingView chart container', () => {
    render(<StockModal stock={mockStock} onClose={mockOnClose} />);

    const chartContainer = document.querySelector('div[id*="tradingview"]');
    expect(chartContainer).toBeInTheDocument();
  });

  it('should have close button with proper aria-label', () => {
    render(<StockModal stock={mockStock} onClose={mockOnClose} />);

    const closeButton = screen.getByRole('button', { name: /close modal/i });
    expect(closeButton).toHaveAttribute('aria-label');
  });

  it('should apply dark theme styling', () => {
    render(<StockModal stock={mockStock} onClose={mockOnClose} />);

    const modalContent = screen.getByText('Company Overview').closest('div[class*="bg-slate"]');
    expect(modalContent).toHaveClass('bg-slate-800');
  });

  it('should render different stocks correctly', () => {
    const msftStock: Stock = {
      symbol: 'MSFT',
      companyName: 'Microsoft Corporation',
      exchange: 'NASDAQ',
      sector: 'Software & Cloud',
      description: 'Microsoft develops software and services.',
    };

    const { rerender } = render(<StockModal stock={mockStock} onClose={mockOnClose} />);
    expect(screen.getByText('Apple Inc.')).toBeInTheDocument();

    rerender(<StockModal stock={msftStock} onClose={mockOnClose} />);
    expect(screen.getByText('Microsoft Corporation')).toBeInTheDocument();
    expect(screen.getByText('Software & Cloud')).toBeInTheDocument();
  });

  it('should have scrollable content area', () => {
    render(<StockModal stock={mockStock} onClose={mockOnClose} />);

    const scrollableArea = document.querySelector('[class*="overflow-y-auto"]');
    expect(scrollableArea).toBeInTheDocument();
  });

  it('should render SVG close icon', () => {
    render(<StockModal stock={mockStock} onClose={mockOnClose} />);

    const closeButton = screen.getByRole('button', { name: /close modal/i });
    const svg = closeButton.querySelector('svg');

    expect(svg).toBeInTheDocument();
  });
});
