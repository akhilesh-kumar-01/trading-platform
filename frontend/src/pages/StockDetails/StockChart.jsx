import React from "react";
import TradingChart from "../../components/TradingChart";

const toBinanceSymbol = (coinId) => {
  const map = {
    'bitcoin':        'BTCUSDT',
    'ethereum':       'ETHUSDT',
    'solana':         'SOLUSDT',
    'binancecoin':    'BNBUSDT',
    'ripple':         'XRPUSDT',
    'dogecoin':       'DOGEUSDT',
    'cardano':        'ADAUSDT',
    'avalanche-2':    'AVAXUSDT',
    'chainlink':      'LINKUSDT',
    'polkadot':       'DOTUSDT',
    'matic-network':  'MATICUSDT',
    'uniswap':        'UNIUSDT',
  }
  return map[coinId] ?? coinId.toUpperCase() + 'USDT';
}

const StockChart = ({ coinId }) => {
  return (
    <div className="w-full">
      <TradingChart 
        symbol={toBinanceSymbol(coinId)}
        height={450}
        showToolbar={true}
      />
    </div>
  );
};

export default StockChart;
