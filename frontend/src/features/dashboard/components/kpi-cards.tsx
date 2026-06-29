import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Ticket, Percent, Scan, ArrowUpRight } from "lucide-react";
import { formatPrice } from "@/helper/format-helper";

interface KpiCardsProps {
  metrics?: {
    totalRevenue: number;
    totalTicketsSold: number;
    avgOccupancyRate: number;
    todayCheckedInTickets: number;
    todayConfirmedTickets: number;
  };
  isLoading?: boolean;
}

const cards = (metrics: NonNullable<KpiCardsProps["metrics"]>) => [
  {
    title: "Total Revenue",
    value: formatPrice(metrics.totalRevenue),
    description: "Lifetime ticket sales",
    icon: DollarSign,
    iconBg: "bg-violet-500/15",
    iconColor: "text-violet-400",
    accent: "border-violet-500/20",
    highlight: "from-violet-500/5 to-transparent",
  },
  {
    title: "Tickets Sold",
    value: metrics.totalTicketsSold.toLocaleString(),
    description: "Confirmed transactions",
    icon: Ticket,
    iconBg: "bg-blue-500/15",
    iconColor: "text-blue-400",
    accent: "border-blue-500/20",
    highlight: "from-blue-500/5 to-transparent",
  },
  {
    title: "Avg. Occupancy",
    value: `${metrics.avgOccupancyRate}%`,
    description: "Across today's showtimes",
    icon: Percent,
    iconBg: "bg-amber-500/15",
    iconColor: "text-amber-400",
    accent: "border-amber-500/20",
    highlight: "from-amber-500/5 to-transparent",
  },
  {
    title: "Gate Check-ins",
    value: `${metrics.todayCheckedInTickets} / ${metrics.todayConfirmedTickets}`,
    description: "Usher scan ratio today",
    icon: Scan,
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-400",
    accent: "border-emerald-500/20",
    highlight: "from-emerald-500/5 to-transparent",
  },
];

export const KpiCards = ({ metrics, isLoading }: KpiCardsProps) => {
  if (isLoading || !metrics) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[...Array(4)].map((_, i) => (
          <Card
            key={i}
            className="relative overflow-hidden border border-border/40 shadow-sm animate-pulse"
          >
            <CardContent className="p-5 relative">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-muted/50 w-10 h-10 shrink-0" />
                <div className="w-4 h-4 bg-muted/40 rounded" />
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-muted/50 rounded w-20" />
                <div className="h-7 bg-muted/70 rounded w-28" />
                <div className="h-3 bg-muted/40 rounded w-24 mt-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards(metrics).map((card, i) => {
        const Icon = card.icon;
        return (
          <Card
            key={i}
            className={`relative overflow-hidden border ${card.accent} shadow-sm hover:shadow-md transition-all duration-300 group`}
          >
            <div
              className={`absolute inset-0 bg-linear-to-br ${card.highlight} pointer-events-none`}
            />

            <CardContent className="p-5 relative">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${card.iconBg} shrink-0`}>
                  <Icon className={`w-5 h-5 ${card.iconColor}`} />
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors duration-200" />
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  {card.title}
                </p>
                <div className="text-2xl font-bold tracking-tight text-foreground leading-none">
                  {card.value}
                </div>
                <p className="text-xs text-muted-foreground/70 mt-2">
                  {card.description}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
