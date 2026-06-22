import { Badge } from "@/components/ui/badge";
import { ActiveReservation } from "@/features/reservations/types";
import {
  Calendar,
  MapPin,
  Ticket,
  Clock,
  Film,
  ChevronRight,
  Armchair,
} from "lucide-react";
import { SeatDots } from "./seat-dots";
import { formatBookingId } from "@/lib/utils";

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }),
    time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    year: d.getFullYear(),
  };
};

const STATUS_STYLES: Record<string, string> = {
  CONFIRMED: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  PENDING: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  CANCELLED: "bg-red-500/15 text-red-400 border-red-500/30",
  COMPLETED: "bg-muted/60 text-muted-foreground border-border",
};

interface ReservationCardProps {
  reservation: ActiveReservation;
  variant?: "active" | "history";
  onClick?: () => void;
}

export const ReservationCard = ({
  reservation,
  variant = "active",
  onClick,
}: ReservationCardProps) => {
  const movie = reservation.showTime.movieSchedule.movie;
  const theater = reservation.showTime.movieSchedule.theater;
  const seatCount = reservation.reservationDetails.length;
  const { date, time } = formatDate(reservation.showTime.startTime);
  const statusStyle =
    STATUS_STYLES[reservation.status] ?? STATUS_STYLES["PENDING"];

  return (
    <article
      className={`group relative flex rounded-xl overflow-hidden cinema-border bg-card transition-all duration-300 hover:cinema-glow hover:-translate-y-0.5 ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") onClick(); } : undefined}
    >
      <div
        className={`w-1 shrink-0 cinema-gradient ${variant === "history" ? "opacity-30" : "opacity-100"}`}
      />

      <div className="flex flex-col sm:flex-row flex-1 min-w-0">
        <div className="flex-1 min-w-0 px-5 py-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <Film className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="text-xs text-primary font-medium uppercase tracking-wider truncate">
                  {theater?.name ?? "Unknown Theater"}
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground leading-tight truncate">
                {movie?.title ?? "Movie Title"}
              </h3>
            </div>
            <Badge
              variant="outline"
              className={`shrink-0 text-xs font-semibold border px-2 py-0.5 ${statusStyle}`}
            >
              {reservation.status}
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-primary/70 shrink-0" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-primary/70 shrink-0" />
              <span>{time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-primary/70 shrink-0" />
              <span className="truncate">{theater?.name ?? "—"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Armchair className="h-3.5 w-3.5 text-primary/70 shrink-0" />
              <span>
                {seatCount} {seatCount === 1 ? "seat" : "seats"}
              </span>
            </div>
          </div>

          <div className="pt-0.5">
            <SeatDots count={seatCount} />
          </div>
        </div>

        <div className="hidden sm:flex flex-col items-center justify-center px-0 py-4">
          <div className="w-px h-full border-l-2 border-dashed border-border/60 relative">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-background border border-border/60" />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-background border border-border/60" />
          </div>
        </div>

        <div className="sm:w-36 flex flex-row sm:flex-col items-center justify-between sm:justify-center gap-3 px-5 sm:px-4 py-3 sm:py-4 bg-muted/20">
          <div className="text-center">
            <Ticket className="h-6 w-6 text-primary mx-auto mb-1 opacity-80" />
            <p className="text-xs text-muted-foreground font-medium">Booking</p>
            <p className="text-xs font-mono text-foreground/70 truncate max-w-24">
              #{formatBookingId(reservation.id)}
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200" />
        </div>
      </div>
    </article>
  );
};
