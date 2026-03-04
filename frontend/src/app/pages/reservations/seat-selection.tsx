import { useParams } from "react-router";
import { SeatGrid } from "@/features/reservations/components/seat-grid";
import { SeatLegend } from "@/features/reservations/components/seat-legend";
import { BookingSummary } from "@/features/reservations/components/booking-summary";
import { useShowTime, useShowTimeSeats } from "@/features/movie-schedules";

export default function SeatSelectionRoute() {
  const { showtimeId } = useParams();

  const { data: showTimeData, isLoading: isLoadingShowTime } = useShowTime({
    showTimeId: showtimeId as string,
  });

  const { data: seatsData, isLoading: isLoadingSeats } = useShowTimeSeats({
    showTimeId: showtimeId as string,
  });

  if (isLoadingShowTime || isLoadingSeats) {
    return (
      <div className="content-wrapper py-24 flex justify-center">
        <p className="text-muted-foreground">Loading seats...</p>
      </div>
    );
  }

  const showTime = showTimeData?.data.showTime;
  const layout = showTime?.movieSchedule.theater.layout || [];
  const price = showTime?.movieSchedule.price || 0;
  const seats = seatsData?.data.showTimeSeats || [];

  return (
    <div className="content-wrapper py-24">
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          Cinemas
        </h2>
        <p className="text-muted-foreground">
          Find your favorite cinema and enjoy the ultimate movie experience.
        </p>
      </div>

      <div className="bg-card/30 p-8 border border-border/50 overflow-x-auto">
        <SeatGrid layout={layout} seats={seats} />
        <SeatLegend />
      </div>

      <BookingSummary price={price} />
    </div>
  );
}
