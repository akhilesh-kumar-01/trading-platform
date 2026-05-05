import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { 
  SunIcon, 
  MoonIcon, 
  BellIcon, 
  MenuIcon, 
  UserIcon, 
  LogOutIcon, 
  WalletIcon, 
  LayoutDashboardIcon,
  CircleIcon,
  ChevronDownIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import { logout, toggleDemoMode } from "@/Redux/Auth/Action";
import { useWebSocket } from "@/hooks/useWebSocket";

const SYMBOLS_TO_SHOW = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'XRPUSDT', 'DOGEUSDT', 'ADAUSDT', 'AVAXUSDT'];

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { auth } = useSelector((store) => store);
  const { tickers, connectionStatus } = useWebSocket();

  const [theme, setTheme] = useState(localStorage.getItem("zos-theme") || "dark");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("zos-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleToggleDemoMode = () => {
    dispatch(toggleDemoMode(localStorage.getItem("jwt") || auth.jwt));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const navLinks = [
    { name: "Markets", path: "/" },
    { name: "Trade", path: "/trade" },
    { name: "Demo Trading", path: "/demo" },
    { name: "Options", path: "/options" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "Wallet", path: "/wallet" },
  ];


  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-buy';
      case 'reconnecting': return 'bg-yellow-500';
      default: return 'bg-sell';
    }
  };

  const getStatusLabel = () => {
    switch (connectionStatus) {
      case 'connected': return 'Live';
      case 'reconnecting': return 'Reconnecting...';
      default: return 'Disconnected';
    }
  };

  return (
    <nav className="h-[48px] sticky top-0 z-50 w-full bg-bg-surface border-b border-border-dim px-4 flex items-center justify-between font-inter">
      {/* LEFT SECTION */}
      <div className="flex items-center gap-6 flex-shrink-0">
        {/* Logo */}
        <div 
          onClick={() => navigate("/trade")}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className={`w-2 h-2 rounded-full ${getStatusColor()} ${connectionStatus !== 'disconnected' ? 'pulse-green' : ''} mr-1`} />
          <span className="font-mono font-bold text-[20px] text-accent tracking-tighter">ZOS</span>
          <span className="text-[13px] text-text-primary font-bold hidden sm:inline">Trading</span>
        </div>

        {/* Nav Links - Desktop */}
        <div className="hidden md:flex items-center">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => 
                `px-3 h-[48px] flex items-center text-[13px] font-medium transition-colors duration-150 border-b-2 ${
                  isActive 
                    ? "text-text-primary border-accent" 
                    : "text-text-secondary border-transparent hover:text-text-primary"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Mobile Menu Trigger */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-text-secondary">
                <MenuIcon className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-bg-surface border-r-border-dim p-0">
              <SheetHeader className="p-4 border-b border-border-dim">
                <SheetTitle className="text-left flex items-center gap-2">
                  <span className="font-mono font-bold text-xl text-accent">ZOS</span>
                  <span className="text-sm text-text-secondary font-medium">Trading</span>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col py-4">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.path}>
                    <NavLink
                      to={link.path}
                      className={({ isActive }) => 
                        `px-6 py-4 text-sm font-medium border-l-4 ${
                          isActive 
                            ? "bg-bg-elevated text-text-primary border-accent" 
                            : "text-text-secondary border-transparent hover:bg-bg-elevated"
                        }`
                      }
                    >
                      {link.name}
                    </NavLink>
                  </SheetClose>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* CENTER SECTION - Ticker Bar */}
      <div className="flex-1 mx-4 overflow-hidden ticker-mask relative h-full flex items-center">
        <div className="flex whitespace-nowrap animate-ticker h-full items-center">
          {/* Use real data from tickers object */}
          {[...SYMBOLS_TO_SHOW, ...SYMBOLS_TO_SHOW].map((symbol, idx) => {
            const data = tickers[symbol];
            return (
              <div key={idx} className="inline-flex items-center gap-2 px-6 h-full border-r border-border-dim/30">
                <span className="text-[11px] text-text-secondary font-medium">{symbol.replace('USDT', '')}</span>
                <span className="text-[12px] text-text-primary font-mono font-medium">
                  {data ? `$${data.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '---'}
                </span>
                {data && (
                  <span className={`text-[11px] font-medium ${data.change24h >= 0 ? 'text-buy' : 'text-sell'}`}>
                    {data.change24h >= 0 ? '+' : ''}{data.change24h.toFixed(2)}%
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Connection Status Tooltip */}
        <div className="hidden sm:flex items-center px-2 group relative">
          <div className={`w-2 h-2 rounded-full ${getStatusColor()} ${connectionStatus !== 'disconnected' ? (connectionStatus === 'reconnecting' ? 'pulse-yellow' : 'pulse-green') : ''}`} />
          <div className="absolute top-10 right-0 scale-0 group-hover:scale-100 transition-transform bg-bg-elevated text-[10px] text-text-primary px-2 py-1 rounded border border-border-dim whitespace-nowrap z-[60]">
            {getStatusLabel()}
          </div>
        </div>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-bg-elevated relative">
              <BellIcon className="h-4 w-4 text-text-secondary" />
              <div className="absolute top-1 right-1 w-2 h-2 bg-sell rounded-full border border-bg-bg-surface" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 bg-bg-surface border-border-dim text-text-primary">
            <DropdownMenuLabel className="text-xs text-text-secondary px-4 py-2 border-b border-border-dim">Notifications</DropdownMenuLabel>
            <DropdownMenuItem className="px-4 py-3 cursor-default hover:bg-bg-elevated focus:bg-bg-elevated">
              <div className="flex flex-col gap-1">
                <p className="text-[13px]">Welcome to ZOS Trading 🎉</p>
                <p className="text-[11px] text-text-secondary">Start your derivative journey today.</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Demo Mode Toggle */}
        <div 
          onClick={handleToggleDemoMode}
          className="hidden sm:flex items-center gap-2 px-2 py-1 rounded bg-bg-elevated/50 border border-border-dim/50 ml-2 cursor-pointer hover:bg-bg-elevated transition-colors"
        >
          <span className={`text-[10px] font-bold uppercase ${auth.isDemoMode ? 'text-accent' : 'text-text-muted'}`}>
            {auth.isDemoMode ? 'Demo' : 'Live'}
          </span>
          <div className={`w-6 h-3 rounded-full p-0.5 transition-colors duration-200 ${auth.isDemoMode ? 'bg-accent' : 'bg-gray-600'}`}>
            <div className={`w-2 h-2 rounded-full bg-white transition-transform duration-200 transform ${auth.isDemoMode ? 'translate-x-3' : 'translate-x-0'}`} />
          </div>
        </div>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-8 w-8 rounded-full hover:bg-bg-elevated"
        >
          {theme === "dark" ? (
            <SunIcon className="h-4 w-4 text-yellow-500" />
          ) : (
            <MoonIcon className="h-4 w-4 text-slate-500" />
          )}
        </Button>

        {/* User / Login */}
        {auth.user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-1 cursor-pointer hover:bg-bg-elevated px-2 py-1 rounded transition-colors">
                <Avatar className="h-7 w-7 border border-border-dim">
                  <AvatarImage src={auth.user.profileImage} />
                  <AvatarFallback className="bg-accent text-white text-[10px]">
                    {auth.user.fullName[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <ChevronDownIcon className="h-3 w-3 text-text-secondary" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-bg-surface border-border-dim text-text-primary">
              <DropdownMenuItem onClick={() => navigate("/profile")} className="gap-2 py-2 cursor-pointer focus:bg-bg-elevated">
                <UserIcon className="h-4 w-4 text-text-secondary" />
                <span className="text-[13px]">My Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/portfolio")} className="gap-2 py-2 cursor-pointer focus:bg-bg-elevated">
                <LayoutDashboardIcon className="h-4 w-4 text-text-secondary" />
                <span className="text-[13px]">Portfolio</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/wallet")} className="gap-2 py-2 cursor-pointer focus:bg-bg-elevated">
                <WalletIcon className="h-4 w-4 text-text-secondary" />
                <span className="text-[13px]">Wallet</span>
              </DropdownMenuItem>
              {auth.user.role === "ROLE_ADMIN" && (
                <>
                  <DropdownMenuSeparator className="bg-border-dim" />
                  <DropdownMenuItem onClick={() => navigate("/admin/withdrawal")} className="gap-2 py-2 cursor-pointer focus:bg-bg-elevated">
                    <span className="text-[13px] font-medium text-accent">Admin Panel</span>
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator className="bg-border-dim" />
              <DropdownMenuItem onClick={handleLogout} className="gap-2 py-2 cursor-pointer focus:bg-bg-elevated text-sell">
                <LogOutIcon className="h-4 w-4" />
                <span className="text-[13px]">Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button 
            onClick={() => navigate("/signin")}
            size="sm" 
            className="h-8 bg-accent hover:bg-accent/90 text-white rounded px-4 text-[13px]"
          >
            Login
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
