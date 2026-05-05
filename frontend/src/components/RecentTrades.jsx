import React from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { formatPrice } from '../lib/formatters';
import { Skeleton } from './ui/skeleton';

const RecentTrades = () => {
  const { recentTrades: trades = [] } = useWebSocket();

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-bg-surface overflow-hidden select-none">
      {/* Header */}
      <div className="flex items-center h-8 px-2 text-[10px] font-bold text-text-muted border-b border-border-dim/50 uppercase tracking-wider">
        <div className="flex-1">Price</div>
        <div className="flex-1 text-right">Amount</div>
        <div className="flex-1 text-right">Time</div>
      </div>

      {/* Trades List */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-thin">

        {trades.length === 0 ? (
          Array(20).fill(0).map((_, i) => (
            <div key={i} className="flex h-5 px-2 gap-2 items-center">
              <Skeleton className="flex-1 h-3" />
              <Skeleton className="flex-1 h-3" />
              <Skeleton className="flex-1 h-3" />
            </div>
          ))
        ) : (
          [...trades].reverse().map((trade, i) => {
            const isSell = trade.isBuyerMaker; 
            const price = parseFloat(trade.price);
            const amount = parseFloat(trade.qty);
            const time = trade.time;

            if (isNaN(price) || isNaN(amount)) return null;

            return (
              <div 
                key={trade.t || i} 
                className="flex items-center h-5 text-[11px] font-mono hover:bg-bg-elevated transition-colors duration-150 animate-in fade-in slide-in-from-right-1"
              >
                <div className={`flex-1 px-2 font-medium ${isSell ? 'text-sell' : 'text-buy'}`}>
                  {formatPrice(price)}
                </div>
                <div className="flex-1 text-right px-2 text-text-primary">
                  {amount.toFixed(4)}
                </div>
                <div className="flex-1 text-right px-2 text-text-muted">
                  {formatTime(time)}
                </div>
              </div>
            );
          })
        )}

      </div>
    </div>
  );
};

export default RecentTrades;
