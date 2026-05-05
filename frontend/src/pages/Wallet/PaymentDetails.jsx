import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PaymentDetailsForm from "./PaymentDetailsForm";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getPaymentDetails } from "@/Redux/Withdrawal/Action";
import { maskAccountNumber } from "@/Util/maskAccountNumber";
import { WalletIcon, AlertCircle } from "lucide-react";

const PaymentDetails = () => {
  const dispatch = useDispatch();
  const { withdrawal } = useSelector((store) => store);

  useEffect(() => {
    dispatch(getPaymentDetails({ jwt: localStorage.getItem("jwt") }));
  }, [dispatch]);

  return (
    <div className="container max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
           <WalletIcon className="w-6 h-6 text-accent" />
        </div>
        <h1 className="text-3xl font-black text-text-primary tracking-tight">Payment Details</h1>
      </div>

      {withdrawal.paymentDetails ? (
        <Card className="bg-bg-surface border-border-dim overflow-hidden shadow-2xl">
          <CardHeader className="bg-white/5 border-b border-border-dim py-6">
            <div className="flex justify-between items-start">
               <div>
                  <CardTitle className="text-xl font-black text-text-primary">
                    {withdrawal.paymentDetails?.bankName?.toUpperCase() || "BANK ACCOUNT"}
                  </CardTitle>
                  <CardDescription className="text-text-muted mt-1 flex items-center gap-2">
                    <span className="font-mono text-sm">
                      A/C: {maskAccountNumber(withdrawal.paymentDetails?.accountNumber)}
                    </span>
                  </CardDescription>
               </div>
               <div className="px-3 py-1 bg-buy/10 border border-buy/20 rounded-full text-[10px] font-bold text-buy uppercase flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-buy rounded-full" />
                  Verified
               </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-1">
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Account Holder</p>
                  <p className="text-lg font-bold text-text-primary">
                    {withdrawal.paymentDetails.accountHolderName || "N/A"}
                  </p>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">IFSC Code</p>
                  <p className="text-lg font-mono font-bold text-accent">
                    {withdrawal.paymentDetails.ifsc?.toUpperCase() || "N/A"}
                  </p>
               </div>
            </div>
            
            <div className="pt-6 border-t border-border-dim flex justify-end">
               <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="border-border-dim text-text-muted hover:text-text-primary hover:bg-white/5">
                       Update Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-bg-surface border-border-dim text-text-primary sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-black">Update Bank Account</DialogTitle>
                    </DialogHeader>
                    <PaymentDetailsForm />
                  </DialogContent>
               </Dialog>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-bg-surface border border-border-dim rounded-3xl p-16 text-center shadow-2xl">
           <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-accent" />
           </div>
           <h2 className="text-2xl font-black text-text-primary mb-2">No Bank Account Added</h2>
           <p className="text-text-muted mb-10 max-w-sm mx-auto">
              Please add your bank account details to enable withdrawals to your local bank.
           </p>
           <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-accent hover:bg-accent/90 text-white px-10 py-6 text-lg font-black rounded-2xl shadow-xl shadow-accent/20">
                  ADD PAYMENT DETAILS
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-bg-surface border-border-dim text-text-primary sm:max-w-[500px]">
                <DialogHeader className="pb-4">
                  <DialogTitle className="text-2xl font-black text-center">Add Bank Account</DialogTitle>
                </DialogHeader>
                <PaymentDetailsForm />
              </DialogContent>
           </Dialog>
        </div>
      )}
    </div>
  );
};


export default PaymentDetails;
