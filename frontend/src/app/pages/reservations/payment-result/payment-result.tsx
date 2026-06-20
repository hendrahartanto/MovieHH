import { useParams, useNavigate, Link } from "react-router";
import { format } from "date-fns";
import {
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Calendar as CalendarIcon,
  ChevronLeft,
  Ticket,
  Film,
  Hash,
  CreditCard,
} from "lucide-react";

import {
  useReservation,
  PopulatedReservation,
} from "@/features/reservations/api/get-reservation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatImageUrl } from "@/helper/image-helper";
import { paths } from "@/config/paths";
import { cn, formatBookingId } from "@/lib/utils";

type PaymentState = "success" | "pending" | "failed";

const LoadingSkeleton = () => (
  <div className="layout-middle py-12 flex justify-center">
    <div className="w-full max-w-2xl space-y-3">
      <Skeleton className="h-52 w-full rounded-2xl" />
      <Skeleton className="h-64 w-full rounded-2xl" />
      <Skeleton className="h-32 w-full rounded-2xl" />
    </div>
  </div>
);

interface ErrorStateProps {
  onNavigateHome: () => void;
}

const ErrorState = ({ onNavigateHome }: ErrorStateProps) => (
  <div className="layout-middle py-12 flex justify-center text-center">
    <div className="w-full max-w-lg bg-card border border-border rounded-2xl p-10 space-y-5">
      <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
        <XCircle className="w-8 h-8 text-destructive" />
      </div>
      <div className="space-y-2">
        <h1 className="text-xl font-bold text-foreground">
          Reservation Not Found
        </h1>
        <p className="text-muted-foreground text-sm">
          We couldn't find the reservation you are looking for.
        </p>
      </div>
      <Button onClick={onNavigateHome} className="w-full cinema-glow">
        Back to Home
      </Button>
    </div>
  </div>
);

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

const ResultHero = ({ state }: ResultHeroProps) => {
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

interface SeatBadgeProps {
  label: string;
}

const SeatBadge = ({ label }: SeatBadgeProps) => (
  <span className="inline-flex items-center justify-center px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-md text-xs font-mono font-semibold tracking-wide">
    {label}
  </span>
);

interface MovieBannerProps {
  movie: PopulatedReservation["showTime"]["movieSchedule"]["movie"];
  theater: PopulatedReservation["showTime"]["movieSchedule"]["theater"];
  showTime: PopulatedReservation["showTime"];
  scheduleDate: string;
}

const MovieBanner = ({
  movie,
  theater,
  showTime,
  scheduleDate,
}: MovieBannerProps) => (
  <div className="flex gap-5 items-start">
    <div className="shrink-0">
      {movie.posterUrl ? (
        <img
          src={formatImageUrl(movie.posterUrl)}
          alt={movie.title}
          className="w-20 h-28 object-cover rounded-xl shadow-lg border border-border/50"
        />
      ) : (
        <div className="w-20 h-28 bg-muted rounded-xl flex flex-col items-center justify-center gap-1 text-muted-foreground border border-border/50">
          <Film className="w-5 h-5" />
          <span className="text-[10px]">No poster</span>
        </div>
      )}
    </div>

    <div className="flex-1 min-w-0 space-y-2.5 pt-1">
      <h2 className="text-lg font-bold text-foreground leading-snug line-clamp-2">
        {movie.title}
      </h2>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="truncate">{theater.name}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarIcon className="w-3.5 h-3.5 text-primary shrink-0" />
          <span>{format(new Date(scheduleDate), "EEE, MMM d, yyyy")}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
          <span>
            {format(new Date(showTime.startTime), "h:mm a")}
            {" – "}
            {format(new Date(showTime.endTime), "h:mm a")}
          </span>
        </div>
      </div>
    </div>
  </div>
);

const TicketDivider = () => (
  <div className="relative flex items-center my-1">
    <div className="flex-1 border-t border-dashed border-border/60 mx-1" />
  </div>
);

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

const BookingMeta = ({ reservation, seatLabels, state }: BookingMetaProps) => (
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

interface TotalRowProps {
  formattedPrice: string;
}

const TotalRow = ({ formattedPrice }: TotalRowProps) => (
  <div className="flex items-center justify-between py-4 px-5 bg-primary/5 border border-primary/15 rounded-xl">
    <span className="text-sm font-medium text-muted-foreground">
      Total Charged
    </span>
    <span className="text-xl font-bold text-primary tabular-nums">
      {formattedPrice}
    </span>
  </div>
);

interface ActionButtonsProps {
  state: PaymentState;
  showTimeId: string;
}

const ActionButtons = ({ state, showTimeId }: ActionButtonsProps) => (
  <div className="flex flex-col sm:flex-row gap-3">
    <Button
      variant="outline"
      className="flex-1 h-11 border-border/60 hover:border-primary/50 transition-colors"
      asChild
    >
      <Link to={paths.home.getHref()}>
        <ChevronLeft className="w-4 h-4 mr-1.5" />
        Back to Home
      </Link>
    </Button>

    {(state === "failed" || state === "pending") && (
      <Button className="flex-1 h-11 cinema-glow font-semibold" asChild>
        <Link to={paths.seatSelection.getHref(showTimeId)}>Try Again</Link>
      </Button>
    )}

    {state === "success" && (
      <Button className="flex-1 h-11 cinema-glow font-semibold" asChild>
        <Link to={paths.home.getHref()}>Browse More Films</Link>
      </Button>
    )}
  </div>
);

const getPaymentState = (reservation: PopulatedReservation): PaymentState => {
  if (
    reservation.status === "CONFIRMED" ||
    reservation.payment?.status === "PAID"
  ) {
    return "success";
  }

  if (
    reservation.status === "PENDING" &&
    reservation.payment?.status === "PENDING"
  ) {
    return "pending";
  }

  return "failed";
};

export const PaymentResultRoute = () => {
  const { reservationId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useReservation({
    reservationId: reservationId as string,
    queryConfig: {
      enabled: !!reservationId,
    },
  });

  const reservation: PopulatedReservation | undefined = data?.data.reservation;

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (isError || !reservation) {
    return <ErrorState onNavigateHome={() => navigate(paths.home.getHref())} />;
  }

  const state = getPaymentState(reservation);
  const movie = reservation.showTime.movieSchedule.movie;
  const theater = reservation.showTime.movieSchedule.theater;

  const seatLabels = reservation.reservationDetails.map(
    (d) => `${d.seat.seatRow}${d.seat.seatNumber}`,
  );

  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(reservation.totalPrice));

  return (
    <div className="layout-middle py-8 md:py-16 flex justify-center">
      <div className="w-full max-w-lg mt-15">
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
          <ResultHero state={state} />

          <div className="px-8 py-6 space-y-6">
            <MovieBanner
              movie={movie}
              theater={theater}
              showTime={reservation.showTime}
              scheduleDate={reservation.showTime.movieSchedule.date}
            />

            <TicketDivider />

            <BookingMeta
              reservation={reservation}
              seatLabels={seatLabels}
              state={state}
            />

            <TotalRow formattedPrice={formattedPrice} />

            <ActionButtons state={state} showTimeId={reservation.showTimeId} />
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Booking reference:{" "}
          <span className="font-mono">
            {formatBookingId(reservation.id)}
          </span>
        </p>
      </div>
    </div>
  );
};

export default PaymentResultRoute;
