import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersForUser } from "@/Redux/Order/Action";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatPrice } from "@/lib/formatters";
import { Loader2 } from "lucide-react";

const TradingHistory = () => {
  const dispatch = useDispatch();
  const { order, auth } = useSelector((store) => store);

  useEffect(() => {
    dispatch(getAllOrdersForUser({ jwt: localStorage.getItem("jwt") || auth.jwt }));
  }, [dispatch, auth.jwt]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return {
      full: date.toLocaleString(),
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const calculatePnL = (item) => {
    if (item.orderType === "BUY") return null;
    const sellPrice = item.orderItem.sellPrice;
    const buyPrice = item.orderItem.buyPrice;
    const qty = item.orderItem.quantity;
    return (sellPrice - buyPrice) * qty;
  };

  if (order.loading) {
    return <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-accent h-8 w-8" /></div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-[11px] sm:text-[13px] font-inter">
        <thead>
          <tr className="bg-bg-elevated/30 border-b border-border-dim text-text-muted uppercase text-[10px] font-bold tracking-wider">
            <th className="px-6 py-4">Timestamp</th>
            <th className="px-6 py-4">Market</th>
            <th className="px-6 py-4">Side</th>
            <th className="px-6 py-4 text-right">Execution Price</th>
            <th className="px-6 py-4 text-right">Quantity</th>
            <th className="px-6 py-4 text-right">PnL</th>
            <th className="px-6 py-4 text-right">Total (USDT)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-dim/30">
          {order.orders?.length === 0 ? (
            <tr>
              <td colSpan="7" className="px-6 py-20 text-center text-text-muted">
                No trading history found.
              </td>
            </tr>
          ) : (
            [...order.orders].reverse().map((item) => {
              const dt = formatDate(item.timestamp);
              const pnl = calculatePnL(item);
              const executionPrice = item.orderType === "BUY" ? item.orderItem.buyPrice : item.orderItem.sellPrice;

              return (
                <tr key={item.id} className="group hover:bg-bg-elevated/10 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-text-primary font-medium">{dt.date}</span>
                      <span className="text-[10px] text-text-muted">{dt.time}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6 border border-border-dim">
                        <AvatarImage src={item.orderItem.coin.image} />
                        <AvatarFallback>{item.orderItem.coin.symbol[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="font-bold text-text-primary uppercase">{item.orderItem.coin.symbol}/USDT</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold ${
                      item.orderType === "BUY" ? "bg-buy/10 text-buy" : "bg-sell/10 text-sell"
                    }`}>
                      {item.orderType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono">
                    {formatPrice(executionPrice)}
                  </td>
                  <td className="px-6 py-4 text-right font-mono">
                    {item.orderItem.quantity.toFixed(4)}
                  </td>
                  <td className={`px-6 py-4 text-right font-mono font-bold ${pnl >= 0 ? "text-buy" : "text-sell"}`}>
                    {pnl !== null ? `${pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}` : "-"}
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-text-primary">
                    {formatPrice(item.price)}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TradingHistory;
