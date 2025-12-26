import { useState } from 'react';
import { Stock } from './types/stock';
import { topTechStocks } from './data/topTechStocks';
import StockGrid from './components/StockGrid';
import StockModal from './components/StockModal';

function App() {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

  const handleStockClick = (stock: Stock) => {
    setSelectedStock(stock);
  };

  const handleCloseModal = () => {
    setSelectedStock(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <StockGrid stocks={topTechStocks} onStockClick={handleStockClick} />
      <StockModal stock={selectedStock} onClose={handleCloseModal} />
    </div>
  );
}

export default App;
