import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tickers: {},        
  // { 'BTCUSDT': { price, change24h, high, low, volume }, ... }
  
  orderBook: {
    bids: [],         // [[price, qty], ...]
    asks: []          // [[price, qty], ...]
  },
  
  recentTrades: [],   
  // [{ price, qty, isBuyerMaker, time }, ...]
  
  klineUpdate: null,  
  // { o,h,l,c,v,t, x }
  
  selectedSymbol: 'BTCUSDT',   
  selectedInterval: '1h',
  connectionStatus: 'disconnected'  // 'connecting'|'connected'|'reconnecting'|'disconnected'
};

const webSocketSlice = createSlice({
  name: "webSocket",
  initialState,
  reducers: {
    updateTickers: (state, action) => {
      action.payload.forEach(ticker => {
        const current = parseFloat(ticker.c);
        const open = parseFloat(ticker.o);
        const change = open !== 0 ? ((current - open) / open) * 100 : 0;
        
        state.tickers[ticker.s] = {
          price: current,
          change24h: change,
          high: parseFloat(ticker.h),
          low: parseFloat(ticker.l),
          volume: parseFloat(ticker.v)
        };
      });
    },

    updateOrderBook: (state, action) => {
      state.orderBook = action.payload;
    },
    addTrades: (state, action) => {
      state.recentTrades = [
        ...action.payload.reverse(),
        ...state.recentTrades
      ].slice(0, 50);
    },
    updateKline: (state, action) => {
      state.klineUpdate = action.payload;
    },
    clearSymbolData: (state) => {
      state.orderBook = { bids: [], asks: [] };
      state.recentTrades = [];
      state.klineUpdate = null;
    },
    setSelectedSymbol: (state, action) => {
      state.selectedSymbol = action.payload.toUpperCase();
    },
    setSelectedInterval: (state, action) => {
      state.selectedInterval = action.payload;
    },
    setConnectionStatus: (state, action) => {
      state.connectionStatus = action.payload;
    }
  }
});

export const {
  updateTickers,
  updateOrderBook,
  addTrades,
  updateKline,
  clearSymbolData,
  setSelectedSymbol,
  setSelectedInterval,
  setConnectionStatus
} = webSocketSlice.actions;

export default webSocketSlice.reducer;
