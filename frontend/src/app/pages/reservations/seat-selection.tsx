import { useParams } from "react-router";
import { SeatGrid } from "@/features/reservations/components/seat-grid";
import { SeatLegend } from "@/features/reservations/components/seat-legend";
import { BookingSummary } from "@/features/reservations/components/booking-summary";
import { ActivePaymentCard } from "@/features/reservations/components/active-payment-card";
import {
  getShowTimeQueryOptions,
  getShowTimeSeatsQueryOptions,
  useShowTime,
  useShowTimeSeats,
} from "@/features/movie-schedules";
import {
  getActiveReservationPaymentQueryOptions,
  useActiveReservationPayment,
  useCancelReservation,
  useCreateReservationHold,
  useCreateReservationPayment,
} from "@/features/reservations/api";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatImageUrl } from "@/helper/image-helper";
import { loadMidtransSnap } from "@/lib/midtrans-snap";
import { useNotifications } from "@/components/ui/notification/notification-store";

const MovieInfoSkeleton = () => (
  <div className="mb-10 flex flex-col md:flex-row gap-6 items-start p-6 bg-card/50 border border-border rounded-xl">
    <Skeleton className="w-24 h-36 md:w-32 md:h-48 rounded-lg shrink-0" />
    <div className="flex-1 space-y-4 pt-1">
      <div className="space-y-2">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-7 w-28" />
        <Skeleton className="h-7 w-36" />
        <Skeleton className="h-7 w-32" />
      </div>
    </div>
  </div>
);

const SeatGridSkeleton = () => (
  <div className="bg-card/30 p-8 border border-border/50 flex flex-col items-center gap-3 min-h-80 justify-center">
    <Skeleton className="h-4 w-48 mb-4" />
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="flex gap-2">
        {Array.from({ length: 10 }).map((__, j) => (
          <Skeleton key={j} className="w-8 h-8 rounded-t-lg rounded-b-sm" />
        ))}
      </div>
    ))}
  </div>
);

