import React, { useEffect, useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { useWebSocket } from '../hooks/useWebSocket';
import { formatPrice, formatChange, formatVolume } from '../lib/formatters';

const SymbolHeader = ({ compact = false }) => {
  const { selectedSymbol, tickers } = useWebSocket();
  const currentTicker = tickers[selectedSymbol] ?? {};
  const [flashClass, setFlashClass] = useState('');
  const prevPriceRef = useRef(currentTicker.price);

  useEffect(() => {
    if (currentTicker.price !== undefined && prevPriceRef.current !== undefined) {
      if (currentTicker.price > prevPriceRef.current) {
        setFlashClass('flash-green');
      } else if (currentTicker.price < prevPriceRef.current) {
        setFlashClass('flash-red');
      }
      
      const timer = setTimeout(() => setFlashClass(''), 400);
      return () => clearTimeout(timer);
    }
    prevPriceRef.current = currentTicker.price;
  }, [currentTicker.price]);

  const [base, quote] = selectedSymbol.includes('USDT') 
    ? [selectedSymbol.replace('USDT', ''), 'USDT']
    : [selectedSymbol, ''];

  return (
    <div className={`flex items-center h-[52px] px-4 bg-bg-surface border-b border-border-dim gap-6 overflow-hidden`}>
      {/* Symbol Selector */}
      <div className="flex items-center gap-2 cursor-pointer group flex-shrink-0">
        <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-[10px] text-white font-bold">
          {base[0]}
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1">
            <span className="text-[15px] font-bold text-text-primary">{base}/{quote}</span>
            <ChevronDown className="w-3 h-3 text-text-muted group-hover:text-text-primary transition-colors" />
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="flex flex-col justify-center flex-shrink-0">
        <span className={`text-[20px] font-mono font-bold transition-colors duration-300 ${flashClass} ${currentTicker.change24h >= 0 ? 'text-buy' : 'text-sell'}`}>
          {formatPrice(currentTicker.price)}
        </span>
      </div>

      {!compact && (
        <div className="hidden md:flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] text-text-muted uppercase">24h Change</span>
            <span className={`text-[12px] font-mono font-medium ${currentTicker.change24h >= 0 ? 'text-buy' : 'text-sell'}`}>
              {formatChange(currentTicker.change24h)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-text-muted uppercase">24h High</span>
            <span className="text-[12px] font-mono text-text-secondary font-medium">
              {formatPrice(currentTicker.high)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-text-muted uppercase">24h Low</span>
            <span className="text-[12px] font-mono text-text-secondary font-medium">
              {formatPrice(currentTicker.low)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-text-muted uppercase">24h Volume({quote})</span>
            <span className="text-[12px] font-mono text-text-secondary font-medium">
              {formatVolume(currentTicker.volume)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SymbolHeader;
