import { Hash, CreditCard, Ticket } from "lucide-react";
import { PopulatedReservation } from "@/features/reservations/api/get-reservation";
import { cn, formatBookingId } from "@/lib/utils";
import { PaymentState } from "./types";
import { SeatBadge } from "./seat-badge";

interface BookingMetaProps {
  reservation: PopulatedReservation;
  seatLabels: string[];
  state: PaymentState;
}

const statusBadgeClasses: Record<PaymentState, string> = {
  success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/25",
  failed: "bg-destructive/10 text-destructive border-destructive/25",
};

export const BookingMeta = ({ reservation, seatLabels, state }: BookingMetaProps) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium flex items-center gap-1.5">
          <Hash className="w-3 h-3" />
          Booking ID
        </p>
        <p className="font-mono text-foreground font-semibold tracking-wide">
          {formatBookingId(reservation.id)}
        </p>
      </div>

      <div className="space-y-1">
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium flex items-center gap-1.5">
          <CreditCard className="w-3 h-3" />
          Status
        </p>
        <span
          className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border",
            statusBadgeClasses[state],
          )}
        >
          {reservation.status}
        </span>
      </div>
    </div>

    <div className="space-y-2">
      <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium flex items-center gap-1.5">
        <Ticket className="w-3 h-3" />
        Seats — {seatLabels.length}{" "}
        {seatLabels.length === 1 ? "ticket" : "tickets"}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {seatLabels.map((label) => (
          <SeatBadge key={label} label={label} />
        ))}
      </div>
    </div>
  </div>
);