export default function SeatSelectionRoute() {
  const { showtimeId } = useParams();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isCheckoutPending, setIsCheckoutPending] = useState(false);
  const [isResumePaymentPending, setIsResumePaymentPending] = useState(false);
  const addNotification = useNotifications((state) => state.addNotification);
  const queryClient = useQueryClient();
  const createReservationHold = useCreateReservationHold();
  const createReservationPayment = useCreateReservationPayment();
  const cancelReservation = useCancelReservation();

  const { data: showTimeData, isLoading: isLoadingShowTime } = useShowTime({
    showTimeId: showtimeId as string,
  });

  const { data: seatsData, isLoading: isLoadingSeats } = useShowTimeSeats({
    showTimeId: showtimeId as string,
  });

  const { data: activePaymentData } =
    useActiveReservationPayment();

  const activePayment = activePaymentData?.data.activePayment ?? null;
  const hasActivePayment = Boolean(activePayment);
  const activePaymentId = activePayment?.reservation.id;

  useEffect(() => {
    if (activePaymentId) {
      setSelectedSeats([]);
    }
  }, [activePaymentId]);

  const showTime = showTimeData?.data.showTime;
  const layout = showTime?.movieSchedule.theater.layout ?? [];
  const price = showTime?.movieSchedule.price ?? 0;
  const seats = seatsData?.data.showTimeSeats ?? [];
  const movie = showTime?.movieSchedule.movie;
  const theater = showTime?.movieSchedule.theater;

  const handleSeatToggle = (seatId: string) => {
    if (hasActivePayment) return;
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId],
    );
  };

  const refreshShowTime = () => {
    if (!showtimeId) return;
    void queryClient.invalidateQueries({
      queryKey: getShowTimeQueryOptions(showtimeId).queryKey,
    });
    void queryClient.invalidateQueries({
      queryKey: getShowTimeSeatsQueryOptions(showtimeId).queryKey,
    });
  };

  const refreshReservationState = () => {
    refreshShowTime();
    void queryClient.invalidateQueries({
      queryKey: getActiveReservationPaymentQueryOptions().queryKey,
    });
  };

  const openSnapPayment = async (paymentToken: string) => {
    await loadMidtransSnap();

    if (!window.snap) {
      throw new Error("Midtrans Snap is not available");
    }

    window.snap.pay(paymentToken, {
      onSuccess: () => {
        setSelectedSeats([]);
        refreshReservationState();
        addNotification({
          type: "success",
          title: "Payment submitted",
          message:
            "Your reservation will be confirmed after Midtrans sends the payment notification.",
        });
      },
      onPending: () => {
        setSelectedSeats([]);
        refreshReservationState();
        addNotification({
          type: "info",
          title: "Payment pending",
          message: "Resume or cancel this payment before booking other seats.",
        });
      },
      onError: () => {
        refreshReservationState();
        addNotification({
          type: "error",
          title: "Payment failed",
          message: "Please try again",
        });
      },
      onClose: () => {
        refreshReservationState();
        addNotification({
          type: "warning",
          title: "Payment paused",
          message:
            "Your payment is still active. Resume or cancel it before booking other seats.",
        });
      },
    });
  };

  const handleCheckout = async () => {
    if (!showtimeId || selectedSeats.length === 0 || isCheckoutPending) return;

    if (activePayment) {
      addNotification({
        type: "warning",
        title: "Ongoing payment found",
        message: "Complete or cancel your current reservation first.",
      });
      return;
    }

    let reservationId: string | null = null;
    let paymentCreated = false;

    const cancelReservationWithoutPayment = async () => {
      if (!reservationId || paymentCreated) return;
      try {
        await cancelReservation.mutateAsync({ reservationId });
      } catch {
        // Error handled by API interceptor
      }
    };

    try {
      setIsCheckoutPending(true);

      const holdResponse = await createReservationHold.mutateAsync({
        showTimeId: showtimeId,
        seatIds: selectedSeats,
        count: selectedSeats.length,
      });

      reservationId = holdResponse.data.newReservationHold.id;

      const paymentResponse = await createReservationPayment.mutateAsync({
        reservationId,
        returnUrl: window.location.href,
      });

      paymentCreated = true;
      setSelectedSeats([]);
      refreshReservationState();

      await openSnapPayment(paymentResponse.data.token);
    } catch {
      await cancelReservationWithoutPayment();
    } finally {
      setIsCheckoutPending(false);
    }
  };

  const handleResumePayment = async () => {
    const paymentToken = activePayment?.payment?.token;

    if (!paymentToken) {
      addNotification({
        type: "warning",
        title: "Payment token unavailable",
        message: "Cancel this reservation and choose seats again.",
      });
      return;
    }

    try {
      setIsResumePaymentPending(true);
      await openSnapPayment(paymentToken);
    } catch (error) {
      addNotification({
        type: "error",
        title: "Unable to resume payment",
        message:
          error instanceof Error
            ? error.message
            : "Please try again or cancel this reservation.",
      });
    } finally {
      setIsResumePaymentPending(false);
    }
  };

  const handleCancelActivePayment = async () => {
    if (!activePayment) return;
    try {
      await cancelReservation.mutateAsync({
        reservationId: activePayment.reservation.id,
      });
      setSelectedSeats([]);
      refreshReservationState();
      addNotification({
        type: "success",
        title: "Reservation cancelled",
        message:
          "The Midtrans payment was cancelled and your seats were released.",
      });
    } catch {
      // Error handled by API interceptor
    }
  };

  return (
    <div className="content-wrapper py-12 md:py-24 max-w-5xl">
      {isLoadingShowTime ? (
        <MovieInfoSkeleton />
      ) : (
        movie &&
        theater &&
        showTime && (
          <div className="mb-10 flex flex-col md:flex-row gap-6 items-start md:items-center bg-card/50 p-6 border border-border rounded-xl backdrop-blur-sm">
            {movie.posterUrl ? (
              <img
                src={formatImageUrl(movie.posterUrl)}
                alt={movie.title}
                className="w-24 h-36 md:w-32 md:h-48 object-cover rounded-lg shadow-lg shadow-black/50 shrink-0"
              />
            ) : (
              <div className="w-24 h-36 md:w-32 md:h-48 bg-muted rounded-lg flex items-center justify-center text-xs text-muted-foreground shrink-0">
                No Poster
              </div>
            )}

            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-2xl md:text-4xl font-bold text-foreground tracking-tight leading-tight">
                  {movie.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    <span className="font-medium text-foreground">
                      {theater.name}
                    </span>
                  </span>
                  <span className="text-border">·</span>
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    {format(
                      new Date(showTime.movieSchedule.date),
                      "MMMM d, yyyy",
                    )}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-md font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    {format(new Date(showTime.startTime), "h:mm a")} –{" "}
                    {format(new Date(showTime.endTime), "h:mm a")}
                  </span>
                </div>
              </div>

              {movie.synopsis && (
                <p className="text-muted-foreground text-sm max-w-2xl line-clamp-2 leading-relaxed">
                  {movie.synopsis}
                </p>
              )}
            </div>
          </div>
        )
      )}

      {activePayment && (
        <ActivePaymentCard
          activePayment={activePayment}
          isResumePending={isResumePaymentPending}
          isCancelPending={cancelReservation.isPending}
          onResumePayment={handleResumePayment}
          onCancelPayment={handleCancelActivePayment}
        />
      )}

      {isLoadingSeats ? (
        <SeatGridSkeleton />
      ) : (
        <div className="bg-card/30 border border-border/50 overflow-x-auto shadow-inner relative rounded-xl">
          <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-primary/5 to-transparent pointer-events-none rounded-t-xl" />
          <div className="relative z-10 p-8 min-w-[600px]">
            <SeatGrid
              layout={layout}
              seats={seats}
              selectedSeats={selectedSeats}
              onSeatToggle={handleSeatToggle}
            />
            <div className="mt-10 pt-6 border-t border-border/30">
              <SeatLegend />
            </div>
          </div>
        </div>
      )}

      <BookingSummary
        price={price}
        selectedCount={selectedSeats.length}
        isCheckoutPending={isCheckoutPending}
        isCheckoutDisabled={hasActivePayment}
        checkoutDisabledReason={
          hasActivePayment
            ? "Complete or cancel your ongoing payment before booking other seats."
            : undefined
        }
        onCheckout={handleCheckout}
      />
    </div>
  );
}
