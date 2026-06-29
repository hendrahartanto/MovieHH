import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Receipt } from "lucide-react";
import { formatPrice } from "@/helper/format-helper";
import { format } from "date-fns";

interface Transaction {
  id: string;
  totalPrice: string | number;
  status: string;
  createAt: string;
  user: { name: string; email: string };
  showTime: {
    movieSchedule: {
      movie: { title: string };
    };
  };
}

interface RecentTransactionsProps {
  recentTransactions?: Transaction[];
  isLoading?: boolean;
}

const AVATAR_COLORS = [
  "bg-violet-500/20 text-violet-400",
  "bg-blue-500/20 text-blue-400",
  "bg-amber-500/20 text-amber-400",
  "bg-rose-500/20 text-rose-400",
  "bg-emerald-500/20 text-emerald-400",
];

function getStatusStyle(status: string) {
  switch (status) {
    case "CONFIRMED":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "PENDING":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    default:
      return "bg-red-500/10 text-red-400 border-red-500/20";
  }
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export const RecentTransactions = ({
  recentTransactions,
  isLoading,
}: RecentTransactionsProps) => {
  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-4 border-b border-border/50 px-6 pt-5">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Receipt className="w-4 h-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold leading-none">
              Recent Reservations
            </CardTitle>
            <CardDescription className="mt-1 text-xs">
              Latest payment transaction logs
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {isLoading || !recentTransactions ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border/50 text-muted-foreground text-xs font-semibold uppercase tracking-wider bg-muted/20">
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Movie</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3 text-right">Amount</th>
                  <th className="px-6 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {[...Array(3)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-muted/50 shrink-0" />
                        <div className="space-y-1 w-24">
                          <div className="h-3 bg-muted/50 rounded w-16" />
                          <div className="h-2.5 bg-muted/40 rounded w-20" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="h-3.5 bg-muted/50 rounded w-28" />
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="h-3 bg-muted/40 rounded w-20" />
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="h-3.5 bg-muted/50 rounded w-16 ml-auto" />
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="h-6 bg-muted/40 rounded w-16 ml-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : recentTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center px-6">
            <Receipt className="w-8 h-8 text-muted-foreground/30 mb-3" />
            <p className="text-sm font-medium text-muted-foreground">
              No transactions yet
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Transactions will appear here as bookings come in.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border/50 text-muted-foreground text-xs font-semibold uppercase tracking-wider bg-muted/20">
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Movie</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3 text-right">Amount</th>
                  <th className="px-6 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {recentTransactions.map((tx, idx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-muted/20 transition-colors duration-150 group"
                  >
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${AVATAR_COLORS[idx % AVATAR_COLORS.length]}`}
                        >
                          {getInitials(tx.user.name)}
                        </div>
                        <div className="min-w-0">
                          <span className="font-semibold text-foreground text-xs block truncate">
                            {tx.user.name}
                          </span>
                          <span className="text-[11px] text-muted-foreground truncate block">
                            {tx.user.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-sm font-medium text-foreground max-w-[180px]">
                      <span className="truncate block">
                        {tx.showTime.movieSchedule.movie?.title ?? "Movie Ticket"}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                      {tx.createAt
                        ? format(new Date(tx.createAt), "MMM d, h:mm a")
                        : "—"}
                    </td>
                    <td className="px-6 py-3.5 text-right font-mono font-semibold text-sm text-foreground whitespace-nowrap">
                      {formatPrice(Number(tx.totalPrice))}
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-semibold uppercase tracking-wide ${getStatusStyle(tx.status)}`}
                      >
                        {tx.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
