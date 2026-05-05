import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";

export function AssetTable({ coins, category }) {
  const navigate = useNavigate();

  const formatNumber = (n) => {
    if (!n && n !== 0) return "---";
    if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
    if (n >= 1e9)  return `$${(n / 1e9).toFixed(2)}B`;
    if (n >= 1e6)  return `$${(n / 1e6).toFixed(2)}M`;
    return `$${n.toLocaleString()}`;
  };

  const formatPrice = (n) => {
    if (!n && n !== 0) return "---";
    if (n >= 1000) return `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
    if (n >= 1)    return `$${n.toFixed(4)}`;
    return `$${n.toFixed(6)}`;
  };

  return (
    <div
      className="overflow-y-auto"
      style={{ height: category === "all" ? "74vh" : "82vh" }}
    >
      <Table className="w-full">
        <TableHeader className="sticky top-0 z-10 bg-bg-surface border-b border-border-dim">
          <TableRow className="hover:bg-transparent border-0">
            <TableHead className="py-3 pl-4 text-text-muted text-xs font-semibold uppercase tracking-wider w-[35%]">
              Coin
            </TableHead>
            <TableHead className="text-text-muted text-xs font-semibold uppercase tracking-wider">
              Symbol
            </TableHead>
            <TableHead className="text-text-muted text-xs font-semibold uppercase tracking-wider hidden md:table-cell">
              Volume
            </TableHead>
            <TableHead className="text-text-muted text-xs font-semibold uppercase tracking-wider hidden lg:table-cell">
              Market Cap
            </TableHead>
            <TableHead className="text-text-muted text-xs font-semibold uppercase tracking-wider">
              24H
            </TableHead>
            <TableHead className="text-right pr-4 text-text-muted text-xs font-semibold uppercase tracking-wider">
              Price
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {coins && coins.length > 0 ? (
            coins.map((item) => {
              const change = item.market_cap_change_percentage_24h ?? 0;
              const isPositive = change >= 0;
              return (
                <TableRow
                  key={item.id}
                  className="cursor-pointer border-b border-border-dim/40 hover:bg-bg-elevated/40 transition-colors"
                  onClick={() => navigate(`/market/${item.id}`)}
                >
                  {/* Coin Name + Icon */}
                  <TableCell className="pl-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 border border-border-dim flex-shrink-0">
                        <AvatarImage src={item.image} alt={item.symbol} />
                        <AvatarFallback className="bg-bg-elevated text-text-secondary text-xs font-bold">
                          {item.symbol ? item.symbol[0].toUpperCase() : "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-semibold text-text-primary text-sm truncate">
                          {item.name}
                        </p>
                        <p className="text-text-muted text-xs uppercase">
                          {item.symbol}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Symbol */}
                  <TableCell className="text-text-secondary text-sm font-mono uppercase">
                    {item.symbol?.toUpperCase()}
                  </TableCell>

                  {/* Volume */}
                  <TableCell className="text-text-secondary text-sm font-mono hidden md:table-cell">
                    {formatNumber(item.total_volume)}
                  </TableCell>

                  {/* Market Cap */}
                  <TableCell className="text-text-secondary text-sm font-mono hidden lg:table-cell">
                    {formatNumber(item.market_cap)}
                  </TableCell>

                  {/* 24H Change */}
                  <TableCell>
                    <span
                      className={`text-sm font-mono font-bold px-2 py-0.5 rounded ${
                        isPositive
                          ? "text-buy bg-buy/10"
                          : "text-sell bg-sell/10"
                      }`}
                    >
                      {isPositive ? "+" : ""}
                      {change.toFixed(2)}%
                    </span>
                  </TableCell>

                  {/* Price */}
                  <TableCell className="text-right pr-4 font-mono font-bold text-text-primary text-sm">
                    {formatPrice(item.current_price)}
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-48 text-center">
                <div className="flex flex-col items-center gap-2 text-text-muted">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 opacity-20"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <p className="text-sm font-medium">No coins found</p>
                  <p className="text-xs opacity-60">
                    Try refreshing or selecting a different category
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
