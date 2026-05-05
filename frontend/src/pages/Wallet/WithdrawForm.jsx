import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { withdrawalRequest } from "@/Redux/Withdrawal/Action";
import { DialogClose } from "@/components/ui/dialog";
import { maskAccountNumber } from "@/Util/maskAccountNumber";
import { useNavigate } from "react-router-dom";
import { AlertCircle, DollarSign } from "lucide-react";

const WithdrawForm = () => {
  const dispatch = useDispatch();
  const [amount, setAmount] = useState();
  const { wallet, withdrawal } = useSelector((store) => store);
  const navigate = useNavigate();

  const handleChange = (e) => {
    let value = e.target.value;
    if (value.toString().length < 6) {
      setAmount(e.target.value);
    }
  };

  const handleSubmit = () => {
    dispatch(withdrawalRequest({ jwt: localStorage.getItem("jwt"), amount }));
  };

  if (!withdrawal.paymentDetails) {
    return (
      <div className="h-[15rem] flex flex-col justify-center items-center space-y-4">
        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
           <AlertCircle className="w-8 h-8 text-accent" />
        </div>
        <div className="text-center">
           <p className="text-lg font-black text-text-primary">Payment Method Missing</p>
           <p className="text-xs text-text-muted">You need to add bank details before withdrawing.</p>
        </div>
        <Button 
          onClick={() => navigate("/payment-details")}
          className="bg-accent hover:bg-accent/90 text-white font-bold"
        >
          Add Payment Details
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-bg-elevated border border-border-dim flex justify-between items-center">
        <div>
           <p className="text-[10px] font-bold text-text-muted uppercase">Available for Withdrawal</p>
           <p className="text-2xl font-black font-mono text-text-primary">
              ${wallet.userWallet?.balance?.toLocaleString()}
           </p>
        </div>
        <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
           <DollarSign className="w-5 h-5 text-accent" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Withdrawal Amount</label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-accent" />
          <Input
            type="number"
            onChange={handleChange}
            value={amount}
            className="pl-10 py-6 bg-bg-elevated border-border-dim text-xl font-bold font-mono focus:ring-accent text-center"
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Destination Account</p>
        <div className="flex items-center gap-4 bg-bg-elevated p-4 rounded-xl border border-border-dim">
          <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
            <img
              className="h-6 w-6 opacity-80"
              src="https://cdn.pixabay.com/photo/2020/02/18/11/03/bank-4859142_1280.png"
              alt="Bank"
            />
          </div>
          <div className="flex-1">
            <p className="text-sm font-black text-text-primary">
              {withdrawal.paymentDetails?.bankName}
            </p>
            <p className="text-xs text-text-muted font-mono tracking-tighter">
              {maskAccountNumber(withdrawal.paymentDetails?.accountNumber)}
            </p>
          </div>
          <div className="px-2 py-1 bg-buy/10 rounded text-[9px] font-bold text-buy uppercase">Verified</div>
        </div>
      </div>

      <DialogClose className="w-full">
        <Button
          onClick={handleSubmit}
          disabled={!amount || amount <= 0}
          className="w-full py-6 text-lg font-black bg-accent hover:bg-accent/90 text-white shadow-xl shadow-accent/20 rounded-xl transition-all active:scale-[0.98]"
        >
          CONFIRM WITHDRAWAL {amount > 0 && <span className="ml-2 font-mono">${amount}</span>}
        </Button>
      </DialogClose>

      <p className="text-[10px] text-center text-text-muted leading-relaxed">
        Withdrawals are usually processed within 24-48 hours. Please ensure your bank details are correct to avoid delays.
      </p>
    </div>
  );
};


export default WithdrawForm;
