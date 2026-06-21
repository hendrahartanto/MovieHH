import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { PaymentState } from "./types";

interface ResultHeroProps {
  state: PaymentState;
}

const stateConfig: Record<
  PaymentState,
  {
    title: string;
    description: string;
    iconBg: string;
    bannerBg: string;
    bannerBorder: string;
    accent: string;
  }
> = {
  success: {
    title: "Booking Confirmed!",
    description: "Your seats are reserved. Enjoy the show!",
    iconBg: "bg-emerald-500/15",
    bannerBg: "bg-emerald-950/30",
    bannerBorder: "border-emerald-900/40",
    accent: "text-emerald-400",
  },
  pending: {
    title: "Awaiting Payment",
    description: "Complete your payment to secure your seats.",
    iconBg: "bg-amber-500/15",
    bannerBg: "bg-amber-950/30",
    bannerBorder: "border-amber-900/40",
    accent: "text-amber-400",
  },
  failed: {
    title: "Payment Failed",
    description: "Your seats have been released. Please try again.",
    iconBg: "bg-destructive/15",
    bannerBg: "bg-destructive/10",
    bannerBorder: "border-destructive/30",
    accent: "text-destructive",
  },
};

export const ResultHero = ({ state }: ResultHeroProps) => {
  const cfg = stateConfig[state];

  return (
    <div
      className={cn(
        "relative px-8 pt-10 pb-8 text-center overflow-hidden border-b",
        cfg.bannerBg,
        cfg.bannerBorder,
      )}
    >
      <div className="absolute inset-0 cinema-gradient opacity-5 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-4">
        <div
          className={cn(
            "w-18 h-18 rounded-full flex items-center justify-center p-5",
            cfg.iconBg,
            state === "success" && "neon-pulse",
          )}
        >
          {state === "success" ? (
            <CheckCircle2 className={cn("w-9 h-9", cfg.accent)} />
          ) : state === "pending" ? (
            <Clock className={cn("w-9 h-9", cfg.accent)} />
          ) : (
            <XCircle className={cn("w-9 h-9", cfg.accent)} />
          )}
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground">{cfg.title}</h1>
          <p className={cn("text-sm font-medium", cfg.accent)}>
            {cfg.description}
          </p>
        </div>
      </div>
    </div>
  );
};
