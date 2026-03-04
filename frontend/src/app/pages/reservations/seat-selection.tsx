import { useParams } from "react-router";
import { SeatGrid } from "@/features/reservations/components/seat-grid";
import { SeatLegend } from "@/features/reservations/components/seat-legend";
import { BookingSummary } from "@/features/reservations/components/booking-summary";
import { useShowTime, useShowTimeSeats } from "@/features/movie-schedules";
import { format } from "date-fns";
import { MapPin, Film, Clock } from "lucide-react";
import { formatImageUrl } from "@/helper/image-helper";
import moviePlaceHolder from "@/assets/movie-placeholder.jpg";

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
      <div className="content-wrapper py-24 flex justify-center items-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground animate-pulse">
            Loading seating arrangement...
          </p>
        </div>
      </div>
    );
  }

  const showTime = showTimeData?.data.showTime;
  const layout = showTime?.movieSchedule.theater.layout || [];
  const price = showTime?.movieSchedule.price || 0;
  const seats = seatsData?.data.showTimeSeats || [];
  const movie = showTime?.movieSchedule.movie;
  const theater = showTime?.movieSchedule.theater;
  const startTime = showTime?.startTime
    ? new Date(showTime.startTime)
    : new Date();

  return (
    <div className="content-wrapper py-12 md:py-24 max-w-5xl">
      {/* Header Info Section */}
      {movie && theater && (
        <div className="mb-10 p-6 sm:p-8 rounded-2xl border border-border bg-card/60 backdrop-blur-md shadow-2xl flex flex-col sm:flex-row gap-6 sm:gap-8 items-start relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1/3 h-full bg-primary/5 blur-3xl -z-10" />

          <div className="shrink-0 w-24 sm:w-32 rounded-xl overflow-hidden cinema-border cinema-glow">
            <img
              src={
                movie.posterUrl
                  ? formatImageUrl(movie.posterUrl)
                  : moviePlaceHolder
              }
              alt={movie.title}
              className="w-full aspect-2/3 object-cover"
            />
          </div>

          <div className="flex-1">
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight mb-2 text-foreground">
              {movie.title}
            </h1>

            <div className="flex flex-col gap-3 mt-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Film className="w-5 h-5 text-primary shrink-0" />
                <span className="font-medium text-foreground">
                  {theater.name}
                </span>
              </div>
              {theater.location && (
                <div className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-sm">
                    {theater.location.name} - {theater.location.address}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm font-medium bg-secondary/80 px-3 py-1 rounded-full border border-border">
                  {format(startTime, "EEEE, dd MMM yyyy")} •{" "}
                  {format(startTime, "HH:mm")}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Screen & Seat Grid */}
      <div className="bg-card/30 rounded-2xl p-6 sm:p-10 border border-border/50 shadow-inner overflow-x-auto relative mb-32 md:mb-12">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none rounded-2xl" />
        <SeatGrid layout={layout} seats={seats} />
        <SeatLegend />
      </div>

      {/* Sticky Booking Summary */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/80 backdrop-blur-xl border-t border-border/50 md:relative md:bg-transparent md:backdrop-blur-none md:border-none md:p-0">
        <div className="max-w-5xl mx-auto">
          <BookingSummary price={price} />
        </div>
      </div>
    </div>
  );
}
