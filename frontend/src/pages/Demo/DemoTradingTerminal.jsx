import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AdvancedChart from '../../components/AdvancedChart';

import OrderBook from '../../components/OrderBook';
import RecentTrades from '../../components/RecentTrades';
import MarketSelector from '../../components/MarketSelector';
import OrderEntry from '../../components/OrderEntry';
import BottomPanel from '../../components/BottomPanel';
import SymbolHeader from '../../components/SymbolHeader';
import DemoTools from '../../components/DemoTools';
import { useWebSocket } from '../../hooks/useWebSocket';

import { useBreakpoint } from '../../hooks/useBreakpoint';
import { 
  BarChart2, 
  BookOpen, 
  TrendingUp, 
  Layers,
  AlertTriangle,
  RefreshCw,
  Wallet,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { loadDemoBalance, getUserWallet } from '@/Redux/Wallet/Action';
import { toggleDemoMode } from '@/Redux/Auth/Action';
import { fetchCoinList, getTop50CoinList, fetchTradingCoinList } from '@/Redux/Coin/Action';
import { getAllOrdersForUser } from '@/Redux/Order/Action';
import { useToast } from '@/components/ui/use-toast';

const DemoHeader = ({ demoBalance, isLoading, onReload }) => (
  <div className="h-10 bg-accent/10 border-b border-accent/20 flex items-center justify-between px-4">
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5 px-2 py-0.5 bg-accent text-white text-[10px] font-black rounded-sm uppercase tracking-wider">
        <AlertTriangle size={12} fill="white" className="text-accent" />
        Demo Mode
      </div>
      <div className="flex items-center gap-4 text-xs text-text-muted border-l border-border-dim ml-2 pl-4">
          <div className="flex items-center gap-2">
              <span className="font-medium">Demo Balance:</span>
              <span className="font-mono font-bold text-accent">
                  {demoBalance?.toLocaleString() || '0.00'} USDT
              </span>
          </div>
          <div className="hidden md:flex items-center gap-2">
              <Info size={14} className="text-text-muted/50" />
              <span>Virtual trading environment. No real funds at risk.</span>
          </div>
      </div>
    </div>
    <div className="flex items-center gap-2">
       <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 text-[11px] font-bold gap-1.5 bg-accent/20 hover:bg-accent/30 text-accent transition-all"
          onClick={onReload}
       >
          <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
          RELOAD WALLET
       </Button>
    </div>
  </div>
);

const DemoTradingTerminal = () => {

  const dispatch = useDispatch();
  const { auth, wallet } = useSelector(store => store);
  const { selectedSymbol } = useWebSocket();
  const { isMobile } = useBreakpoint();
  const { toast } = useToast();
  
  const [activeMobileTab, setActiveMobileTab] = useState('chart');
  const [bottomPanelHeight, setBottomPanelHeight] = useState(260);
  const [chartHeight, setChartHeight] = useState(480);
  const isResizing = useRef(false);

  // Update Page Title
  useEffect(() => {
    document.title = `[DEMO] ${selectedSymbol} | ZOS Trading`;
  }, [selectedSymbol]);

  // Ensure user is in demo mode and fetch initial data
  useEffect(() => {
    const jwt = auth.jwt || localStorage.getItem("jwt");
    if (!jwt) return;

    if (auth.user && !auth.isDemoMode) {
      dispatch(toggleDemoMode(jwt));
    }

    // Initial Data Fetch
    const initData = async () => {
        dispatch(fetchCoinList(1));
        dispatch(getTop50CoinList());
        dispatch(fetchTradingCoinList());
        dispatch(getUserWallet(jwt));
        dispatch(getAllOrdersForUser({ jwt }));
    };

    initData();

    // Polling for wallet balance in demo mode
    const interval = setInterval(() => {
        dispatch(getUserWallet(jwt));
    }, 10000);

    return () => clearInterval(interval);
  }, [auth.isDemoMode, auth.user, dispatch]);

  // Calculate Chart Height
  const calculateHeights = useCallback(() => {
    const total = window.innerHeight - 48 - 64 - bottomPanelHeight; // adjusted for demo header
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
    if (newHeight >= 150 && newHeight <= 500) {
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

  const handleReloadWallet = () => {
    dispatch(loadDemoBalance(auth.jwt || localStorage.getItem("jwt")));
    toast({
      title: "Wallet Reloaded",
      description: "1,000 USDT has been credited to your demo account.",
    });
  };



  if (isMobile) {
    return (
      <div className="flex flex-col h-[calc(100vh-48px)] bg-bg-base overflow-hidden">
        <DemoHeader 
            demoBalance={wallet.userWallet?.demoBalance}
            isLoading={wallet.loading}
            onReload={handleReloadWallet}
        />

        <SymbolHeader compact={true} />
        
        <div className="flex-1 overflow-hidden relative">
          {activeMobileTab === 'chart' && (
            <div className="h-full">
              <AdvancedChart 
                symbol={selectedSymbol} 
                height={window.innerHeight - 48 - 10 - 52 - 56} 
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
      <DemoHeader 
          demoBalance={wallet.userWallet?.demoBalance}
          isLoading={wallet.loading}
          onReload={handleReloadWallet}
      />

      
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

export default DemoTradingTerminal;
