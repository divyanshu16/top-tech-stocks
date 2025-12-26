# 📊 Top Tech Stocks Dashboard

A modern, real-time dashboard for comparing top US technology stocks at a glance. Built with React, TypeScript, and TradingView integration.

## ✨ Features

- **All-in-One View**: See 16 top tech stocks simultaneously
- **Real-Time Charts**: TradingView integration for live market data
- **Quick Comparison**: No need to manually add stocks - they're all pre-loaded
- **Detailed Views**: Click any stock card for comprehensive information
- **100% Client-Side**: No backend required, all processing happens in the browser
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile

## 🚀 Tech Stack

- **React 18** - Modern UI framework
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **TradingView Widgets** - Real-time market data

## 📈 Included Stocks

- **AAPL** - Apple Inc.
- **MSFT** - Microsoft Corporation
- **GOOGL** - Alphabet Inc.
- **AMZN** - Amazon.com Inc.
- **META** - Meta Platforms Inc.
- **NVDA** - NVIDIA Corporation
- **TSLA** - Tesla Inc.
- **AVGO** - Broadcom Inc.
- **ORCL** - Oracle Corporation
- **AMD** - Advanced Micro Devices
- **CRM** - Salesforce Inc.
- **ADBE** - Adobe Inc.
- **NFLX** - Netflix Inc.
- **CSCO** - Cisco Systems Inc.
- **INTC** - Intel Corporation
- **QCOM** - QUALCOMM Inc.

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📖 Usage

1. **Browse Stocks**: Scroll through the grid to see all stocks at once
2. **Compare Performance**: Visually compare charts side-by-side
3. **View Details**: Click any stock card for detailed information
4. **Close Modal**: Press ESC or click outside to return to grid view

## 🎨 Features Breakdown

### Stock Cards
- Company name and ticker symbol
- Mini TradingView chart (12-month view)
- Sector information
- Hover effects for better UX

### Detailed Modal
- Full-size TradingView chart with indicators
- Company description
- Sector and exchange information
- Smooth animations

### Responsive Grid
- **Desktop (>1280px)**: 4 columns
- **Tablet (768px-1279px)**: 3 columns
- **Mobile (<768px)**: 1-2 columns

## 🌟 Why This Dashboard?

Traditional stock portals require manually adding each stock to compare performance. This dashboard solves that problem by:

1. Pre-loading all major tech stocks
2. Displaying them simultaneously
3. Providing instant access to detailed views
4. Offering real-time data without API keys

## 🔧 Customization

To add or modify stocks, edit `src/data/topTechStocks.ts`:

```typescript
export const topTechStocks: Stock[] = [
  {
    symbol: 'YOUR_SYMBOL',
    companyName: 'Your Company Name',
    exchange: 'NASDAQ',
    sector: 'Your Sector',
    description: 'Company description...',
  },
  // ... more stocks
];
```

## 🧪 Testing

This project includes comprehensive test coverage with 137+ tests:

- **57 Unit Tests** (Vitest + React Testing Library)
- **80+ E2E Tests** (Playwright)
- **Accessibility Tests** (WCAG 2.1 Level AA)
- **Responsive Design Tests** (Mobile, Tablet, Desktop)

```bash
# Run unit tests
npm run test

# Run E2E tests (requires: npx playwright install)
npm run test:e2e

# Run all tests
npm run test:all

# Run tests with coverage
npm run test:coverage
```

See [TESTING.md](./TESTING.md) for detailed testing documentation.

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- Market data powered by [TradingView](https://www.tradingview.com/)
- Built with [Vite](https://vitejs.dev/) and [React](https://react.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

## ⚠️ Disclaimer

This dashboard is for educational and informational purposes only. Always conduct your own research and consult with financial advisors before making investment decisions.

---

Made with ❤️ for smarter stock comparison
