import { transferMoney } from "@/Redux/Wallet/Action";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { DollarSign } from "lucide-react";

const TransferForm = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    amount: "",
    walletId: "",
    purpose: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // setAmount(e.target.value);
  };

  const handleSubmit = () => {
    dispatch(
      transferMoney({
        jwt: localStorage.getItem("jwt"),
        walletId: formData.walletId,
        reqData: {
          amount: formData.amount,
          purpose: formData.purpose,
        },
      })
    );
    console.log(formData);
  };
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Transfer Amount</label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-accent" />
          <Input
            name="amount"
            type="number"
            onChange={handleChange}
            value={formData.amount}
            className="pl-10 py-6 bg-bg-elevated border-border-dim text-lg font-bold font-mono focus:ring-accent"
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Recipient Wallet ID</label>
        <Input
          name="walletId"
          onChange={handleChange}
          value={formData.walletId}
          className="py-6 bg-bg-elevated border-border-dim font-mono focus:ring-accent"
          placeholder="e.g. #ADFE34456"
        />
      </div>

      <div className="space-y-2">
        <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Purpose / Message</label>
        <Input
          name="purpose"
          onChange={handleChange}
          value={formData.purpose}
          className="py-6 bg-bg-elevated border-border-dim focus:ring-accent"
          placeholder="e.g. Gift, Payment, etc."
        />
      </div>

      <DialogClose className="w-full">
        <Button
          onClick={handleSubmit}
          disabled={!formData.amount || !formData.walletId}
          className="w-full py-6 text-lg font-black bg-accent hover:bg-accent/90 text-white shadow-xl shadow-accent/20 rounded-xl transition-all active:scale-[0.98]"
        >
          CONFIRM TRANSFER
        </Button>
      </DialogClose>
      
      <p className="text-[10px] text-center text-text-muted">
        Transfers are instant and irreversible once confirmed. Please double-check the recipient's Wallet ID.
      </p>
    </div>
  );
};


export default TransferForm;
