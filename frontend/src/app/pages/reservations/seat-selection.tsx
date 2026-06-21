import { useParams, useNavigate } from "react-router";
import {
  ActivePaymentCard,
  BookingSummary,
  MovieInfoSkeleton,
  SeatGrid,
  SeatGridSkeleton,
  SeatLegend,
} from "@/features/reservations/components/seat-selection";
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
import { Calendar, Clock, MapPin, Loader2 } from "lucide-react";
import { formatImageUrl } from "@/helper/image-helper";
import { loadMidtransSnap } from "@/lib/midtrans-snap";
import { useNotifications } from "@/components/ui/notification/notification-store";
import { useReservation } from "@/features/reservations/api/get-reservation";

const SeatSelectionRoute = () => {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isCheckoutPending, setIsCheckoutPending] = useState(false);
  const [isResumePaymentPending, setIsResumePaymentPending] = useState(false);

  const [pollingReservationId, setPollingReservationId] = useState<
    string | null
  >(null);

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

  const { data: activePaymentData } = useActiveReservationPayment();

  const { data: polledReservationData } = useReservation({
    reservationId: pollingReservationId as string,
    queryConfig: {
      enabled: !!pollingReservationId,
      refetchInterval: (query: any) => {
        const status = query.state.data?.data?.reservation?.status;
        if (
          status === "CONFIRMED" ||
          status === "CANCELLED" ||
          status === "EXPIRED"
        ) {
          return false;
        }
        return 3000;
      },
    },
  });

  useEffect(() => {
    if (polledReservationData?.data.reservation) {
      const status = polledReservationData.data.reservation.status;
      if (
        status === "CONFIRMED" ||
        status === "CANCELLED" ||
        status === "EXPIRED"
      ) {
        setPollingReservationId(null);
        navigate(
          `/reservations/${polledReservationData.data.reservation.id}/result`,
        );
      }
    }
  }, [polledReservationData, navigate]);

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

  const openSnapPayment = async (
    paymentToken: string,
    currentReservationId: string,
  ) => {
    await loadMidtransSnap();

    if (!window.snap) {
      throw new Error("Midtrans Snap is not available");
    }

    window.snap.pay(paymentToken, {
      onSuccess: () => {
        setSelectedSeats([]);
        refreshReservationState();
        setPollingReservationId(currentReservationId);
      },
      onPending: () => {
        setSelectedSeats([]);
        refreshReservationState();
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
      } catch {}
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

      await openSnapPayment(paymentResponse.data.token, reservationId);
    } catch {
      await cancelReservationWithoutPayment();
    } finally {
      setIsCheckoutPending(false);
    }
  };

  const handleResumePayment = async () => {
    const paymentToken = activePayment?.payment?.token;
    const reservationId = activePayment?.reservation.id;

    if (!paymentToken || !reservationId) {
      addNotification({
        type: "warning",
        title: "Payment token unavailable",
        message: "Cancel this reservation and choose seats again.",
      });
      return;
    }

    try {
      setIsResumePaymentPending(true);
      await openSnapPayment(paymentToken, reservationId);
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
    } catch {}
  };

  return (
    <>
      {pollingReservationId && (
        <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-6 p-8 bg-card border border-border rounded-2xl shadow-2xl cinema-glow max-w-sm w-full mx-4 text-center">
            <Loader2 className="w-16 h-16 text-primary animate-spin" />
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">
                Processing Payment
              </h2>
              <p className="text-muted-foreground text-sm">
                Please wait while we confirm your reservation with the payment
                gateway.
              </p>
            </div>
          </div>
        </div>
      )}

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
    </>
  );
};

export default SeatSelectionRoute;
