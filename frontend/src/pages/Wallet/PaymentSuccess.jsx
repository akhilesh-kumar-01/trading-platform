import { getUserWallet } from '@/Redux/Wallet/Action'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ReloadIcon } from '@radix-ui/react-icons'
import { WalletIcon, CheckCircle2, ChevronRight } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const PaymentSuccess = () => {
  const dispatch = useDispatch();
  const { wallet } = useSelector((store) => store);
  const navigate = useNavigate();

  const handleFetchUserWallet = () => {
    dispatch(getUserWallet(localStorage.getItem("jwt")));
  };

  return (
    <div className='flex flex-col justify-center items-center h-screen px-4 bg-bg-surface'>
      <div className="w-full max-w-md text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="relative mx-auto w-24 h-24">
           <div className="absolute inset-0 bg-buy/20 rounded-full animate-ping opacity-25" />
           <div className="relative w-24 h-24 bg-buy/10 rounded-full flex items-center justify-center border-4 border-buy/20 shadow-2xl shadow-buy/20">
              <CheckCircle2 className="w-12 h-12 text-buy" />
           </div>
        </div>

        <div className="space-y-2">
           <h1 className='text-4xl font-black text-text-primary tracking-tighter'>Payment Success!</h1>
           <p className="text-text-muted">Your funds have been added to your secure wallet.</p>
        </div>

        <Card className="bg-white/5 border-border-dim overflow-hidden backdrop-blur-sm">
           <CardHeader className="border-b border-white/5 pb-6">
             <div className="flex justify-between items-center">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                    <WalletIcon className="w-4 h-4 text-accent" />
                 </div>
                 <CardTitle className="text-lg font-bold">Updated Balance</CardTitle>
               </div>
               <Button
                 onClick={handleFetchUserWallet}
                 variant="ghost"
                 size="sm"
                 className="text-text-muted hover:text-text-primary h-8"
               >
                 <ReloadIcon className="w-4 h-4 mr-2" />
                 Refresh
               </Button>
             </div>
           </CardHeader>
           <CardContent className="pt-8 pb-8">
             <div className="flex items-baseline justify-center gap-2">
               <span className="text-5xl font-black font-mono tracking-tighter text-text-primary">
                 {wallet.userWallet?.balance?.toLocaleString() || "0"}
               </span>
               <span className="text-xl font-bold text-accent">USDT</span>
             </div>
           </CardContent>
        </Card>

        <div className="flex flex-col gap-3">
           <Button 
            onClick={() => navigate("/wallet")}
            className="w-full py-7 text-lg font-black bg-accent hover:bg-accent/90 text-white rounded-2xl shadow-xl shadow-accent/20 transition-all active:scale-[0.98]"
           >
              GO TO WALLET
              <ChevronRight className="ml-2 w-5 h-5" />
           </Button>
           <Button 
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-text-muted hover:text-text-primary"
           >
              Back to Home
           </Button>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess