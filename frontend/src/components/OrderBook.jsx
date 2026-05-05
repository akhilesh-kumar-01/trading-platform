import React, { useMemo } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { formatPrice } from '../lib/formatters';
import { Skeleton } from './ui/skeleton';

const OrderBookRow = ({ price, amount, total, maxTotal, type }) => {
  const percentage = (total / maxTotal) * 100;
  
  return (
    <div className="relative flex items-center h-5 text-[11px] font-mono group hover:bg-bg-elevated cursor-default">
      {/* Visual Depth Bar */}
      <div 
        className={`absolute right-0 h-full opacity-20 transition-all duration-300 ${type === 'ask' ? 'bg-sell' : 'bg-buy'}`}
        style={{ width: `${percentage}%` }}
      />
      
      {/* Price */}
      <div className={`flex-1 px-2 z-10 font-medium ${type === 'ask' ? 'text-sell' : 'text-buy'}`}>
        {formatPrice(price)}
      </div>
      
      {/* Amount */}
      <div className="flex-1 text-right px-2 z-10 text-text-primary">
        {amount.toFixed(4)}
      </div>
      
      {/* Total */}
      <div className="flex-1 text-right px-2 z-10 text-text-secondary">
        {total.toFixed(4)}
      </div>
    </div>
  );
};

const OrderBook = () => {
  const { orderBook, selectedSymbol } = useWebSocket();
  const { bids = [], asks = [] } = orderBook || {};

  // Process data for rendering
  const processedData = useMemo(() => {
    // Take top 15 of each
    const limit = 15;
    
    // Asks are usually sorted ascending, we want to show them descending (top to bottom)
    const sortedAsks = [...asks].slice(0, limit).reverse();
    const sortedBids = [...bids].slice(0, limit);

    let askTotal = 0;
    const askRows = sortedAsks.map(a => {
      const price = parseFloat(a[0]);
      const amount = parseFloat(a[1]);
      askTotal += amount;
      return { price, amount, total: askTotal };
    }).reverse(); // Reverse back for visual display (highest ask at top)

    let bidTotal = 0;
    const bidRows = sortedBids.map(b => {
      const price = parseFloat(b[0]);
      const amount = parseFloat(b[1]);
      bidTotal += amount;
      return { price, amount, total: bidTotal };
    });

    const maxTotal = Math.max(
      askRows.length > 0 ? askRows[0].total : 0, 
      bidRows.length > 0 ? bidRows[bidRows.length - 1].total : 0
    );

    const spread = asks.length > 0 && bids.length > 0 && asks[0] && bids[0]
      ? parseFloat(asks[0][0]) - parseFloat(bids[0][0]) 
      : 0;
    
    const spreadPercentage = bids.length > 0 && bids[0] && parseFloat(bids[0][0]) > 0
      ? (spread / parseFloat(bids[0][0])) * 100
      : 0;

    return { askRows, bidRows, maxTotal, spread, spreadPercentage };

  }, [bids, asks]);

  const { askRows, bidRows, maxTotal, spread, spreadPercentage } = processedData;

  return (
    <div className="flex flex-col h-full bg-bg-surface overflow-hidden border-b border-border-dim select-none">
      {/* Header */}
      <div className="flex items-center h-8 px-2 text-[10px] font-bold text-text-muted border-b border-border-dim/50 uppercase tracking-wider">
        <div className="flex-1">Price</div>
        <div className="flex-1 text-right">Amount</div>
        <div className="flex-1 text-right">Total</div>
      </div>

      {/* Asks (Sell Orders) */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin flex flex-col justify-end">

        {askRows.length === 0 ? (
          Array(15).fill(0).map((_, i) => (
            <div key={i} className="flex h-5 px-2 gap-2 items-center">
              <Skeleton className="flex-1 h-3" />
              <Skeleton className="flex-1 h-3" />
              <Skeleton className="flex-1 h-3" />
            </div>
          ))
        ) : (
          askRows.map((row, i) => (
            <OrderBookRow 
              key={`ask-${i}`} 
              {...row} 
              maxTotal={maxTotal} 
              type="ask" 
            />
          ))
        )}
      </div>

      {/* Spread Indicator */}
      <div className="flex items-center justify-between h-9 px-4 bg-bg-elevated/30 border-y border-border-dim/50">
        <div className="flex items-center gap-2">
          <span className={`text-[14px] font-mono font-bold ${bidRows.length > 0 ? 'text-buy' : 'text-text-primary'}`}>
            {bids.length > 0 ? formatPrice(bids[0][0]) : '---'}
          </span>
          <span className="text-[10px] text-text-muted">
            {spread.toFixed(2)}
          </span>
        </div>
        <span className="text-[10px] text-text-muted font-mono">
          {spreadPercentage.toFixed(2)}%
        </span>
      </div>

      {/* Bids (Buy Orders) */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin">

        {bidRows.length === 0 ? (
          Array(15).fill(0).map((_, i) => (
            <div key={i} className="flex h-5 px-2 gap-2 items-center">
              <Skeleton className="flex-1 h-3" />
              <Skeleton className="flex-1 h-3" />
              <Skeleton className="flex-1 h-3" />
            </div>
          ))
        ) : (
          bidRows.map((row, i) => (
            <OrderBookRow 
              key={`bid-${i}`} 
              {...row} 
              maxTotal={maxTotal} 
              type="bid" 
            />
          ))
        )}
      </div>
    </div>
  );
};

export default OrderBook;
