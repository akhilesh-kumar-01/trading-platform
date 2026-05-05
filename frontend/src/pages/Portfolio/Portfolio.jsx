import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserAssets } from "@/Redux/Assets/Action";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  History, 
  PieChart, 
  ArrowUpRight 
} from "lucide-react";
import TradingHistory from "./TradingHistory";
import { formatPrice, formatChange } from "@/lib/formatters";

const Portfolio = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = useState("portfolio");
  const { asset, auth } = useSelector((store) => store);

  useEffect(() => {
    dispatch(getUserAssets(localStorage.getItem("jwt") || auth.jwt));
  }, [dispatch, auth.jwt]);

  const totalValue = useMemo(() => {
    return asset.userAssets?.reduce((acc, item) => {
      return acc + (item.coin.current_price * item.quantity);
    }, 0) || 0;
  }, [asset.userAssets]);

  const totalPnL = useMemo(() => {
    return asset.userAssets?.reduce((acc, item) => {
      const currentVal = item.coin.current_price * item.quantity;
      const entryVal = item.buyPrice * item.quantity;
      return acc + (currentVal - entryVal);
    }, 0) || 0;
  }, [asset.userAssets]);

  const pnlPercentage = useMemo(() => {
    const entryTotal = asset.userAssets?.reduce((acc, item) => acc + (item.buyPrice * item.quantity), 0) || 0;
    if (entryTotal === 0) return 0;
    return (totalPnL / entryTotal) * 100;
  }, [totalPnL, asset.userAssets]);

  return (
    <div className="min-h-screen bg-bg-base text-text-primary font-inter px-4 sm:px-10 py-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-2xl font-bold mb-6">Asset Portfolio</h1>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-bg-surface border border-border-dim p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 text-text-muted mb-2">
              <Wallet size={16} className="text-accent" />
              <span className="text-xs font-medium uppercase tracking-wider">Total Equity</span>
            </div>
            <div className="text-3xl font-mono font-bold">
              {formatPrice(totalValue)} <span className="text-sm text-text-secondary">USDT</span>
            </div>
          </div>

          <div className="bg-bg-surface border border-border-dim p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 text-text-muted mb-2">
              <TrendingUp size={16} className={totalPnL >= 0 ? "text-buy" : "text-sell"} />
              <span className="text-xs font-medium uppercase tracking-wider">Total Profit / Loss</span>
            </div>
            <div className={`text-3xl font-mono font-bold ${totalPnL >= 0 ? "text-buy" : "text-sell"}`}>
              {totalPnL >= 0 ? "+" : ""}{formatPrice(totalPnL)}
              <span className="text-sm ml-2">({pnlPercentage.toFixed(2)}%)</span>
            </div>
          </div>

          <div className="bg-bg-surface border border-border-dim p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 text-text-muted mb-2">
              <PieChart size={16} className="text-purple-500" />
              <span className="text-xs font-medium uppercase tracking-wider">Asset Count</span>
            </div>
            <div className="text-3xl font-mono font-bold">
              {asset.userAssets?.length || 0} <span className="text-sm text-text-secondary">Holdings</span>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-bg-surface border border-border-dim p-1 rounded-lg w-fit mb-6">
          <Button
            onClick={() => setCurrentTab("portfolio")}
            variant="ghost"
            className={`h-9 px-6 rounded-md transition-all ${
              currentTab === "portfolio" 
                ? "bg-bg-elevated text-text-primary shadow-sm" 
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <PieChart size={14} className="mr-2" />
            Holdings
          </Button>
          <Button
            onClick={() => setCurrentTab("history")}
            variant="ghost"
            className={`h-9 px-6 rounded-md transition-all ${
              currentTab === "history" 
                ? "bg-bg-elevated text-text-primary shadow-sm" 
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <History size={14} className="mr-2" />
            History
          </Button>
        </div>

        {/* Main Content */}
        <div className="bg-bg-surface border border-border-dim rounded-xl overflow-hidden shadow-sm">
          {currentTab === "portfolio" ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-bg-elevated/30 border-b border-border-dim">
                    <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Asset</th>
                    <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider text-right">Price</th>
                    <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider text-right">Balance</th>
                    <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider text-right">24h Change</th>
                    <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider text-right">Equity Value</th>
                    <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-dim/30">
                  {asset.userAssets?.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-20 text-center text-text-muted">
                        No assets found. Start trading to see them here.
                      </td>
                    </tr>
                  ) : (
                    asset.userAssets?.map((item) => (
                      <tr 
                        key={item.id}
                        className="group hover:bg-bg-elevated/20 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 border border-border-dim">
                              <AvatarImage src={item.coin.image} />
                              <AvatarFallback>{item.coin.symbol[0].toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-bold text-text-primary">{item.coin.name}</span>
                              <span className="text-[10px] text-text-muted uppercase">{item.coin.symbol}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right font-mono font-medium">
                          {formatPrice(item.coin.current_price)}
                        </td>
                        <td className="px-6 py-4 text-right font-mono">
                          {item.quantity.toFixed(4)}
                        </td>
                        <td className={`px-6 py-4 text-right font-mono font-medium ${item.coin.price_change_percentage_24h >= 0 ? "text-buy" : "text-sell"}`}>
                          {formatChange(item.coin.price_change_percentage_24h)}
                        </td>
                        <td className="px-6 py-4 text-right font-mono font-bold text-text-primary">
                          {formatPrice(item.coin.current_price * item.quantity)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button
                            onClick={() => navigate(`/market/${item.coin.id}`)}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-text-muted hover:text-accent hover:bg-accent/10"
                          >
                            <ArrowUpRight size={16} />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-1">
              <TradingHistory />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
