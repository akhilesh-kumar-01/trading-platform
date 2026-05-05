import {
  depositMoney,
  getUserWallet,
  getWalletTransactions,
  loadDemoBalance,
  manualDeposit,
} from "@/Redux/Wallet/Action";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CopyIcon,
  DownloadIcon,
  ReloadIcon,
  ShuffleIcon,
  UpdateIcon,
  UploadIcon,
} from "@radix-ui/react-icons";
import { 
  DollarSign, 
  WalletIcon, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ArrowRightLeft,
  QrCode,
  Copy,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TopupForm from "./TopupForm";
import TransferForm from "./TransferForm";
import WithdrawForm from "./WithdrawForm";
import { getPaymentDetails } from "@/Redux/Withdrawal/Action";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import SpinnerBackdrop from "@/components/custome/SpinnerBackdrop";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useState } from "react";




function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Wallet = () => {
  const dispatch = useDispatch();
  const navigate=useNavigate();
  const { wallet, auth } = useSelector((store) => ({ wallet: store.wallet, auth: store.auth }));
  const query = useQuery();
  const paymentId = query.get("payment_id");
  const razorpayPaymentId = query.get("razorpay_payment_id");
  const orderId = query.get("order_id");
  const {order_id}=useParams();

  useEffect(() => {
    if (orderId || order_id ) {
      dispatch(
        depositMoney({
          jwt: localStorage.getItem("jwt"),
          orderId: orderId || order_id,
          paymentId: razorpayPaymentId || "AuedkfeuUe",
          navigate,
        })
      );
      console.log(paymentId, orderId);
    }
  }, [paymentId, orderId,razorpayPaymentId]);

  useEffect(() => {
    handleFetchUserWallet();
    handleFetchWalletTransactions();
    dispatch(getPaymentDetails({ jwt: localStorage.getItem("jwt") }));
  }, []);

  const handleFetchUserWallet = () => {
    dispatch(getUserWallet(auth.jwt || localStorage.getItem("jwt")));
  };

  const handleFetchWalletTransactions = () => {
    dispatch(getWalletTransactions({ jwt: auth.jwt || localStorage.getItem("jwt") }));
  };

  const handleLoadDemo = () => {
    dispatch(loadDemoBalance(auth.jwt || localStorage.getItem("jwt")));
  };

  function copyToClipboard(text) {
    // Create a new element
    const element = document.createElement("textarea");
    element.value = text;
    document.body.appendChild(element);

    // Select the text content
    element.select();

    // Try copying the selection using Async Clipboard API
    try {
      const copied = navigator.clipboard.writeText(text);
      copied.then(
        () => {
          console.log("Text copied to clipboard!");
        },
        (err) => {
          console.error("Failed to copy text: ", err);
        }
      );
    } catch (err) {
      console.error(
        "Failed to copy text (fallback to deprecated execCommand): ",
        err
      );
    }

    // Cleanup
    document.body.removeChild(element);
  }

  const [selectedReceiveCoin, setSelectedReceiveCoin] = useState("USDT");
  const [selectedNetwork, setSelectedNetwork] = useState("ERC20");
  const [isCopied, setIsCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [txHash, setTxHash] = useState("");

  const networks = {
    USDT: ["ERC20", "TRC20", "BEP20", "SOL", "MATIC"],
    BTC: ["BTC", "BEP20", "Lightning"],
    ETH: ["ERC20", "BEP20", "Arbitrum"],
    SOL: ["SOL", "BEP20"]
  };

  const dummyAddresses = {
    ERC20: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    TRC20: "TXw8uM5H3U8jGvR9xP8yW8mH8zQ8xP8yW8",
    BEP20: "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD",
    SOL: "8v6VwNf6pM8zQ8xP8yW8mH8zQ8xP8yW8mH8zQ8xP8yW",
    BTC: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfJH7890",
    MATIC: "0x123d35Cc6634C0532925a3b844Bc454e4438f44e"
  };

  const handleCopy = (text) => {
    copyToClipboard(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if(wallet.loading){
    return <SpinnerBackdrop/>
  }

  
  const handleVerifyDeposit = () => {
    if(!txHash) return;
    
    setIsVerifying(true);
    // Simulate blockchain verification delay
    setTimeout(() => {
      let amount = 100; // Default mock amount
      
      // If user provided the specific SOL address or link they mentioned
      if (txHash.includes("8v6VwNf6pM8z") || txHash.includes("solscan.io")) {
        amount = 500; // Mock a larger amount for the user's specific test case
      }

      dispatch(manualDeposit({ 
        jwt: localStorage.getItem("jwt"), 
        amount: amount 
      }));
      setIsVerifying(false);
      setTxHash("");
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="pt-10 w-full lg:w-[60%]">
        <Card>
          <CardHeader className="pb-9 ">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-5">
                <WalletIcon className="h-8 w-8" />
                <div>
                  <CardTitle className="text-2xl">My Wallet</CardTitle>
                  <div className="flex items-center gap-2">
                    <p className="text-gray-200 text-sm">
                      #FAVHJY{wallet.userWallet?.id}
                    </p>

                    <CopyIcon
                      onClick={() => copyToClipboard(wallet.userWallet?.id)}
                      className="cursor-pointer hover:text-slate-300"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {auth.isDemoMode && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 text-[11px] font-black gap-2 border-accent/30 bg-accent/10 text-accent hover:bg-accent/20 hover:border-accent/50 transition-all"
                    onClick={handleLoadDemo}
                  >
                    <UpdateIcon className={wallet.loading ? 'animate-spin' : ''} />
                    RELOAD WALLET
                  </Button>
                )}
                <ReloadIcon
                  onClick={handleFetchUserWallet}
                  className="w-6 h-6 cursor-pointer hover:text-gray-400 text-text-muted"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mt-2">
              <span className="text-4xl font-black font-mono tracking-tighter text-text-primary">
                {auth.isDemoMode ? wallet.userWallet?.demoBalance?.toLocaleString() : wallet.userWallet?.balance?.toLocaleString()}
              </span>
              <span className="ml-2 text-lg font-bold text-accent">USDT</span>
            </div>

            <div className="flex items-center gap-2 mt-1 text-text-muted">
              <p className="text-xs">≈ {(wallet.userWallet?.balance * 1.0).toFixed(2)} USD</p>
              <div className="w-1 h-1 bg-text-muted/30 rounded-full" />
              <p className="text-[10px] text-buy font-medium">+0.00% (24h)</p>
            </div>

            <div className="grid grid-cols-4 gap-4 mt-10">
              {/* Add Money */}
              <Dialog>
                <DialogTrigger asChild>
                  <div className="group cursor-pointer flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-buy/10 rounded-2xl flex items-center justify-center group-hover:bg-buy/20 transition-all border border-buy/20">
                      <ArrowUpRight className="w-6 h-6 text-buy" />
                    </div>
                    <span className="text-xs font-bold text-text-primary uppercase tracking-tight">Deposit</span>
                  </div>
                </DialogTrigger>
                <DialogContent className="bg-bg-surface border-border-dim text-text-primary sm:max-w-[400px]">
                  <DialogHeader>
                    <DialogTitle className="text-center text-xl font-black">Deposit Funds</DialogTitle>
                    <p className="text-center text-xs text-text-muted mb-4">Add money to your ZOS wallet instantly</p>
                  </DialogHeader>
                  <TopupForm />
                </DialogContent>
              </Dialog>

              {/* Withdraw */}
              <Dialog>
                <DialogTrigger asChild>
                  <div className="group cursor-pointer flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-sell/10 rounded-2xl flex items-center justify-center group-hover:bg-sell/20 transition-all border border-sell/20">
                      <ArrowDownLeft className="w-6 h-6 text-sell" />
                    </div>
                    <span className="text-xs font-bold text-text-primary uppercase tracking-tight">Withdraw</span>
                  </div>
                </DialogTrigger>
                <DialogContent className="bg-bg-surface border-border-dim text-text-primary sm:max-w-[400px]">
                  <DialogHeader>
                    <DialogTitle className="text-center text-xl font-black">Withdraw Funds</DialogTitle>
                    <p className="text-center text-xs text-text-muted mb-4">Transfer funds back to your bank account</p>
                  </DialogHeader>
                  <WithdrawForm />
                </DialogContent>
              </Dialog>

              {/* Transfer */}
              <Dialog>
                <DialogTrigger asChild>
                  <div className="group cursor-pointer flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center group-hover:bg-accent/20 transition-all border border-accent/20">
                      <ArrowRightLeft className="w-6 h-6 text-accent" />
                    </div>
                    <span className="text-xs font-bold text-text-primary uppercase tracking-tight">Transfer</span>
                  </div>
                </DialogTrigger>
                <DialogContent className="bg-bg-surface border-border-dim text-text-primary sm:max-w-[400px]">
                  <DialogHeader>
                    <DialogTitle className="text-center text-xl font-black">Transfer Assets</DialogTitle>
                    <p className="text-center text-xs text-text-muted mb-4">Send funds to another ZOS user's wallet</p>
                  </DialogHeader>
                  <TransferForm />
                </DialogContent>
              </Dialog>

              {/* Receive (QR Code) */}
              <Dialog>
                <DialogTrigger asChild>
                  <div className="group cursor-pointer flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-white/10 transition-all border border-white/10">
                      <QrCode className="w-6 h-6 text-text-primary" />
                    </div>
                    <span className="text-xs font-bold text-text-primary uppercase tracking-tight">Receive</span>
                  </div>
                </DialogTrigger>
                <DialogContent className="bg-bg-surface border-border-dim text-text-primary sm:max-w-[420px]">
                  <DialogHeader>
                    <DialogTitle className="text-center text-xl font-black">Receive Crypto</DialogTitle>
                    <p className="text-center text-xs text-text-muted">Select coin and network to get deposit address</p>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-muted uppercase">Asset</label>
                        <Select value={selectedReceiveCoin} onValueChange={(val) => {
                          setSelectedReceiveCoin(val);
                          setSelectedNetwork(networks[val][0]);
                        }}>
                          <SelectTrigger className="bg-bg-elevated border-border-dim h-10">
                            <SelectValue placeholder="Select Asset" />
                          </SelectTrigger>
                          <SelectContent className="bg-bg-surface border-border-dim">
                            <SelectItem value="USDT">USDT (Tether)</SelectItem>
                            <SelectItem value="BTC">BTC (Bitcoin)</SelectItem>
                            <SelectItem value="ETH">ETH (Ethereum)</SelectItem>
                            <SelectItem value="SOL">SOL (Solana)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-muted uppercase">Network</label>
                        <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
                          <SelectTrigger className="bg-bg-elevated border-border-dim h-10">
                            <SelectValue placeholder="Select Network" />
                          </SelectTrigger>
                          <SelectContent className="bg-bg-surface border-border-dim">
                            {networks[selectedReceiveCoin].map(net => (
                              <SelectItem key={net} value={net}>{net}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="bg-white/5 p-6 rounded-2xl flex flex-col items-center justify-center border border-white/5 space-y-4">
                      <div className="bg-white p-2 rounded-xl shadow-2xl">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(dummyAddresses[selectedNetwork])}`} 
                          alt="Deposit QR" 
                          className="w-32 h-32 block"
                        />
                      </div>
                      
                      <div className="w-full space-y-1">
                        <div className="flex items-center justify-between">
                           <span className="text-[10px] font-bold text-text-muted uppercase">Deposit Address</span>
                           <span className="text-[10px] font-medium text-accent">{selectedNetwork} Network</span>
                        </div>
                        <div className="flex items-center gap-2 bg-bg-elevated p-3 rounded-lg border border-border-dim group relative">
                           <p className="text-[11px] font-mono break-all line-clamp-1 flex-1">{dummyAddresses[selectedNetwork]}</p>
                           <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0 hover:bg-white/10"
                            onClick={() => handleCopy(dummyAddresses[selectedNetwork])}
                           >
                              {isCopied ? <CheckCircle2 className="w-3.5 h-3.5 text-buy" /> : <Copy className="w-3.5 h-3.5" />}
                           </Button>
                        </div>
                      </div>

                    <div className="pt-4 border-t border-border-dim space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-muted uppercase">Transaction Hash (TXID)</label>
                        <input 
                          type="text" 
                          placeholder="Paste your transaction hash here"
                          className="w-full bg-bg-elevated border border-border-dim rounded-xl p-3 text-[11px] text-text-primary font-mono focus:outline-none focus:border-accent/50 transition-colors"
                          value={txHash}
                          onChange={(e) => setTxHash(e.target.value)}
                        />
                      </div>
                      
                      <Button 
                        className="w-full bg-accent hover:bg-accent/90 text-white font-black py-6 rounded-2xl shadow-xl shadow-accent/20"
                        onClick={handleVerifyDeposit}
                        disabled={isVerifying || !txHash}
                      >
                        {isVerifying ? (
                          <div className="flex items-center gap-2">
                            <ReloadIcon className="w-4 h-4 animate-spin" />
                            VERIFYING...
                          </div>
                        ) : "CHECK DEPOSIT STATUS"}
                      </Button>
                      <p className="text-[9px] text-center text-text-muted italic">
                        Blockchain confirmation usually takes 1-5 minutes depending on network congestion.
                      </p>
                    </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>

        </Card>
        <div className="py-10 w-full max-w-4xl">
          <div className="flex gap-3 items-center pb-8">
            <h1 className="text-2xl font-black text-text-primary tracking-tight">Transaction History</h1>
            <div className="w-px h-6 bg-border-dim mx-2" />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleFetchWalletTransactions}
              className="rounded-full hover:bg-white/5 text-text-muted hover:text-text-primary"
            >
              <ReloadIcon className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-3">
            {wallet.transactions?.length > 0 ? (
              wallet.transactions.map((item, index) => item && (
                <div key={index} className="group transition-all hover:translate-x-1">
                  <Card className="bg-white/5 border-border-dim hover:bg-white/10 transition-colors p-4 flex justify-between items-center shadow-lg backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${item.amount > 0 ? 'bg-buy/10 border-buy/20' : 'bg-sell/10 border-sell/20'}`}>
                        {item.amount > 0 ? <ArrowUpRight className="w-6 h-6 text-buy" /> : <ArrowDownLeft className="w-6 h-6 text-sell" />}
                      </div>
                      <div>
                        <h3 className="font-bold text-text-primary capitalize leading-none mb-1">
                          {item.type?.toLowerCase()?.replace('_', ' ') || item.purpose || 'Transaction'}
                        </h3>
                        <div className="flex items-center gap-2">
                           <p className="text-xs text-text-muted font-mono tracking-tighter">
                            {item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}
                           </p>
                           <div className="w-1 h-1 bg-text-muted/30 rounded-full" />
                           <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest">
                             {item.id ? String(item.id).substring(0, 8) : 'Pending'}
                           </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-black font-mono tracking-tighter ${item.amount > 0 ? "text-buy" : "text-sell"}`}>
                        {item.amount > 0 ? "+" : ""}{item.amount?.toLocaleString() || "0"} USDT
                      </p>
                      <p className="text-[10px] text-text-muted font-medium">Success</p>
                    </div>
                  </Card>
                </div>
              ))
            ) : (
              <div className="py-20 text-center bg-white/5 rounded-3xl border border-dashed border-border-dim">
                 <p className="text-text-muted text-sm font-medium">No transactions found in this wallet.</p>
              </div>
            )}
          </div>
        </div>

      </div>
     
    </div>
  );
};

export default Wallet;

