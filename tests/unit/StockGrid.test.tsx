import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import StockGrid from '../../src/components/StockGrid';
import { Stock } from '../../src/types/stock';

describe('StockGrid Component', () => {
  const mockStocks: Stock[] = [
    {
      symbol: 'AAPL',
      companyName: 'Apple Inc.',
      exchange: 'NASDAQ',
      sector: 'Consumer Electronics',
      description: 'Apple designs smartphones.',
    },
    {
      symbol: 'MSFT',
      companyName: 'Microsoft Corporation',
      exchange: 'NASDAQ',
      sector: 'Software & Cloud',
      description: 'Microsoft develops software.',
    },
    {
      symbol: 'GOOGL',
      companyName: 'Alphabet Inc.',
      exchange: 'NASDAQ',
      sector: 'Internet & Search',
      description: 'Google provides search services.',
    },
  ];

  const mockOnStockClick = vi.fn();

  beforeEach(() => {
    mockOnStockClick.mockClear();
  });

  it('should render title heading', () => {
    render(<StockGrid stocks={mockStocks} onStockClick={mockOnStockClick} />);
    expect(screen.getByRole('heading', { name: /top tech stocks dashboard/i })).toBeInTheDocument();
  });

  it('should render subtitle with stock count', () => {
    render(<StockGrid stocks={mockStocks} onStockClick={mockOnStockClick} />);
    expect(screen.getByText(/compare 3 leading us technology stocks/i)).toBeInTheDocument();
  });

  it('should render all stock cards', () => {
    render(<StockGrid stocks={mockStocks} onStockClick={mockOnStockClick} />);

    expect(screen.getByText('AAPL')).toBeInTheDocument();
    expect(screen.getByText('MSFT')).toBeInTheDocument();
    expect(screen.getByText('GOOGL')).toBeInTheDocument();
  });

  it('should render footer with attribution', () => {
    render(<StockGrid stocks={mockStocks} onStockClick={mockOnStockClick} />);
    expect(screen.getByText(/real-time data powered by tradingview/i)).toBeInTheDocument();
  });

  it('should call onStockClick when a card is clicked', () => {
    render(<StockGrid stocks={mockStocks} onStockClick={mockOnStockClick} />);

    const appleCard = screen.getByText('AAPL').closest('div[class*="cursor-pointer"]');

    if (appleCard) {
      fireEvent.click(appleCard);
      expect(mockOnStockClick).toHaveBeenCalledWith(mockStocks[0]);
    }
  });

  it('should have grid layout classes', () => {
    render(<StockGrid stocks={mockStocks} onStockClick={mockOnStockClick} />);

    const grid = document.querySelector('.grid');
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveClass('grid-cols-1');
    expect(grid).toHaveClass('md:grid-cols-2');
    expect(grid).toHaveClass('lg:grid-cols-3');
    expect(grid).toHaveClass('xl:grid-cols-4');
  });

  it('should render container with proper spacing', () => {
    render(<StockGrid stocks={mockStocks} onStockClick={mockOnStockClick} />);

    const container = document.querySelector('.container');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('mx-auto');
  });

  it('should render with empty stock list', () => {
    render(<StockGrid stocks={[]} onStockClick={mockOnStockClick} />);

    expect(screen.getByText(/compare 0 leading us technology stocks/i)).toBeInTheDocument();

    // No cards should be rendered
    const cards = document.querySelectorAll('[class*="cursor-pointer"]');
    expect(cards.length).toBe(0);
  });

  it('should render with large stock list', () => {
    const largeStockList = Array.from({ length: 20 }, (_, i) => ({
      symbol: `SYM${i}`,
      companyName: `Company ${i}`,
      exchange: 'NASDAQ',
      sector: 'Technology',
      description: `Description ${i}`,
    }));

    render(<StockGrid stocks={largeStockList} onStockClick={mockOnStockClick} />);

    expect(screen.getByText(/compare 20 leading us technology stocks/i)).toBeInTheDocument();
    expect(screen.getByText('SYM0')).toBeInTheDocument();
    expect(screen.getByText('SYM19')).toBeInTheDocument();
  });

  it('should pass correct stock to onClick handler for each card', () => {
    render(<StockGrid stocks={mockStocks} onStockClick={mockOnStockClick} />);

    // Click on MSFT
    const msftCard = screen.getByText('MSFT').closest('div[class*="cursor-pointer"]');
    if (msftCard) {
      fireEvent.click(msftCard);
      expect(mockOnStockClick).toHaveBeenCalledWith(mockStocks[1]);
    }

    mockOnStockClick.mockClear();

    // Click on GOOGL
    const googlCard = screen.getByText('GOOGL').closest('div[class*="cursor-pointer"]');
    if (googlCard) {
      fireEvent.click(googlCard);
      expect(mockOnStockClick).toHaveBeenCalledWith(mockStocks[2]);
    }
  });
});
