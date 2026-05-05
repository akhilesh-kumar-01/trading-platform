import Navbar from "./pages/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Portfolio from "./pages/Portfolio/Portfolio";
import Auth from "./pages/Auth/Auth";
import { Route, Routes, useLocation } from "react-router-dom";
import StockDetails from "./pages/StockDetails/StockDetails";
import Profile from "./pages/Profile/Profile";
import Notfound from "./pages/Notfound/Notfound";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getUser } from "./Redux/Auth/Action";
import Wallet from "./pages/Wallet/Wallet";
import Watchlist from "./pages/Watchlist/Watchlist";
import TwoFactorAuth from "./pages/Auth/TwoFactorAuth";
import ResetPasswordForm from "./pages/Auth/ResetPassword";
import PasswordUpdateSuccess from "./pages/Auth/PasswordUpdateSuccess";
import LoginWithGoogle from "./pages/Auth/LoginWithGoogle.";
import PaymentSuccess from "./pages/Wallet/PaymentSuccess";
import Withdrawal from "./pages/Wallet/Withdrawal";
import PaymentDetails from "./pages/Wallet/PaymentDetails";
import WithdrawalAdmin from "./Admin/Withdrawal/WithdrawalAdmin";
import Activity from "./pages/Activity/Activity";
import SearchCoin from "./pages/Search/Search";
import { shouldShowNavbar } from "./Util/shouldShowNavbar";
import BinanceWebSocketManager from "./lib/binanceWebSocket";
import * as webSocketActions from "./Redux/WebSocket/WebSocketSlice";
import TradingTerminal from "./pages/TradingTerminal";
import LoginSuccess from "./pages/Auth/LoginSuccess";
import DemoTrading from "./pages/Demo/DemoTrading";
import DemoTradingTerminal from "./pages/Demo/DemoTradingTerminal";
import OptionsChain from "./pages/Options/OptionsChain";



const routes = [
  { path: "/", role: "ROLE_USER" },
  { path: "/portfolio", role: "ROLE_USER" },
  { path: "/activity", role: "ROLE_USER" },
  { path: "/wallet", role: "ROLE_USER" },
  { path: "/withdrawal", role: "ROLE_USER" },
  { path: "/payment-details", role: "ROLE_USER" },
  { path: "/wallet/success", role: "ROLE_USER" },
  { path: "/market/:id", role: "ROLE_USER" },
  { path: "/watchlist", role: "ROLE_USER" },
  { path: "/profile", role: "ROLE_USER" },
  { path: "/search", role: "ROLE_USER" },
  { path: "/trade", role: "ROLE_USER" },
  { path: "/demo-trading", role: "ROLE_USER" },
  { path: "/demo", role: "ROLE_USER" },
  { path: "/options", role: "ROLE_USER" },

  { path: "/admin/withdrawal", role: "ROLE_ADMIN" }
];

function App() {
  const {auth}=useSelector(store=>store);
  const dispatch=useDispatch();
  const location = useLocation();

  useEffect(() => {
    const wsManager = new BinanceWebSocketManager(dispatch, webSocketActions);
    wsManager.connect('btcusdt', '1h');
    window.wsManager = wsManager;
    
    return () => {
      wsManager.disconnect();
    };
  }, [dispatch]);

  useEffect(()=>{
    dispatch(getUser(localStorage.getItem("jwt")))
  },[auth.jwt, dispatch])

  const showNavbar=!auth.user?false:shouldShowNavbar(location.pathname,routes,auth.user?.role)

  return (
    <>
      {" "}
      {auth.user ? (
        <div className={auth.isDemoMode ? "demo-mode-border min-h-screen" : ""}>
         {showNavbar && <Navbar />}
          <Routes>
            <Route element={<Home />} path="/" />
            
            <Route element={<Portfolio />} path="/portfolio" />
            <Route element={<Activity />} path="/activity" />
            <Route element={<Wallet />} path="/wallet" />
            <Route element={<Withdrawal />} path="/withdrawal" />
            <Route element={<PaymentDetails />} path="/payment-details" />
            <Route element={<Wallet />} path="/wallet/:order_id" />
            <Route element={<StockDetails />} path="/market/:id" />
            <Route element={<Watchlist />} path="/watchlist" />
            <Route element={<Profile />} path="/profile" />
            <Route element={<SearchCoin />} path="/search" />
            <Route element={<TradingTerminal />} path="/trade" />
            <Route element={<DemoTrading />} path="/demo-trading" />
            <Route element={<DemoTradingTerminal />} path="/demo" />
            <Route element={<OptionsChain />} path="/options" />

            {auth.user.role=="ROLE_ADMIN"&&<Route element={<WithdrawalAdmin />} path="/admin/withdrawal" />}
            <Route element={<Notfound />} path="*" />
            
          </Routes>
        </div>
      ) : (
        <>
          <Routes>
            <Route element={<Auth />} path="/" />
            <Route element={<Auth />} path="/signup" />
            <Route element={<Auth />} path="/signin" />
            <Route element={<Auth />} path="/forgot-password" />
            <Route element={<LoginWithGoogle />} path="/login-with-google" />
            <Route element={<ResetPasswordForm />} path="/reset-password/:session" />
            <Route element={<PasswordUpdateSuccess />} path="/password-update-successfully" />
            <Route element={<TwoFactorAuth />} path="/two-factor-auth/:session" />
            <Route element={<LoginSuccess />} path="/login-success" />
            <Route element={<Notfound />} path="*" />
          </Routes>
        </>
      )}
    </>
  );
}

export default App;

