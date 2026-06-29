import { ActiveReservation } from "@/features/reservations/types";
import { formatBookingId } from "@/lib/utils";
import { formatPrice } from "@/helper/format-helper";
import {
  Calendar,
  Clock,
  MapPin,
  Armchair,
  Film,
  X,
  Ticket,
  Banknote,
  Hash,
} from "lucide-react";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
  };
};

const formatEndTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
};

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; dot: string }
> = {
  CONFIRMED: {
    label: "Confirmed",
    bg: "bg-emerald-500/15",
    text: "text-emerald-400",
    dot: "bg-emerald-400",
  },
  PENDING: {
    label: "Pending",
    bg: "bg-amber-500/15",
    text: "text-amber-400",
    dot: "bg-amber-400",
  },
  CANCELLED: {
    label: "Cancelled",
    bg: "bg-red-500/15",
    text: "text-red-400",
    dot: "bg-red-400",
  },
  COMPLETED: {
    label: "Completed",
    bg: "bg-muted/60",
    text: "text-muted-foreground",
    dot: "bg-muted-foreground",
  },
};

const BARCODE_HEIGHTS = [3, 5, 2, 6, 4, 1, 6, 3, 5, 2, 4, 6, 2, 5, 3, 4, 2, 5, 3, 6];

interface TicketModalProps {
  reservation: ActiveReservation | null;
  onClose: () => void;
}

