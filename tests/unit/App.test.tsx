import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../../src/App';

describe('App Component', () => {
  it('should render the stock grid', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /top tech stocks dashboard/i })).toBeInTheDocument();
  });

  it('should render stock cards', () => {
    render(<App />);

    expect(screen.getByText('AAPL')).toBeInTheDocument();
    expect(screen.getByText('MSFT')).toBeInTheDocument();
    expect(screen.getByText('GOOGL')).toBeInTheDocument();
  });

  it('should open modal when stock card is clicked', () => {
    render(<App />);

    // Modal should not be visible initially
    expect(screen.queryByText('Company Overview')).not.toBeInTheDocument();

    // Click on a stock card
    const appleCard = screen.getByText('AAPL').closest('div[class*="cursor-pointer"]');

    if (appleCard) {
      fireEvent.click(appleCard);

      // Modal should now be visible
      expect(screen.getByText('Company Overview')).toBeInTheDocument();
    }
  });

  it('should close modal when close button is clicked', () => {
    render(<App />);

    // Open modal
    const appleCard = screen.getByText('AAPL').closest('div[class*="cursor-pointer"]');
    if (appleCard) {
      fireEvent.click(appleCard);
    }

    expect(screen.getByText('Company Overview')).toBeInTheDocument();

    // Close modal
    const closeButton = screen.getByRole('button', { name: /close modal/i });
    fireEvent.click(closeButton);

    // Modal should be closed
    expect(screen.queryByText('Company Overview')).not.toBeInTheDocument();
  });

  it('should display gradient background', () => {
    render(<App />);

    const mainDiv = document.querySelector('.min-h-screen');
    expect(mainDiv).toHaveClass('bg-gradient-to-br');
  });

  it('should handle state changes correctly', () => {
    render(<App />);

    // Initially no modal
    expect(screen.queryByText('Company Overview')).not.toBeInTheDocument();

    // Open AAPL modal
    const appleCard = screen.getByText('AAPL').closest('div[class*="cursor-pointer"]');
    if (appleCard) {
      fireEvent.click(appleCard);
    }

    // Get all instances of Apple Inc. and verify modal is open
    const appleCompanyText = screen.getAllByText(/Apple Inc\./);
    expect(appleCompanyText.length).toBeGreaterThan(1); // One in card, one in modal

    // Close modal
    const closeButton = screen.getByRole('button', { name: /close modal/i });
    fireEvent.click(closeButton);

    // Open MSFT modal
    const msftCard = screen.getByText('MSFT').closest('div[class*="cursor-pointer"]');
    if (msftCard) {
      fireEvent.click(msftCard);
    }

    // Verify MSFT modal is open
    const msftCompanyText = screen.getAllByText(/Microsoft Corporation/);
    expect(msftCompanyText.length).toBeGreaterThan(1);
  });

  it('should pass all 16 stocks to StockGrid', () => {
    render(<App />);

    // Check that all expected stocks are rendered
    const expectedSymbols = [
      'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'NVDA', 'TSLA', 'AVGO',
      'ORCL', 'AMD', 'CRM', 'ADBE', 'NFLX', 'CSCO', 'INTC', 'QCOM'
    ];

    expectedSymbols.forEach(symbol => {
      expect(screen.getByText(symbol)).toBeInTheDocument();
    });
  });
});
