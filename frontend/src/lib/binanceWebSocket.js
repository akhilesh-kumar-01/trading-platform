class BinanceWebSocketManager {
  constructor(dispatch, actions) {
    this.dispatch = dispatch;
    this.actions = actions;
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectDelay = 30000;
    this.reconnectTimer = null;
    this.isIntentionalClose = false;
    this.pendingSymbol = 'btcusdt';
    this.pendingInterval = '1h';
    this.rafBatch = null;
    this.pendingDispatches = {};
  }

  connect(symbol = 'btcusdt', interval = '1h') {
    this.pendingSymbol = symbol;
    this.pendingInterval = interval;
    
    const streams = [
      '!miniTicker@arr',
      `${symbol}@depth20@100ms`,
      `${symbol}@trade`,
      `${symbol}@kline_${interval}`
    ].join('/');
    
    const url = `wss://stream.binance.com:9443/stream?streams=${streams}`;
    
    if (this.ws) {
      this.ws.close();
    }

    this.ws = new WebSocket(url);
    this.dispatch(this.actions.setConnectionStatus('connecting'));

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.dispatch(this.actions.setConnectionStatus('connected'));
    };

    this.ws.onmessage = (event) => {
      this.handleMessage(JSON.parse(event.data));
    };

    this.ws.onerror = () => {
      this.dispatch(this.actions.setConnectionStatus('reconnecting'));
    };

    this.ws.onclose = () => {
      if (!this.isIntentionalClose) {
        this.scheduleReconnect();
      }
    };
  }

  handleMessage(data) {
    const stream = data.stream;
    const payload = data.data;

    if (stream === '!miniTicker@arr') {
      this.pendingDispatches.tickers = payload;
    } else if (stream.includes('@depth20')) {
      this.pendingDispatches.orderBook = {
        bids: payload.bids.slice(0, 20),
        asks: payload.asks.slice(0, 20)
      };
    } else if (stream.includes('@trade')) {
      if (!this.pendingDispatches.trades) {
        this.pendingDispatches.trades = [];
      }
      this.pendingDispatches.trades.push({
        price: payload.p,
        qty: payload.q,
        isBuyerMaker: payload.m,
        time: payload.T
      });
    } else if (stream.includes('@kline')) {
      this.pendingDispatches.kline = payload.k;
    }

    if (!this.rafBatch) {
      this.rafBatch = requestAnimationFrame(() => {
        this.flushDispatches();
        this.rafBatch = null;
      });
    }
  }

  flushDispatches() {
    const pending = this.pendingDispatches;
    this.pendingDispatches = {};

    if (pending.tickers) this.dispatch(this.actions.updateTickers(pending.tickers));
    if (pending.orderBook) this.dispatch(this.actions.updateOrderBook(pending.orderBook));
    if (pending.trades) this.dispatch(this.actions.addTrades(pending.trades));
    if (pending.kline) this.dispatch(this.actions.updateKline(pending.kline));
  }

  changeSymbol(newSymbol, interval = '1h') {
    this.isIntentionalClose = true;
    if (this.ws) {
      this.ws.close();
    }
    this.isIntentionalClose = false;
    
    this.dispatch(this.actions.clearSymbolData());
    
    setTimeout(() => this.connect(newSymbol.toLowerCase(), interval), 100);
  }

  changeInterval(symbol, newInterval) {
    this.changeSymbol(symbol, newInterval);
  }

  scheduleReconnect() {
    const delay = Math.min(
      1000 * Math.pow(2, this.reconnectAttempts),
      this.maxReconnectDelay
    );
    this.reconnectAttempts++;
    
    this.dispatch(this.actions.setConnectionStatus('reconnecting'));
    
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => {
      this.connect(this.pendingSymbol, this.pendingInterval);
    }, delay);
  }

  disconnect() {
    this.isIntentionalClose = true;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.rafBatch) cancelAnimationFrame(this.rafBatch);
    if (this.ws) this.ws.close();
    this.dispatch(this.actions.setConnectionStatus('disconnected'));
  }
}

export default BinanceWebSocketManager;
