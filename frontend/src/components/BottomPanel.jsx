import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useWebSocket } from '../hooks/useWebSocket';
import { formatPrice, formatPnL } from '../lib/formatters';
import { getUserAssets } from '../Redux/Assets/Action';
import { getAllOrdersForUser, payOrder } from '../Redux/Order/Action';
import { Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';


const BottomPanel = () => {
  const dispatch = useDispatch();
  const { auth, asset, order } = useSelector(store => store);
  const { tickers } = useWebSocket();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('positions');


  useEffect(() => {
    const jwt = auth.jwt || localStorage.getItem("jwt");
    if (jwt) {
      dispatch(getUserAssets(jwt));
      dispatch(getAllOrdersForUser({ jwt }));
    }
  }, [auth.jwt, auth.isDemoMode, dispatch]);

  const handleClosePosition = async (item) => {
    const jwt = auth.jwt || localStorage.getItem("jwt");
    if (!jwt) return;

    try {
        const orderData = {
            coinId: item.coin.id,
            quantity: item.quantity,
            orderType: 'SELL'
        };
        await dispatch(payOrder({ jwt, orderData }));
        toast({
            title: "Position Closed",
            description: `Successfully sold ${item.quantity.toFixed(4)} ${item.coin.symbol.toUpperCase()}.`,
        });
        dispatch(getUserAssets(jwt));
        dispatch(getAllOrdersForUser({ jwt }));
    } catch (error) {
        toast({
            title: "Error",
            description: "Failed to close position.",
            variant: "destructive"
        });
    }
  };



  const tabs = [
    { id: 'positions', label: 'Positions' },
    { id: 'orders', label: 'Open Orders' },
    { id: 'history', label: 'Trade History' },
    { id: 'assets', label: 'Demo Balances' }
  ];


  const renderPositions = () => {
    if (asset.loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-accent" /></div>;
    
    return (
      <table className="w-full text-left text-[11px] font-inter">
        <thead className="text-text-muted uppercase border-b border-border-dim/50 sticky top-0 bg-bg-surface z-10">
          <tr>
            <th className="px-4 py-2 font-bold">Market</th>
            <th className="px-4 py-2 font-bold text-right">Size</th>
            <th className="px-4 py-2 font-bold text-right">Entry Price</th>
            <th className="px-4 py-2 font-bold text-right">Mark Price</th>
            <th className="px-4 py-2 font-bold text-right">Unrealized PnL</th>
            <th className="px-4 py-2 font-bold text-right">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border-dim/30">
          {asset.userAssets.length === 0 ? (
            <tr><td colSpan="5" className="text-center py-10 text-text-muted">No active positions</td></tr>
          ) : (
            asset.userAssets.map((item) => {
              const binanceSymbol = item.coin.symbol.toUpperCase() + 'USDT';
              const currentPrice = tickers[binanceSymbol]?.price || item.coin.current_price;
              const pnl = (currentPrice - item.buyPrice) * item.quantity;
              const pnlPercent = ((currentPrice - item.buyPrice) / item.buyPrice) * 100;

              return (
                <tr key={item.id} className="hover:bg-bg-elevated/30 transition-colors">
                  <td className="px-4 py-2 font-bold text-text-primary">{item.coin.symbol.toUpperCase()}/USDT</td>
                  <td className="px-4 py-2 text-right font-mono">{item.quantity.toFixed(4)}</td>
                  <td className="px-4 py-2 text-right font-mono">{formatPrice(item.buyPrice)}</td>
                  <td className="px-4 py-2 text-right font-mono">{formatPrice(currentPrice)}</td>
                  <td className={`px-4 py-2 text-right font-mono font-bold ${pnl >= 0 ? 'text-buy' : 'text-sell'}`}>
                    {formatPnL(pnl)} ({pnlPercent >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%)
                  </td>
                  <td className="px-4 py-2 text-right">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 text-[10px] bg-sell/10 text-sell hover:bg-sell hover:text-white border border-sell/20 transition-all font-bold px-3"
                        onClick={() => handleClosePosition(item)}
                    >
                        CLOSE
                    </Button>
                  </td>
                </tr>

              );
            })
          )}
        </tbody>
      </table>
    );
  };

  const renderOrders = () => {
    const openOrders = order.orders.filter(o => o.status === 'PENDING');
    
    return (
      <table className="w-full text-left text-[11px] font-inter">
        <thead className="text-text-muted uppercase border-b border-border-dim/50 sticky top-0 bg-bg-surface z-10">
          <tr>
            <th className="px-4 py-2 font-bold">Time</th>
            <th className="px-4 py-2 font-bold">Market</th>
            <th className="px-4 py-2 font-bold">Side</th>
            <th className="px-4 py-2 font-bold text-right">Price</th>
            <th className="px-4 py-2 font-bold text-right">Filled / Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-dim/30">
          {openOrders.length === 0 ? (
            <tr><td colSpan="5" className="text-center py-10 text-text-muted">No open orders</td></tr>
          ) : (
            openOrders.map((o) => (
              <tr key={o.id} className="hover:bg-bg-elevated/30 transition-colors">
                <td className="px-4 py-2 text-text-muted">{new Date(o.timestamp).toLocaleString()}</td>
                <td className="px-4 py-2 font-bold">{o.orderItem.coin.symbol.toUpperCase()}/USDT</td>
                <td className={`px-4 py-2 font-bold ${o.orderType === 'BUY' ? 'text-buy' : 'text-sell'}`}>{o.orderType}</td>
                <td className="px-4 py-2 text-right font-mono">{formatPrice(o.orderItem.buyPrice)}</td>
                <td className="px-4 py-2 text-right font-mono">0.00 / {o.orderItem.quantity.toFixed(4)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    );
  };

  const renderHistory = () => {
    return (
      <table className="w-full text-left text-[11px] font-inter">
        <thead className="text-text-muted uppercase border-b border-border-dim/50 sticky top-0 bg-bg-surface z-10">
          <tr>
            <th className="px-4 py-2 font-bold">Time</th>
            <th className="px-4 py-2 font-bold">Market</th>
            <th className="px-4 py-2 font-bold">Side</th>
            <th className="px-4 py-2 font-bold text-right">Price</th>
            <th className="px-4 py-2 font-bold text-right">Quantity</th>
            <th className="px-4 py-2 font-bold text-right">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-dim/30">
          {order.orders.length === 0 ? (
            <tr><td colSpan="6" className="text-center py-10 text-text-muted">No trade history</td></tr>
          ) : (
            [...order.orders].reverse().map((o) => (
              <tr key={o.id} className="hover:bg-bg-elevated/30 transition-colors">
                <td className="px-4 py-2 text-text-muted">{new Date(o.timestamp).toLocaleString()}</td>
                <td className="px-4 py-2 font-bold">{o.orderItem.coin.symbol.toUpperCase()}/USDT</td>
                <td className={`px-4 py-2 font-bold ${o.orderType === 'BUY' ? 'text-buy' : 'text-sell'}`}>{o.orderType}</td>
                <td className="px-4 py-2 text-right font-mono">{formatPrice(o.price / o.orderItem.quantity)}</td>
                <td className="px-4 py-2 text-right font-mono">{o.orderItem.quantity.toFixed(4)}</td>
                <td className="px-4 py-2 text-right">
                  <span className={`px-1.5 py-0.5 rounded-sm text-[9px] font-bold ${o.status === 'SUCCESS' ? 'bg-buy/10 text-buy' : 'bg-bg-elevated text-text-muted'}`}>
                    {o.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    );
  };

  const renderBalances = () => {

    return (
      <div className="p-6 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-bg-base border border-border-dim rounded-lg p-4 shadow-inner">
                  <div className="text-[10px] text-text-muted uppercase font-bold mb-1">Total Equity</div>
                  <div className="text-xl font-mono font-bold text-text-primary">
                    {formatPrice(wallet.userWallet?.demoBalance || 0)} <span className="text-xs text-text-muted">USDT</span>
                  </div>
              </div>
              <div className="bg-bg-base border border-border-dim rounded-lg p-4 shadow-inner">
                  <div className="text-[10px] text-text-muted uppercase font-bold mb-1">Available Margin</div>
                  <div className="text-xl font-mono font-bold text-buy">
                    {formatPrice(wallet.userWallet?.demoBalance || 0)} <span className="text-xs text-text-muted">USDT</span>
                  </div>
              </div>
              <div className="bg-bg-base border border-border-dim rounded-lg p-4 shadow-inner">
                  <div className="text-[10px] text-text-muted uppercase font-bold mb-1">Unrealized PnL</div>
                  <div className="text-xl font-mono font-bold text-text-muted">
                    $0.00
                  </div>
              </div>
          </div>

          <div className="flex flex-col gap-2">
             <div className="text-xs font-bold text-text-secondary flex items-center gap-2">
                <div className="w-1 h-3 bg-accent rounded-full" />
                Asset Allocation
             </div>
             <div className="h-2 w-full bg-bg-base rounded-full overflow-hidden flex">
                <div className="h-full bg-accent" style={{width: '70%'}} />
                <div className="h-full bg-buy" style={{width: '20%'}} />
                <div className="h-full bg-sell" style={{width: '10%'}} />
             </div>
             <div className="flex gap-4 text-[10px] text-text-muted">
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-accent" /> USDT (70%)</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-buy" /> BTC (20%)</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-sell" /> ETH (10%)</div>
             </div>
          </div>
      </div>
    );
  };


  return (
    <div className="flex flex-col h-full bg-bg-surface overflow-hidden">
      {/* Tabs */}
      <div className="flex h-10 border-b border-border-dim bg-bg-surface px-4 items-center gap-6 overflow-x-auto scrollbar-none whitespace-nowrap">

        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`h-full text-[12px] font-medium transition-all relative ${
              activeTab === tab.id ? 'text-text-primary' : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 min-h-0 overflow-auto scrollbar-thin">

        {activeTab === 'positions' && renderPositions()}
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'history' && renderHistory()}
        {activeTab === 'assets' && renderBalances()}
      </div>

    </div>
  );
};

export default BottomPanel;
