import { getWithdrawalHistory } from "@/Redux/Withdrawal/Action";
import { readableDate } from "@/Util/readableDate";
import { readableTimestamp } from "@/Util/readbaleTimestamp";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { History, WalletIcon } from "lucide-react";

const Withdrawal = () => {
  const dispatch = useDispatch();
  const { withdrawal } = useSelector((store) => store);

  useEffect(() => {
    dispatch(getWithdrawalHistory(localStorage.getItem("jwt")));
  }, [dispatch]);

  return (
    <div className="container max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
           <History className="w-6 h-6 text-accent" />
        </div>
        <h1 className="text-3xl font-black text-text-primary tracking-tight">Withdrawal History</h1>
      </div>

      <div className="bg-bg-surface border border-border-dim rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-border-dim hover:bg-transparent">
              <TableHead className="py-5 px-6 text-[11px] font-black text-text-muted uppercase tracking-widest">Date & Time</TableHead>
              <TableHead className="text-[11px] font-black text-text-muted uppercase tracking-widest">Method</TableHead>
              <TableHead className="text-[11px] font-black text-text-muted uppercase tracking-widest">Amount</TableHead>
              <TableHead className="text-right px-6 text-[11px] font-black text-text-muted uppercase tracking-widest">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {withdrawal.history.length > 0 ? (
              withdrawal.history.map((item) => (
                <TableRow key={item.id} className="border-border-dim hover:bg-white/5 transition-colors">
                  <TableCell className="font-medium py-5 px-6">
                    <p className="text-text-primary font-bold">
                       {new Date(item?.date).toLocaleDateString()}
                    </p>
                    <p className="text-[10px] text-text-muted font-mono">
                       {new Date(item?.date).toLocaleTimeString()}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 bg-white/10 rounded flex items-center justify-center">
                          <WalletIcon className="w-3 h-3 text-text-muted" />
                       </div>
                       <span className="text-sm font-medium text-text-primary">Bank Account</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-black font-mono text-text-primary">
                       ${item.amount?.toLocaleString()}
                    </p>
                  </TableCell>
                  <TableCell className="text-right px-6">
                    <Badge variant="outline" className={`
                      px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter
                      ${item.status === "PENDING" 
                        ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" 
                        : "bg-buy/10 text-buy border-buy/20"}
                    `}>
                      {item.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="py-20 text-center">
                   <p className="text-text-muted text-sm font-medium">No withdrawal requests found.</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};


export default Withdrawal;
