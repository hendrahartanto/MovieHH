import { useParams, useNavigate } from "react-router";
import {
  useReservation,
  PopulatedReservation,
} from "@/features/reservations/api/get-reservation";
import { paths } from "@/config/paths";
import { formatBookingId } from "@/lib/utils";
import {
  LoadingSkeleton,
  ErrorState,
  ResultHero,
  MovieBanner,
  TicketDivider,
  BookingMeta,
  TotalRow,
  ActionButtons,
  PaymentState,
} from "@/features/reservations/components/payment-result";

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

