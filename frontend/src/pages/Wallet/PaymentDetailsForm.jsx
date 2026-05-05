import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { addPaymentDetails } from "@/Redux/Withdrawal/Action";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const formSchema = yup.object().shape({
  accountHolderName: yup.string().required("Account holder name is required"),
  ifscCode: yup.string().length(11, "IFSC code must be 11 characters"),
  accountNumber: yup.string().required("Account number is required"),
  confirmAccountNumber: yup.string().test({
    name: "match",
    message: "Account numbers do not match",
    test: function (value) {
      return value === this.parent.accountNumber;
    },
  }),
  bankName: yup.string().required("Bank name is required"),
});

const PaymentDetailsForm = () => {
  const dispatch = useDispatch();
  const { auth } = useSelector((store) => store);
  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      accountHolderName: "",
      ifsc: "",
      accountNumber: "",
      bankName: "",
    },
  });
  const onSubmit = (data) => {
    dispatch(
      addPaymentDetails({
        paymentDetails: data,
        jwt: localStorage.getItem("jwt"),
      })
    );
    console.log("payment details form", data);
  };
  return (
    <div className="px-2 py-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="accountHolderName"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <Label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Account Holder Name</Label>
                <FormControl>
                  <Input
                    {...field}
                    className="bg-bg-elevated border-border-dim py-6 px-4 text-sm focus:ring-accent"
                    placeholder="Enter full name"
                  />
                </FormControl>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="ifsc"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">IFSC Code</Label>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-bg-elevated border-border-dim py-6 px-4 text-sm font-mono focus:ring-accent"
                      placeholder="e.g. YESB0000009"
                    />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bankName"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Bank Name</Label>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-bg-elevated border-border-dim py-6 px-4 text-sm focus:ring-accent"
                      placeholder="e.g. YES Bank"
                    />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="accountNumber"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <Label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Account Number</Label>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    className="bg-bg-elevated border-border-dim py-6 px-4 text-sm font-mono focus:ring-accent"
                    placeholder="Enter account number"
                  />
                </FormControl>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmAccountNumber"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <Label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Confirm Account Number</Label>
                <FormControl>
                  <Input
                    {...field}
                    className="bg-bg-elevated border-border-dim py-6 px-4 text-sm font-mono focus:ring-accent"
                    placeholder="Re-enter account number"
                  />
                </FormControl>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )}
          />

          <div className="pt-4">
            {!auth.loading ? (
              <Button type="submit" className="w-full py-6 text-lg font-black bg-accent hover:bg-accent/90 text-white rounded-xl shadow-xl shadow-accent/10 transition-all active:scale-[0.98]">
                SUBMIT DETAILS
              </Button>
            ) : (
              <Button disabled className="w-full py-6 bg-accent/50 text-white rounded-xl">
                 Processing...
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};


export default PaymentDetailsForm;
