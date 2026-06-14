import { useParams } from "react-router";
import { SeatGrid } from "@/features/reservations/components/seat-grid";
import { SeatLegend } from "@/features/reservations/components/seat-legend";
import { BookingSummary } from "@/features/reservations/components/booking-summary";
import {
  getShowTimeQueryOptions,
  getShowTimeSeatsQueryOptions,
  useShowTime,
  useShowTimeSeats,
} from "@/features/movie-schedules";
import {
  useCancelReservation,
  useCreateReservationHold,
  useCreateReservationPayment,
} from "@/features/reservations/api";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar, Clock, MapPin } from "lucide-react";
import { formatImageUrl } from "@/helper/image-helper";
import { loadMidtransSnap } from "@/lib/midtrans-snap";
import { useNotifications } from "@/components/ui/notification/notification-store";

export default function SeatSelectionRoute() {
  const { showtimeId } = useParams();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isCheckoutPending, setIsCheckoutPending] = useState(false);
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

  if (isLoadingShowTime || isLoadingSeats) {
    return (
      <div className="content-wrapper py-24 flex justify-center">
        <p className="text-muted-foreground animate-pulse">
          Loading seats for you...
        </p>
      </div>
    );
  }

  const showTime = showTimeData?.data.showTime;
  const layout = showTime?.movieSchedule.theater.layout || [];
  const price = showTime?.movieSchedule.price || 0;
  const seats = seatsData?.data.showTimeSeats || [];
  const movie = showTime?.movieSchedule.movie;
  const theater = showTime?.movieSchedule.theater;

  const handleSeatToggle = (seatId: string) => {
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

  const handleCheckout = async () => {
    if (!showtimeId || selectedSeats.length === 0 || isCheckoutPending) return;

    let reservationId: string | null = null;
    let canCancelHold = true;

    const cancelCurrentHold = () => {
      if (!reservationId || !canCancelHold) return;

      canCancelHold = false;
      cancelReservation.mutate({ reservationId });
      refreshShowTime();
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
      });

      await loadMidtransSnap();

      if (!window.snap) {
        throw new Error("Midtrans Snap is not available");
      }

      window.snap.pay(paymentResponse.data.token, {
        onSuccess: () => {
          canCancelHold = false;
          setIsCheckoutPending(false);
          setSelectedSeats([]);
          refreshShowTime();
          addNotification({
            type: "success",
            title: "Payment submitted",
            message:
              "Your reservation will be confirmed after Midtrans sends the payment notification.",
          });
        },
        onPending: () => {
          canCancelHold = false;
          setIsCheckoutPending(false);
          setSelectedSeats([]);
          refreshShowTime();
          addNotification({
            type: "info",
            title: "Payment pending",
            message:
              "Complete the payment before the reservation hold expires.",
          });
        },
        onError: () => {
          setIsCheckoutPending(false);
          cancelCurrentHold();
          addNotification({
            type: "error",
            title: "Payment failed",
            message: "The selected seats have been released.",
          });
        },
        onClose: () => {
          setIsCheckoutPending(false);
          if (!canCancelHold) return;

          cancelCurrentHold();
          addNotification({
            type: "warning",
            title: "Payment cancelled",
            message: "The selected seats have been released.",
          });
        },
      });
    } catch (error) {
      setIsCheckoutPending(false);
      cancelCurrentHold();
      addNotification({
        type: "error",
        title: "Checkout failed",
        message:
          error instanceof Error
            ? error.message
            : "Unable to start payment. Please try again.",
      });
    }
  };

  return (
    <div className="content-wrapper py-12 md:py-24 max-w-5xl">
      {movie && theater && showTime && (
        <div className="mb-10 flex flex-col md:flex-row gap-6 items-start md:items-center bg-card/50 p-6 border border-border backdrop-blur-sm">
          {movie.posterUrl ? (
            <img
              src={formatImageUrl(movie.posterUrl)}
              alt={movie.title}
              className="w-24 h-36 md:w-32 md:h-48 object-cover shadow-lg shadow-black/50"
            />
          ) : (
            <div className="w-24 h-36 md:w-32 md:h-48 bg-muted flex items-center justify-center">
              No Poster
            </div>
          )}

          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-foreground tracking-tight">
                {movie.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="font-medium text-foreground">
                    {theater.name}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>
                    {format(
                      new Date(showTime.movieSchedule.date),
                      "MMMM d, yyyy",
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-primary/10 text-primary px-2.5 py-1 rounded-md font-medium border border-primary/20">
                  <Clock className="w-4 h-4" />
                  <span>
                    {format(new Date(showTime.startTime), "h:mm a")} -{" "}
                    {format(new Date(showTime.endTime), "h:mm a")}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-muted-foreground text-sm max-w-2xl line-clamp-2">
              Select your preferred seats below. Premium viewing experience
              guaranteed.
            </p>
          </div>
        </div>
      )}

      <div className="bg-card/30 p-8 border border-border/50 overflow-x-auto shadow-inner relative">
        <div className="absolute inset-0 bg-linear-to-b from-primary/5 to-transparent pointer-events-none rounded-t-2xl" />
        <div className="relative z-10 min-w-[600px]">
          <SeatGrid
            layout={layout}
            seats={seats}
            selectedSeats={selectedSeats}
            onSeatToggle={handleSeatToggle}
          />
          <div className="mt-12">
            <SeatLegend />
          </div>
        </div>
      </div>

      <BookingSummary
        price={price}
        selectedCount={selectedSeats.length}
        isCheckoutPending={isCheckoutPending}
        onCheckout={handleCheckout}
      />
    </div>
  );
}
