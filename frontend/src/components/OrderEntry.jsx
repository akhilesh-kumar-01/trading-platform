import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useWebSocket } from '../hooks/useWebSocket';
import { formatPrice } from '../lib/formatters';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { getUserWallet } from '../Redux/Wallet/Action';
import { payOrder, getAllOrdersForUser } from '../Redux/Order/Action';
import { getUserAssets } from '../Redux/Assets/Action';

import { Loader2, WalletIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from './ui/use-toast';

const OrderEntry = () => {
  const dispatch = useDispatch();
  const { selectedSymbol, tickers } = useWebSocket();
  const { wallet, auth, coin } = useSelector(store => store);
  const { toast } = useToast();
  
  const [side, setSide] = useState('BUY'); // BUY or SELL
  const [orderType, setOrderType] = useState('MARKET'); // MARKET or LIMIT
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [leverage, setLeverage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentTicker = tickers[selectedSymbol] || {};
  const currentPrice = currentTicker.price || 0;

  useEffect(() => {
    const jwt = auth.jwt || localStorage.getItem("jwt");
    if (jwt) {
      dispatch(getUserWallet(jwt));
    }
  }, [auth.jwt, dispatch]);


  useEffect(() => {
    if (orderType === 'MARKET') {
      setPrice(currentPrice.toString());
    }
  }, [currentPrice, orderType]);

  const total = useMemo(() => {
    const p = orderType === 'MARKET' ? currentPrice : parseFloat(price) || 0;
    const q = parseFloat(quantity) || 0;
    return (p * q) / leverage;
  }, [price, quantity, currentPrice, orderType, leverage]);

  // Map selectedSymbol to backend coinId
  const currentCoin = useMemo(() => {
    if (!coin.coinList.length) return null;
    
    const symbolBase = selectedSymbol.replace('USDT', '').toLowerCase();
    // Try matching by symbol first, then name if necessary
    return coin.coinList.find(c => 
        c.symbol.toLowerCase() === symbolBase || 
        c.id.toLowerCase() === symbolBase ||
        c.symbol.toLowerCase() === selectedSymbol.toLowerCase()
    );
  }, [selectedSymbol, coin.coinList]);

  const handleOrder = async () => {
    const jwt = auth.jwt || localStorage.getItem("jwt");
    
    if (!jwt) {
      toast({
        title: "Authentication Required",
        description: "Please login to place orders.",
        variant: "destructive"
      });
      return;
    }

    if (!currentCoin) {
      console.error("Coin not found in list for symbol:", selectedSymbol, coin.coinList);
      toast({
        title: "Market Error",
        description: `Market ${selectedSymbol} not found in database. Try refreshing.`,
        variant: "destructive"
      });
      // Try to fetch list if empty
      if (coin.coinList.length === 0) {
          dispatch(getUserWallet(jwt));
      }
      return;
    }

    if (!quantity || parseFloat(quantity) <= 0) {
      toast({
        title: "Invalid Quantity",
        description: "Please enter a valid amount to trade.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const orderData = {
        coinId: currentCoin.id,
        quantity: parseFloat(quantity),
        orderType: side // BUY or SELL
      };
      
      console.log("Placing order:", orderData);
      await dispatch(payOrder({ jwt, orderData }));
      
      // Re-fetch data to update UI
      setTimeout(() => {
        dispatch(getUserWallet(jwt));
        dispatch(getUserAssets(jwt));
        dispatch(getAllOrdersForUser({ jwt }));
      }, 500);
      
      setQuantity('');
      toast({
        title: "Order Placed",
        description: `${side} ${quantity} ${selectedSymbol} order executed successfully.`,
        className: "bg-bg-surface border-buy text-buy font-bold"
      });

    } catch (error) {
      console.error("Order error:", error);
      toast({
        title: "Order Failed",
        description: error.message || "Something went wrong while placing your order.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const setQuantityByPercentage = (percent) => {
    if (!currentPrice) return;
    const available = side === 'BUY' 
      ? (auth.isDemoMode ? (wallet.userWallet?.demoBalance || 0) : (wallet.userWallet?.balance || 0)) 
      : (coin.coinDetails?.quantity || 100); 
    
    const maxQty = side === 'BUY' ? (available * leverage) / currentPrice : available;
    setQuantity((maxQty * percent).toFixed(4));

  };

  return (
    <div className="flex flex-col h-full bg-bg-surface select-none font-inter">
      {/* Side Selector */}
      <div className="flex p-2 gap-2 border-b border-border-dim/50">
        <Button
          onClick={() => setSide('BUY')}
          className={`flex-1 h-9 rounded-sm font-bold transition-all ${
            side === 'BUY' 
              ? 'bg-buy text-white hover:bg-buy/90' 
              : 'bg-bg-elevated text-text-muted hover:text-text-primary'
          }`}
        >
          BUY
        </Button>
        <Button
          onClick={() => setSide('SELL')}
          className={`flex-1 h-9 rounded-sm font-bold transition-all ${
            side === 'SELL' 
              ? 'bg-sell text-white hover:bg-sell/90' 
              : 'bg-bg-elevated text-text-muted hover:text-text-primary'
          }`}
        >
          SELL
        </Button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-4 flex flex-col gap-4 scrollbar-thin">

        {/* Order Type Toggle */}
        <div className="flex bg-bg-base p-0.5 rounded-sm">
          {['LIMIT', 'MARKET'].map(type => (
            <button
              key={type}
              onClick={() => setOrderType(type)}
              className={`flex-1 py-1 text-[11px] font-medium rounded-sm transition-colors ${
                orderType === type ? 'bg-bg-elevated text-text-primary shadow-sm' : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Inputs */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] text-text-muted font-medium">Price</label>
          <div className="relative">
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={orderType === 'MARKET'}
              className="bg-bg-base border-border-dim text-text-primary font-mono text-[13px] h-9"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-text-muted">USDT</span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] text-text-muted font-medium">Quantity</label>
          <div className="relative">
            <Input
              type="number"
              placeholder="0.00"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="bg-bg-base border-border-dim text-text-primary font-mono text-[13px] h-9"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-text-muted">
              {selectedSymbol.replace('USDT', '')}
            </span>
          </div>
        </div>

        {/* Percentage Buttons */}
        <div className="grid grid-cols-4 gap-1.5">
          {[0.25, 0.5, 0.75, 1].map(p => (
            <button
              key={p}
              onClick={() => setQuantityByPercentage(p)}
              className="bg-bg-base hover:bg-bg-elevated border border-border-dim py-1 text-[10px] text-text-secondary rounded-sm transition-colors"
            >
              {p * 100}%
            </button>
          ))}
        </div>

        {/* Leverage Slider (Visual only for now) */}
        <div className="flex flex-col gap-1.5 mt-2">
          <div className="flex justify-between items-center">
            <label className="text-[11px] text-text-muted font-medium">Leverage</label>
            <span className="text-[11px] text-accent font-bold">{leverage}x</span>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            value={leverage}
            onChange={(e) => setLeverage(parseInt(e.target.value))}
            className="w-full accent-accent h-1.5 bg-bg-base rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-2 py-3 border-y border-border-dim/30 mt-2">
          <div className="flex justify-between text-[11px]">
            <span className="text-text-muted">Available</span>
            <div className="flex items-center gap-1">
              <WalletIcon size={10} className="text-accent" />
              <span className="text-text-primary font-mono">
                {auth.isDemoMode 
                    ? (wallet.userWallet?.demoBalance ? formatPrice(wallet.userWallet.demoBalance) : '0.00') 
                    : (wallet.userWallet?.balance ? formatPrice(wallet.userWallet.balance) : '0.00')
                } USDT
              </span>
            </div>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-text-muted">Cost</span>
            <span className="text-text-primary font-mono">{formatPrice(total)} USDT</span>
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={handleOrder}
          disabled={isSubmitting}
          className={`w-full h-11 text-[15px] font-bold mt-2 shadow-lg transition-all ${
            side === 'BUY' 
              ? 'bg-buy hover:bg-buy/90 text-white' 
              : 'bg-sell hover:bg-sell/90 text-white'
          }`}
        >
          {isSubmitting ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            `${side} ${selectedSymbol.replace('USDT', '')}`
          )}
        </Button>
      </div>
    </div>
  );
};

export default OrderEntry;
