import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getOptionChain, placeOptionOrder, getUserOptionOrders } from '@/Redux/Options/Action';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  TrendingUp,
  TrendingDown,
  Info,
  Calendar,
  Target,
  Activity,
  Zap,
  ChevronDown,
  BookOpen
} from 'lucide-react';
import SpinnerBackdrop from '@/components/custome/SpinnerBackdrop';
import { formatPrice } from '@/lib/formatters';

const COINS = [
  { id: "bitcoin",  label: "BTC" },
  { id: "ethereum", label: "ETH" },
  { id: "solana",   label: "SOL" },
];

const OptionsChain = () => {
  const dispatch = useDispatch();
  const { options, auth } = useSelector((store) => store);
  const [selectedSymbol, setSelectedSymbol] = useState("bitcoin");
  const [selectedExpiry, setSelectedExpiry] = useState(null);
  const [orderConfig, setOrderConfig] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('chain'); // 'chain' | 'positions'

  useEffect(() => {
    dispatch(getOptionChain(selectedSymbol));
  }, [dispatch, selectedSymbol]);

  useEffect(() => {
    dispatch(getUserOptionOrders(auth.jwt || localStorage.getItem("jwt")));
  }, [dispatch]);

  useEffect(() => {
    if (options.chain?.expiries?.length > 0 && !selectedExpiry) {
      setSelectedExpiry(options.chain.expiries[0]);
    }
  }, [options.chain]);

  const handleSymbolChange = (sym) => {
    setSelectedExpiry(null);
    setSelectedSymbol(sym);
  };

  const handlePlaceOrder = () => {
    const orderRequest = {
      symbol: `${selectedSymbol.toUpperCase()}-${formatDate(selectedExpiry)}-${orderConfig.strikePrice}-${orderConfig.optionType[0]}`,
      strikePrice: orderConfig.strikePrice,
      expiry: selectedExpiry,
      optionType: orderConfig.optionType,
      premium: orderConfig.premium,
      quantity: Number(quantity),
    };
    dispatch(placeOptionOrder({ jwt: auth.jwt || localStorage.getItem("jwt"), orderRequest }));
    setOrderConfig(null);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }).toUpperCase();
  };

  const totalCost = orderConfig ? (orderConfig.premium * quantity).toFixed(2) : 0;

  if (options.loading && !options.chain) return <SpinnerBackdrop />;

  return (
    <div className="min-h-screen bg-bg-base text-text-primary font-inter">
      {/* ─── Page Header ─── */}
      <div className="border-b border-border-dim bg-bg-surface px-6 py-4">
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <Zap className="text-accent" size={16} />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-none">Options Chain</h1>
              <p className="text-[11px] text-text-muted mt-0.5">
                Derivative trading · Cash-settled · European style
                {auth.isDemoMode && <span className="ml-2 px-1.5 py-0.5 bg-accent/15 text-accent rounded-sm font-bold">DEMO</span>}
              </p>
            </div>
          </div>

          {/* Underlying selector */}
          <div className="flex items-center gap-1 bg-bg-elevated border border-border-dim p-1 rounded-lg">
            {COINS.map(c => (
              <button
                key={c.id}
                onClick={() => handleSymbolChange(c.id)}
                className={`px-5 h-8 text-[13px] font-bold rounded-md transition-all ${
                  selectedSymbol === c.id
                    ? "bg-accent text-white shadow-md"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 py-6">
        {/* ─── Tab Switcher ─── */}
        <div className="flex gap-2 mb-6 border-b border-border-dim">
          {[
            { id: 'chain', label: 'Options Chain', icon: Target },
            { id: 'positions', label: 'My Positions', icon: BookOpen },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 h-10 text-[13px] font-medium border-b-2 transition-all -mb-px ${
                activeTab === tab.id
                  ? "text-accent border-accent"
                  : "text-text-secondary border-transparent hover:text-text-primary"
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
              {tab.id === 'positions' && options.orders?.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-accent text-white text-[9px] font-black rounded-full">
                  {options.orders.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {activeTab === 'chain' && (
          <>
            {/* ─── Expiry Selector ─── */}
            <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-1 scroll-container">
              <div className="flex items-center gap-1.5 text-text-muted shrink-0">
                <Calendar size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Expiry:</span>
              </div>
              {options.chain?.expiries?.map((expiry, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedExpiry(expiry)}
                  className={`shrink-0 h-8 px-5 rounded-full text-[12px] font-bold border transition-all ${
                    selectedExpiry === expiry
                      ? "border-accent text-accent bg-accent/10 shadow-sm"
                      : "border-border-dim text-text-secondary hover:border-text-muted hover:text-text-primary"
                  }`}
                >
                  {formatDate(expiry)}
                </button>
              ))}
            </div>

            {/* ─── Column Labels ─── */}
            <div className="grid grid-cols-2 gap-3 mb-1">
              <div className="text-center py-1.5 bg-buy/5 border-t border-x border-buy/20 rounded-t-lg">
                <span className="text-[10px] font-black text-buy uppercase tracking-widest">
                  ↑ Calls · Bullish
                </span>
              </div>
              <div className="text-center py-1.5 bg-sell/5 border-t border-x border-sell/20 rounded-t-lg">
                <span className="text-[10px] font-black text-sell uppercase tracking-widest">
                  ↓ Puts · Bearish
                </span>
              </div>
            </div>

            {/* ─── Chain Table ─── */}
            <div className="bg-bg-surface border border-border-dim rounded-xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-center text-[12px] border-collapse">
                  <thead>
                    <tr className="bg-bg-elevated/60 border-b border-border-dim">
                      <th className="px-3 py-3 text-[10px] font-bold text-buy/70 uppercase tracking-wider">Δ Delta</th>
                      <th className="px-3 py-3 text-[10px] font-bold text-text-muted uppercase tracking-wider">IV%</th>
                      <th className="px-3 py-3 text-[10px] font-bold text-buy uppercase tracking-wider cursor-help" title="Click to buy at bid">Bid ↑</th>
                      <th className="px-3 py-3 text-[10px] font-bold text-buy uppercase tracking-wider cursor-help" title="Click to buy at ask">Ask ↑</th>

                      {/* Strike Centre */}
                      <th className="px-4 py-3 text-[10px] font-bold text-text-primary uppercase tracking-wider bg-bg-elevated border-x border-border-dim w-36">
                        <div className="flex items-center justify-center gap-1">
                          <Target size={11} /> Strike
                        </div>
                      </th>

                      <th className="px-3 py-3 text-[10px] font-bold text-sell uppercase tracking-wider cursor-help" title="Click to buy at bid">Bid ↓</th>
                      <th className="px-3 py-3 text-[10px] font-bold text-sell uppercase tracking-wider cursor-help" title="Click to buy at ask">Ask ↓</th>
                      <th className="px-3 py-3 text-[10px] font-bold text-text-muted uppercase tracking-wider">IV%</th>
                      <th className="px-3 py-3 text-[10px] font-bold text-sell/70 uppercase tracking-wider">Δ Delta</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-dim/20">
                    {options.chain?.strikes?.length > 0 ? (
                      options.chain.strikes.map((strike, idx) => (
                        <tr key={idx} className="group hover:bg-bg-elevated/10 transition-colors">
                          {/* ── CALL side ── */}
                          <td className="px-3 py-3.5 font-mono text-buy/60">{strike.call.delta.toFixed(2)}</td>
                          <td className="px-3 py-3.5 font-mono text-text-muted">{(strike.call.iv * 100).toFixed(1)}%</td>
                          <td
                            className="px-3 py-3.5 font-mono font-bold text-buy cursor-pointer hover:bg-buy/10 transition-colors rounded-sm"
                            onClick={() => setOrderConfig({ optionType: 'CALL', strikePrice: strike.strikePrice, premium: parseFloat(strike.call.bid), side: 'BID' })}
                            title="Buy CALL at Bid"
                          >
                            {strike.call.bid}
                          </td>
                          <td
                            className="px-3 py-3.5 font-mono font-bold text-buy cursor-pointer hover:bg-buy/10 transition-colors rounded-sm"
                            onClick={() => setOrderConfig({ optionType: 'CALL', strikePrice: strike.strikePrice, premium: parseFloat(strike.call.ask), side: 'ASK' })}
                            title="Buy CALL at Ask"
                          >
                            {strike.call.ask}
                          </td>

                          {/* ── Strike Centre ── */}
                          <td className="px-4 py-3.5 font-mono font-black text-[14px] text-text-primary bg-bg-elevated border-x border-border-dim">
                            {formatPrice(strike.strikePrice)}
                          </td>

                          {/* ── PUT side ── */}
                          <td
                            className="px-3 py-3.5 font-mono font-bold text-sell cursor-pointer hover:bg-sell/10 transition-colors rounded-sm"
                            onClick={() => setOrderConfig({ optionType: 'PUT', strikePrice: strike.strikePrice, premium: parseFloat(strike.put.bid), side: 'BID' })}
                            title="Buy PUT at Bid"
                          >
                            {strike.put.bid}
                          </td>
                          <td
                            className="px-3 py-3.5 font-mono font-bold text-sell cursor-pointer hover:bg-sell/10 transition-colors rounded-sm"
                            onClick={() => setOrderConfig({ optionType: 'PUT', strikePrice: strike.strikePrice, premium: parseFloat(strike.put.ask), side: 'ASK' })}
                            title="Buy PUT at Ask"
                          >
                            {strike.put.ask}
                          </td>
                          <td className="px-3 py-3.5 font-mono text-text-muted">{(strike.put.iv * 100).toFixed(1)}%</td>
                          <td className="px-3 py-3.5 font-mono text-sell/60">{strike.put.delta.toFixed(2)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={9} className="py-20 text-center text-text-muted">
                          <div className="flex flex-col items-center gap-2">
                            <Activity className="text-accent opacity-40" size={32} />
                            <p className="font-medium">Loading option chain…</p>
                            <p className="text-xs">Make sure the backend is running</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ─── Legend ─── */}
            <div className="mt-4 flex flex-wrap gap-6 text-[10px] text-text-muted bg-bg-surface/50 px-5 py-3 rounded-lg border border-border-dim/40">
              <span className="flex items-center gap-1.5"><Info size={11} className="text-accent" /> Click <span className="text-buy font-bold">Bid/Ask</span> to open order panel</span>
              <span className="flex items-center gap-1.5"><Info size={11} className="text-accent" /> Delta: sensitivity to price move</span>
              <span className="flex items-center gap-1.5"><Info size={11} className="text-accent" /> IV: implied volatility annualised</span>
              <span className="flex items-center gap-1.5"><Activity size={11} className="text-accent" /> Settlement: USDT cash-settled on expiry</span>
            </div>
          </>
        )}

        {/* ─── Positions Tab ─── */}
        {activeTab === 'positions' && (
          <div className="bg-bg-surface border border-border-dim rounded-xl overflow-hidden shadow-xl">
            {options.orders?.length === 0 ? (
              <div className="py-24 text-center text-text-muted flex flex-col items-center gap-3">
                <BookOpen size={40} className="opacity-20" />
                <p className="font-semibold text-text-secondary">No option positions yet</p>
                <p className="text-xs">Go to the Options Chain tab and click a Bid or Ask to open a trade.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[12px]">
                  <thead>
                    <tr className="bg-bg-elevated/50 border-b border-border-dim text-[10px] text-text-muted font-bold uppercase tracking-wider">
                      <th className="px-5 py-3">Symbol</th>
                      <th className="px-5 py-3">Type</th>
                      <th className="px-5 py-3 text-right">Strike</th>
                      <th className="px-5 py-3 text-right">Premium Paid</th>
                      <th className="px-5 py-3 text-right">Qty</th>
                      <th className="px-5 py-3 text-right">Total Cost</th>
                      <th className="px-5 py-3 text-right">Expiry</th>
                      <th className="px-5 py-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-dim/20">
                    {[...options.orders].reverse().map(order => (
                      <tr key={order.id} className="hover:bg-bg-elevated/10 transition-colors">
                        <td className="px-5 py-4 font-mono font-bold text-text-primary">{order.symbol}</td>
                        <td className="px-5 py-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                            order.optionType === 'CALL' ? 'bg-buy/10 text-buy' : 'bg-sell/10 text-sell'
                          }`}>
                            {order.optionType === 'CALL' ? '↑ CALL' : '↓ PUT'}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right font-mono">{formatPrice(order.strikePrice)}</td>
                        <td className="px-5 py-4 text-right font-mono text-accent">{formatPrice(order.premium)}</td>
                        <td className="px-5 py-4 text-right font-mono">{order.quantity}</td>
                        <td className="px-5 py-4 text-right font-mono font-bold">
                          {formatPrice(order.premium * order.quantity)}
                        </td>
                        <td className="px-5 py-4 text-right text-text-muted">{formatDate(order.expiry)}</td>
                        <td className="px-5 py-4 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            order.status === 'SUCCESS' ? 'bg-buy/10 text-buy' : 'bg-yellow-500/10 text-yellow-500'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─── Order Dialog ─── */}
      <Dialog open={!!orderConfig} onOpenChange={() => setOrderConfig(null)}>
        <DialogContent className="bg-bg-surface border-border-dim text-text-primary sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              {orderConfig?.optionType === 'CALL'
                ? <TrendingUp className="text-buy" size={20} />
                : <TrendingDown className="text-sell" size={20} />
              }
              Buy {orderConfig?.optionType} Option
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* Summary grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-bg-elevated rounded-lg p-3">
                <p className="text-[10px] uppercase text-text-muted font-bold mb-1">Strike</p>
                <p className="text-lg font-mono font-black">{orderConfig && formatPrice(orderConfig.strikePrice)}</p>
              </div>
              <div className="bg-bg-elevated rounded-lg p-3">
                <p className="text-[10px] uppercase text-text-muted font-bold mb-1">Expiry</p>
                <p className="text-lg font-mono font-black">{formatDate(selectedExpiry)}</p>
              </div>
              <div className="bg-bg-elevated rounded-lg p-3">
                <p className="text-[10px] uppercase text-text-muted font-bold mb-1">Side</p>
                <p className="text-lg font-mono font-black">{orderConfig?.side}</p>
              </div>
              <div className="bg-bg-elevated rounded-lg p-3">
                <p className="text-[10px] uppercase text-text-muted font-bold mb-1">Premium / unit</p>
                <p className="text-lg font-mono font-black text-accent">{orderConfig?.premium} USDT</p>
              </div>
            </div>

            {/* Qty input */}
            <div className="space-y-2">
              <Label htmlFor="qty" className="text-sm font-semibold">Contracts (quantity)</Label>
              <Input
                id="qty"
                type="number"
                min="1"
                value={quantity}
                onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
                className="bg-bg-elevated border-border-dim focus-visible:ring-accent font-mono text-lg h-12"
              />
            </div>

            {/* Cost breakdown */}
            <div className="bg-bg-elevated/50 p-4 rounded-lg border border-border-dim space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Premium × Qty</span>
                <span className="font-mono">{orderConfig?.premium} × {quantity}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-border-dim">
                <span className="font-bold">Total Cost</span>
                <span className="font-mono font-black text-2xl text-text-primary">{totalCost} USDT</span>
              </div>
            </div>

            <Button
              className={`w-full h-12 text-[15px] font-black tracking-wide transition-all ${
                orderConfig?.optionType === 'CALL'
                  ? 'bg-buy hover:bg-buy/90 text-white'
                  : 'bg-sell hover:bg-sell/90 text-white'
              }`}
              onClick={handlePlaceOrder}
            >
              {orderConfig?.optionType === 'CALL' ? '↑' : '↓'} Place {orderConfig?.optionType} Order
            </Button>

            <p className="text-[10px] text-center text-text-muted px-2 leading-relaxed">
              Options expire worthless if out-of-the-money. Maximum loss = premium paid. 
              {auth.isDemoMode ? ' Trading with virtual funds.' : ' Real funds will be deducted.'}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OptionsChain;
