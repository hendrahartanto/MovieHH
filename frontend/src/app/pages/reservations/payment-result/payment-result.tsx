import { useParams, useNavigate, Link } from "react-router";
import { useReservation } from "@/features/reservations/api/get-reservation";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Calendar as CalendarIcon,
  ChevronLeft,
  Ticket,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatImageUrl } from "@/helper/image-helper";
import { paths } from "@/config/paths";
import { cn } from "@/lib/utils";

export default function PaymentResultRoute() {
  const { reservationId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useReservation({
    reservationId: reservationId as string,
    queryConfig: {
      enabled: !!reservationId,
    },
  });

  const reservation = data?.data.reservation;

  if (isLoading) {
    return (
      <div className="layout-middle py-12 flex justify-center">
        <div className="w-full max-w-2xl bg-card border border-border rounded-xl p-8 space-y-6">
          <Skeleton className="h-16 w-16 rounded-full mx-auto" />
          <Skeleton className="h-8 w-64 mx-auto" />
          <Skeleton className="h-4 w-48 mx-auto" />
          <div className="space-y-4 pt-6">
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !reservation) {
    return (
      <div className="layout-middle py-12 flex justify-center text-center">
        <div className="w-full max-w-lg bg-card border border-border rounded-xl p-8 space-y-6 cinema-glow">
          <XCircle className="w-16 h-16 text-destructive mx-auto" />
          <h1 className="text-2xl font-bold text-foreground">
            Reservation Not Found
          </h1>
          <p className="text-muted-foreground">
            We couldn't find the reservation you are looking for.
          </p>
          <Button
            onClick={() => navigate(paths.home.getHref())}
            className="w-full"
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const isSuccess =
    reservation.status === "CONFIRMED" ||
    reservation.payment?.status === "PAID";
  const isPending =
    reservation.status === "PENDING" &&
    reservation.payment?.status === "PENDING";
  const isFailed =
    reservation.status === "CANCELLED" ||
    reservation.status === "EXPIRED" ||
    reservation.payment?.status === "FAILED" ||
    reservation.payment?.status === "CANCELLED" ||
    reservation.payment?.status === "EXPIRED";

  const movie = reservation.showTime.movieSchedule.movie;
  const theater = reservation.showTime.movieSchedule.theater;
  const seats = reservation.reservationDetails
    .map((d: any) => `${d.seat.seatRow}${d.seat.seatNumber}`)
    .join(", ");

  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(reservation.totalPrice));

  return (
    <div className="layout-middle py-8 md:py-16 flex justify-center">
      <div className="w-full max-w-2xl bg-card border border-border rounded-2xl overflow-hidden shadow-2xl relative">
        <div
          className={cn(
            "p-8 text-center relative overflow-hidden",
            isSuccess
              ? "bg-emerald-950/20 border-b border-emerald-900/50"
              : isPending
                ? "bg-amber-950/20 border-b border-amber-900/50"
                : "bg-destructive/10 border-b border-destructive/20",
          )}
        >
          {isSuccess && (
            <div className="absolute inset-0 cinema-gradient opacity-10 pointer-events-none" />
          )}

          <div className="relative z-10 flex flex-col items-center">
            {isSuccess ? (
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 neon-pulse">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
            ) : isPending ? (
              <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-10 h-10 text-amber-500" />
              </div>
            ) : (
              <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                <XCircle className="w-10 h-10 text-destructive" />
              </div>
            )}

            <h1 className="text-3xl font-bold text-foreground mb-2">
              {isSuccess
                ? "Payment Successful!"
                : isPending
                  ? "Payment Pending"
                  : "Payment Failed"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {isSuccess
                ? "Your reservation has been confirmed and seats are reserved."
                : isPending
                  ? "Please complete your payment within the Midtrans window."
                  : "Your payment was cancelled or expired. Your seats have been released."}
            </p>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <div className="flex flex-col sm:flex-row gap-6 bg-background/50 p-4 rounded-xl border border-border/50">
            {movie.posterUrl ? (
              <img
                src={formatImageUrl(movie.posterUrl)}
                alt={movie.title}
                className="w-24 h-36 object-cover rounded-lg shadow-md shrink-0"
              />
            ) : (
              <div className="w-24 h-36 bg-muted rounded-lg flex items-center justify-center text-xs text-muted-foreground shrink-0">
                No Poster
              </div>
            )}

            <div className="flex-1 space-y-3">
              <h2 className="text-xl font-bold text-foreground leading-tight">
                {movie.title}
              </h2>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{theater.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-primary" />
                  <span>
                    {format(
                      new Date(reservation.showTime.movieSchedule.date),
                      "MMMM d, yyyy",
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>
                    {format(new Date(reservation.showTime.startTime), "h:mm a")}{" "}
                    - {format(new Date(reservation.showTime.endTime), "h:mm a")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b border-border/50 pb-2">
              Reservation Details
            </h3>

            <div className="grid grid-cols-2 gap-y-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Reservation ID</p>
                <p className="font-mono text-foreground font-medium">
                  {reservation.id.split("-")[0]}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Status</p>
                <span
                  className={cn(
                    "px-2.5 py-0.5 rounded-full text-xs font-medium border",
                    isSuccess
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      : isPending
                        ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        : "bg-destructive/10 text-destructive border-destructive/20",
                  )}
                >
                  {reservation.status}
                </span>
              </div>
              <div className="col-span-2">
                <p className="text-muted-foreground mb-1">Selected Seats</p>
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <Ticket className="w-4 h-4 text-primary" />
                  <span>
                    {seats} ({reservation.reservationDetails.length} tickets)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span className="text-foreground">Total Amount</span>
              <span className="text-primary">{formattedPrice}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button variant="outline" className="flex-1" asChild>
              <Link to={paths.home.getHref()}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>

            {(isFailed || isPending) && (
              <Button className="flex-1 cinema-glow" asChild>
                <Link to={paths.seatSelection.getHref(reservation.showTimeId)}>
                  Try Again
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
