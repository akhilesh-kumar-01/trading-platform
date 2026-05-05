import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useWebSocket } from '../hooks/useWebSocket';
import { formatPrice, formatChange } from '../lib/formatters';
import { Skeleton } from './ui/skeleton';

const AVAILABLE_SYMBOLS = [
  'BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'XRPUSDT', 
  'DOGEUSDT', 'ADAUSDT', 'AVAXUSDT', 'LINKUSDT', 'DOTUSDT',
  'MATICUSDT', 'LTCUSDT', 'SHIBUSDT', 'TRXUSDT', 'UNIUSDT'
];

const MarketSelector = () => {
  const { selectedSymbol, changeSymbol, tickers } = useWebSocket();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const filteredSymbols = useMemo(() => {
    return AVAILABLE_SYMBOLS.filter(symbol => 
      symbol.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="flex flex-col h-full bg-bg-base border-r border-border-dim select-none">
      {/* Search Bar */}
      <div className="p-2 border-b border-border-dim/50">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
          <input
            type="text"
            placeholder="Search markets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-bg-surface border border-border-dim rounded h-8 pl-8 pr-2 text-[12px] text-text-primary focus:outline-none focus:border-accent transition-colors"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center px-1 py-1 border-b border-border-dim/50 gap-1 overflow-x-auto no-scrollbar">
        {['All', 'USDT', 'Alt'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
              activeTab === tab ? 'bg-bg-elevated text-text-primary' : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Market List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="flex items-center px-3 h-8 text-[10px] font-bold text-text-muted uppercase tracking-wider sticky top-0 bg-bg-base z-10">
          <div className="flex-[1.5]">Market</div>
          <div className="flex-1 text-right">Price</div>
          <div className="flex-1 text-right">Change</div>
        </div>

        {Object.keys(tickers).length === 0 ? (
          Array(10).fill(0).map((_, i) => (
            <div key={i} className="flex items-center px-3 h-10 gap-2">
              <Skeleton className="flex-[1.5] h-4" />
              <Skeleton className="flex-1 h-4" />
              <Skeleton className="flex-1 h-4" />
            </div>
          ))
        ) : (
          filteredSymbols.map((symbol) => {
          const ticker = tickers[symbol] || {};
          const isSelected = selectedSymbol === symbol;
          const [base, quote] = symbol.includes('USDT') 
            ? [symbol.replace('USDT', ''), 'USDT']
            : [symbol, ''];

          return (
            <div
              key={symbol}
              onClick={() => changeSymbol(symbol)}
              className={`flex items-center px-3 h-10 cursor-pointer transition-colors border-l-2 ${
                isSelected 
                  ? 'bg-bg-elevated/50 border-accent' 
                  : 'border-transparent hover:bg-bg-elevated/30'
              }`}
            >
              <div className="flex-[1.5] flex flex-col justify-center overflow-hidden">
                <div className="flex items-center gap-1">
                  <span className={`text-[12px] font-bold ${isSelected ? 'text-accent' : 'text-text-primary'}`}>
                    {base}
                  </span>
                  <span className="text-[10px] text-text-muted">/{quote}</span>
                </div>
              </div>
              <div className="flex-1 text-right flex flex-col justify-center">
                <span className="text-[11px] font-mono font-medium text-text-primary">
                  {ticker.price ? formatPrice(ticker.price) : '---'}
                </span>
              </div>
              <div className="flex-1 text-right flex flex-col justify-center">
                <span className={`text-[11px] font-mono font-medium ${ticker.change24h >= 0 ? 'text-buy' : 'text-sell'}`}>
                  {ticker.change24h !== undefined ? formatChange(ticker.change24h) : '---'}
                </span>
              </div>
            </div>
          );
        })
        )}

        {filteredSymbols.length === 0 && (
          <div className="p-4 text-center text-text-muted text-xs">
            No markets found
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketSelector;
