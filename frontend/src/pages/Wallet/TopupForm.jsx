import { paymentHandler } from "@/Redux/Wallet/Action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { UpdateIcon } from "@radix-ui/react-icons";
import { DollarSign } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const TopupForm = () => {
  const [amount, setAmount] = useState();
  const [paymentMethod, setPaymentMethod] = useState("RAZORPAY");
  const { wallet } = useSelector((store) => store);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setAmount(e.target.value);
  };

  const handleSubmit = () => {
    dispatch(
      paymentHandler({
        jwt: localStorage.getItem("jwt"),
        paymentMethod,
        amount,
      })
    );
    console.log(amount, paymentMethod);
  };
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Amount to Deposit</label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-accent" />
          <Input
            type="number"
            onChange={handleChange}
            value={amount}
            className="pl-10 py-6 bg-bg-elevated border-border-dim text-xl font-bold font-mono focus:ring-accent"
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Select Payment Gateway</label>
        <RadioGroup
          onValueChange={setPaymentMethod}
          className="grid grid-cols-2 gap-4"
          defaultValue="RAZORPAY"
        >
          <div className={`relative flex items-center justify-between border rounded-xl p-4 transition-all cursor-pointer ${paymentMethod === 'RAZORPAY' ? 'border-accent bg-accent/5' : 'border-border-dim bg-bg-elevated hover:bg-white/5'}`}>
            <div className="flex items-center gap-3">
               <div className="bg-white p-1 rounded h-6 w-24 flex items-center justify-center overflow-hidden">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg"
                  alt="Razorpay"
                  className="max-h-full"
                />
               </div>
            </div>
            <RadioGroupItem value="RAZORPAY" id="r1" className="text-accent" />
            <Label htmlFor="r1" className="absolute inset-0 cursor-pointer" />
          </div>

          <div className={`relative flex items-center justify-between border rounded-xl p-4 transition-all cursor-pointer ${paymentMethod === 'STRIPE' ? 'border-accent bg-accent/5' : 'border-border-dim bg-bg-elevated hover:bg-white/5'}`}>
            <div className="flex items-center gap-3">
               <div className="bg-white p-1 rounded h-6 w-24 flex items-center justify-center overflow-hidden">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
                  alt="Stripe"
                  className="max-h-full"
                />
               </div>
            </div>
            <RadioGroupItem value="STRIPE" id="r2" className="text-accent" />
            <Label htmlFor="r2" className="absolute inset-0 cursor-pointer" />
          </div>
        </RadioGroup>
      </div>

      {wallet.loading ? (
        <Button disabled className="w-full py-6 bg-accent/50 text-white rounded-xl">
           <UpdateIcon className="animate-spin mr-2" />
           Initializing Gateway...
        </Button>
      ) : (
        <Button
          onClick={handleSubmit}
          className="w-full py-6 text-lg font-black bg-accent hover:bg-accent/90 text-white shadow-xl shadow-accent/20 rounded-xl transition-all active:scale-[0.98]"
        >
          CONFIRM DEPOSIT
        </Button>
      )}
      
      <p className="text-[10px] text-center text-text-muted px-4">
        By clicking confirm, you agree to our terms of service and payment processing policies. Funds will be credited after successful verification.
      </p>
    </div>
  );
};


export default TopupForm;
