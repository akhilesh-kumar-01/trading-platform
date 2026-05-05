import { useSelector, useDispatch } from "react-redux";
import { setSelectedSymbol, setSelectedInterval } from "@/Redux/WebSocket/WebSocketSlice";

export function useWebSocket() {
  const dispatch = useDispatch();
  const tickers = useSelector(state => state.webSocket.tickers);
  const orderBook = useSelector(state => state.webSocket.orderBook);
  const recentTrades = useSelector(state => state.webSocket.recentTrades);
  const klineUpdate = useSelector(state => state.webSocket.klineUpdate);
  const selectedSymbol = useSelector(state => state.webSocket.selectedSymbol);
  const selectedInterval = useSelector(state => state.webSocket.selectedInterval);
  const connectionStatus = useSelector(state => state.webSocket.connectionStatus);
  
  const changeSymbol = (symbol) => {
    window.wsManager?.changeSymbol(symbol.toLowerCase(), selectedInterval);
    dispatch(setSelectedSymbol(symbol));
  };
  
  const changeInterval = (interval) => {
    window.wsManager?.changeInterval(selectedSymbol.toLowerCase(), interval);
    dispatch(setSelectedInterval(interval));
  };
  
  return { 
    tickers, 
    orderBook, 
    recentTrades, 
    klineUpdate,
    selectedSymbol, 
    selectedInterval, 
    connectionStatus,
    changeSymbol, 
    changeInterval 
  };
}
