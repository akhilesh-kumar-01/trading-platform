import React, { useState, useEffect, useCallback, useRef } from 'react';
import AdvancedChart from '../components/AdvancedChart';

import OrderBook from '../components/OrderBook';
import RecentTrades from '../components/RecentTrades';
import MarketSelector from '../components/MarketSelector';
import OrderEntry from '../components/OrderEntry';
import BottomPanel from '../components/BottomPanel';
import SymbolHeader from '../components/SymbolHeader';
import { useWebSocket } from '../hooks/useWebSocket';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { 
  BarChart2, 
  BookOpen, 
  TrendingUp, 
  Layers 
} from 'lucide-react';
import DemoTools from '../components/DemoTools';


const TradingTerminal = () => {
  const { selectedSymbol } = useWebSocket();
  const { isMobile } = useBreakpoint();
  const [activeMobileTab, setActiveMobileTab] = useState('chart');
  const [bottomPanelHeight, setBottomPanelHeight] = useState(220);
  const [chartHeight, setChartHeight] = useState(480);
  const isResizing = useRef(false);

  // Update Page Title
  useEffect(() => {
    document.title = `${selectedSymbol} | ZOS Trading`;
  }, [selectedSymbol]);

  // Calculate Chart Height
  const calculateHeights = useCallback(() => {
    const total = window.innerHeight - 48 - 52 - bottomPanelHeight;
    setChartHeight(Math.max(300, total));
  }, [bottomPanelHeight]);

  useEffect(() => {
    calculateHeights();
    window.addEventListener('resize', calculateHeights);
    return () => window.removeEventListener('resize', calculateHeights);
  }, [calculateHeights]);

  // Resizable Logic
  const startResizing = useCallback(() => {
    isResizing.current = true;
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const stopResizing = useCallback(() => {
    isResizing.current = false;
    document.body.style.cursor = 'default';
    document.body.style.userSelect = 'auto';
  }, []);

  const resize = useCallback((e) => {
    if (!isResizing.current) return;
    const newHeight = window.innerHeight - e.clientY;
    if (newHeight >= 150 && newHeight <= 400) {
      setBottomPanelHeight(newHeight);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

  if (isMobile) {
    return (
      <div className="flex flex-col h-[calc(100vh-48px)] bg-bg-base overflow-hidden">
        <SymbolHeader compact={true} />
        
        <div className="flex-1 overflow-hidden relative">
          {activeMobileTab === 'chart' && (
            <div className="h-full">
              <AdvancedChart 
                symbol={selectedSymbol} 
                height={window.innerHeight - 48 - 52 - 56} 
              />

            </div>
          )}
          {activeMobileTab === 'book' && (
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-hidden">
                <OrderBook />
              </div>
              <div className="h-[40%] border-t border-border-dim">
                <RecentTrades />
              </div>
            </div>
          )}
          {activeMobileTab === 'trade' && (
            <div className="h-full overflow-y-auto">
              <OrderEntry />
            </div>
          )}
          {activeMobileTab === 'positions' && (
            <div className="h-full overflow-y-auto">
              <BottomPanel />
            </div>
          )}
        </div>

        {/* Mobile Tab Bar */}
        <div className="h-14 bg-bg-surface border-t border-border-dim flex items-center z-40">
          {[
            { id: 'chart', icon: BarChart2, label: 'Chart' },
            { id: 'book', icon: BookOpen, label: 'Book' },
            { id: 'trade', icon: TrendingUp, label: 'Trade' },
            { id: 'positions', icon: Layers, label: 'Positions' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveMobileTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 text-[10px] py-1 transition-colors ${
                activeMobileTab === tab.id ? 'text-accent font-bold' : 'text-text-muted font-medium'
              }`}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-48px)] bg-bg-base overflow-hidden font-inter select-none">
      {/* Header Area */}
      <SymbolHeader />

      {/* Main Grid Layout */}
      <div 
        className="flex-1 grid min-h-0 h-full"
        style={{
          display: 'grid',
          gridTemplateColumns: '36px 200px 1fr 240px 280px',
          gridTemplateRows: `1fr ${bottomPanelHeight}px`,
          gridTemplateAreas: `
            "tools market chart book order"
            "tools market bottom bottom order"
          `
        }}
      >
        {/* Tools Sidebar */}
        <div style={{ gridArea: 'tools' }} className="min-h-0 border-r border-border-dim bg-bg-surface">
           <DemoTools />
        </div>

        {/* Market Selector */}
        <div 
          className="border-r border-border-dim overflow-hidden bg-bg-base min-h-0"
          style={{ gridArea: 'market' }}
        >
          <MarketSelector />
        </div>

        {/* Chart Area */}
        <div 
          className="flex flex-col overflow-hidden bg-bg-base relative min-h-0"
          style={{ gridArea: 'chart' }}
        >
          <div className="flex-1 min-h-0">
            <AdvancedChart 
              symbol={selectedSymbol}
              height={chartHeight}
            />

          </div>
        </div>

        {/* Order Book + Recent Trades */}
        <div 
          className="flex flex-col border-l border-border-dim overflow-hidden bg-bg-base min-h-0"
          style={{ gridArea: 'book' }}
        >
          <div className="flex-[0.65] min-h-0 overflow-hidden">
            <OrderBook />
          </div>
          <div className="flex-[0.35] min-h-0 border-t border-border-dim overflow-hidden">
            <RecentTrades />
          </div>
        </div>

        {/* Order Entry */}
        <div 
          className="border-l border-border-dim bg-bg-surface overflow-hidden min-h-0"
          style={{ gridArea: 'order' }}
        >
          <OrderEntry />
        </div>

        {/* Bottom Panel */}
        <div 
          className="border-t border-border-dim bg-bg-surface overflow-hidden relative min-h-0"
          style={{ gridArea: 'bottom' }}
        >
          {/* Resize Handle */}
          <div 
            onMouseDown={startResizing}
            className="absolute top-0 left-0 right-0 h-1 cursor-row-resize hover:bg-accent/50 transition-colors z-30"
          />
          <BottomPanel />
        </div>
      </div>
    </div>
  );

};

export default TradingTerminal;