export const TicketModal = ({ reservation, onClose }: TicketModalProps) => {
  const [isQrExpanded, setIsQrExpanded] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsQrExpanded(false);
        onClose();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    if (reservation) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [reservation]);

  if (!reservation) return null;

  const movie = reservation.showTime.movieSchedule.movie;
  const theater = reservation.showTime.movieSchedule.theater;
  const seats = reservation.reservationDetails;
  const { date, time } = formatDate(reservation.showTime.startTime);
  const endTime = formatEndTime(reservation.showTime.endTime);
  const bookingId = formatBookingId(reservation.id);
  const statusCfg = STATUS_CONFIG[reservation.status] ?? STATUS_CONFIG["PENDING"];

  const rawPrice = reservation.totalPrice;
  const price = typeof rawPrice === "string" ? parseFloat(rawPrice) : rawPrice;
  const formattedPrice = isNaN(price as number)
    ? String(rawPrice)
    : formatPrice(price as number);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Ticket details"
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

      <div
        className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-20 w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-150 shadow-lg"
          aria-label="Close ticket"
        >
          <X className="h-4 w-4" />
        </button>

        <div
          className="rounded-2xl overflow-hidden shadow-2xl shadow-black/70 cinema-border"
          style={{ background: "hsl(0,0%,10%)" }}
        >
          <div className="relative cinema-gradient px-6 pt-6 pb-8 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 flex justify-between px-2">
              {Array.from({ length: 16 }).map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-2.5 rounded-b-sm bg-black/40"
                />
              ))}
            </div>

            <div className="flex items-start justify-between mt-3 gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <Film className="h-3.5 w-3.5 text-white/70 shrink-0" />
                  <span className="text-xs text-white/70 uppercase tracking-widest font-medium truncate">
                    {theater?.name ?? "Cinema"}
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-white leading-tight">
                  {movie?.title ?? "Movie"}
                </h2>
              </div>

              <span
                className={`shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold rounded-full px-3 py-1.5 border ${statusCfg.bg} ${statusCfg.text} border-current/20`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot} animate-pulse`}
                />
                {statusCfg.label}
              </span>
            </div>
          </div>

          <div className="relative flex items-center">
            <div className="w-5 h-10 rounded-r-full bg-background border-r border-t border-b border-border/50" />
            <div className="flex-1 border-t-2 border-dashed border-border/40 mx-1" />
            <div className="w-5 h-10 rounded-l-full bg-background border-l border-t border-b border-border/50" />
          </div>

          <div className="px-6 pt-2 pb-5 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1.5 font-medium">
                  Date
                </p>
                <div className="flex items-start gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold text-foreground leading-snug">
                    {date}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1.5 font-medium">
                  Showtime
                </p>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="text-sm font-semibold text-foreground">
                    {time}
                    {reservation.showTime.endTime && (
                      <span className="text-muted-foreground font-normal">
                        {" – "}
                        {endTime}
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1.5 font-medium">
                  Theater
                </p>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="text-sm font-semibold text-foreground truncate">
                    {theater?.name ?? "—"}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1.5 font-medium">
                  Total Paid
                </p>
                <div className="flex items-center gap-1.5">
                  <Banknote className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="text-sm font-semibold text-foreground">
                    {formattedPrice}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2 font-medium">
                Seats ({seats.length})
              </p>
              {seats.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {seats.map((detail) => (
                    <div
                      key={detail.id}
                      className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/25 rounded-lg px-3 py-1.5"
                    >
                      <Armchair className="h-3.5 w-3.5 text-primary" />
                      <span className="text-sm font-bold text-foreground font-mono">
                        {detail.seat.seatRow}
                        {detail.seat.seatNumber}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">—</span>
              )}
            </div>

            <div className="border-t border-border/30" />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1.5 font-medium">
                  Booking ID
                </p>
                <div className="flex items-center gap-1.5">
                  <Hash className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="font-mono text-sm font-bold text-foreground tracking-widest">
                    {bookingId}
                  </span>
                </div>
                {reservation.checkedInAt && (
                  <p className="text-[10px] text-emerald-400 font-semibold mt-1">
                    Checked in
                  </p>
                )}
              </div>

              {!reservation.checkedInAt && reservation.status === "CONFIRMED" ? (
                <div
                  onClick={() => setIsQrExpanded(true)}
                  className="bg-white p-1 rounded-md shrink-0 border border-white/20 cursor-pointer hover:scale-105 transition-all duration-150 relative group"
                  title="Click to enlarge"
                >
                  <QRCodeSVG
                    value={`${window.location.origin}/admin/check-in/verify/${reservation.id}`}
                    size={56}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="M"
                  />
                </div>
              ) : (
                <div className="flex items-end gap-px h-10 opacity-35 pr-1">
                  {BARCODE_HEIGHTS.map((h, i) => (
                    <div
                      key={i}
                      className="w-[3px] bg-foreground rounded-full"
                      style={{ height: `${h * 16}%` }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between px-2 pb-1 opacity-50">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="w-3 h-2.5 rounded-t-sm bg-border/40" />
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-3 flex items-center justify-center gap-1.5">
          <Ticket className="h-3 w-3" />
          Present this ticket at the entrance
        </p>
      </div>

      {isQrExpanded && !reservation.checkedInAt && reservation.status === "CONFIRMED" && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsQrExpanded(false)}
        >
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setIsQrExpanded(false)}
              className="w-10 h-10 rounded-full bg-card/50 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-150 shadow-lg cursor-pointer"
              aria-label="Close fullscreen QR"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div
            className="flex flex-col items-center justify-center bg-white p-6 rounded-2xl border border-white/20 shadow-2xl animate-in zoom-in-95 duration-200 max-w-sm w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <QRCodeSVG
              value={`${window.location.origin}/admin/check-in/verify/${reservation.id}`}
              size={260}
              bgColor="#ffffff"
              fgColor="#000000"
              level="H"
            />
            <div className="mt-6 space-y-1 bg-black/5 p-4 rounded-xl w-full">
              <h3 className="text-black font-extrabold text-lg leading-tight truncate">
                {movie?.title ?? "Movie"}
              </h3>
              <p className="text-black/60 text-xs font-medium">
                {theater?.name ?? "Cinema"} • {seats.length} Tickets
              </p>
              <p className="text-[10px] text-primary/70 font-mono tracking-widest font-bold mt-2 uppercase">
                ID: {bookingId}
              </p>
            </div>
            <p className="text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1.5 font-medium">
              Scan at the entrance
            </p>
          </div>
        </div>
      )}
    </div>
  );
};