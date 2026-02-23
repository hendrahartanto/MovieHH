import { useMovie } from "@/features/movies/api/get-movie";
import { MovieStatus } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Ticket } from "lucide-react";
import { useState, useMemo } from "react";
import { format, addDays, startOfDay, isSameDay } from "date-fns";
import { useParams } from "react-router";
import { useMovieSchedulesByMovieIdAndDate } from "@/features/movie-schedules/api/get-movie-schedules-by-movieid-and-date";
import { MovieHero } from "@/features/movies/components/movie-hero";
import { MovieInfo } from "@/features/movies/components/movie-info";
import { DateTab } from "@/features/movie-schedules/components/date-tab";
import { ScheduleAccordionForMovie } from "@/features/movie-schedules/components/schedule-accordion-for-movie";
import { TrailerModal } from "@/features/movies/components/trailer-modal";
import { toApiDateString } from "@/helper/format-helper";

const MovieDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-background">
      <Skeleton className="w-full h-[500px]" />
      <div className="layout-middle py-10 space-y-6">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );
};

const ScheduleSkeleton = () => {
  return (
    <div className="space-y-3">
      {[1, 2].map((i) => (
        <Skeleton key={i} className="w-full h-16 rounded-xl" />
      ))}
    </div>
  );
};

const EmptyScheduleState = ({ date }: { date: Date }) => {
  return (
    <div className="rounded-xl border border-border bg-card/50 p-10 text-center">
      <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-50" />
      <p className="text-muted-foreground text-sm">
        No screenings on{" "}
        <span className="text-foreground font-medium">
          {format(date, "EEEE, dd MMMM yyyy")}
        </span>
      </p>
    </div>
  );
};

const MoviePage = () => {
  const generateDateTabs = (): Date[] => {
    const today = startOfDay(new Date());
    return Array.from({ length: 7 }, (_, i) => addDays(today, i));
  };

  const { movieId } = useParams<{ movieId: string }>();

  const dateTabs = useMemo(() => generateDateTabs(), []);
  const [selectedDate, setSelectedDate] = useState<Date>(dateTabs[0]);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(
    null,
  );
  const [selectedShowtimeId, setSelectedShowtimeId] = useState<string | null>(
    null,
  );
  const [showTrailer, setShowTrailer] = useState(false);

  const { data: movieData, isLoading: isMovieLoading } = useMovie({
    movieId: movieId!,
  });

  const selectedDateStr = toApiDateString(selectedDate);
  const { data: schedulesData, isLoading: isSchedulesLoading } =
    useMovieSchedulesByMovieIdAndDate({
      movieId: movieId!,
      startDate: selectedDateStr,
      endDate: selectedDateStr,
    });

  const weekStartStr = toApiDateString(dateTabs[0]);
  const weekEndStr = toApiDateString(dateTabs[dateTabs.length - 1]);
  const { data: weekSchedulesData } = useMovieSchedulesByMovieIdAndDate({
    movieId: movieId!,
    startDate: weekStartStr,
    endDate: weekEndStr,
  });

  if (isMovieLoading) return <MovieDetailSkeleton />;

  const movie = movieData?.data?.movie;
  if (!movie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-lg">Movie not found.</p>
      </div>
    );
  }

  const schedules = schedulesData?.data?.movieSchedules ?? [];

  const datesWithSchedules = new Set(
    (weekSchedulesData?.data?.movieSchedules ?? []).map((s) =>
      toApiDateString(new Date(s.date)),
    ),
  );

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedScheduleId(null);
    setSelectedShowtimeId(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <MovieHero movie={movie} onPlayTrailer={() => setShowTrailer(true)} />

      <div className="content-wrapper -mt-32 relative z-10 pb-20">
        <MovieInfo movie={movie} onPlayTrailer={() => setShowTrailer(true)} />

        {movie.status === MovieStatus.ACTIVE && (
          <section className="mt-14">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-border" />
              <h2 className="text-xl font-semibold flex items-center gap-2 whitespace-nowrap">
                <Ticket className="w-5 h-5 text-primary" />
                Book Tickets
              </h2>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-3 mb-8 scrollbar-hide">
              {dateTabs.map((date) => (
                <DateTab
                  key={toApiDateString(date)}
                  date={date}
                  isSelected={isSameDay(date, selectedDate)}
                  hasSchedule={datesWithSchedules.has(toApiDateString(date))}
                  onClick={() => handleDateSelect(date)}
                />
              ))}
            </div>

            {isSchedulesLoading ? (
              <ScheduleSkeleton />
            ) : schedules.length === 0 ? (
              <EmptyScheduleState date={selectedDate} />
            ) : (
              <div className="space-y-3">
                {schedules.map((schedule) => (
                  <ScheduleAccordionForMovie
                    schedule={schedule}
                    selectedScheduleId={selectedScheduleId}
                    selectedShowtimeId={selectedShowtimeId}
                    setSelectedScheduleId={(scheduleId) =>
                      setSelectedScheduleId(scheduleId)
                    }
                    setSelectedShowtimeId={(showtimeId) =>
                      setSelectedShowtimeId(showtimeId)
                    }
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {movie.status === MovieStatus.COMING_SOON && (
          <div className="mt-14 rounded-xl cinema-border p-10 text-center bg-card/50">
            <div className="w-14 h-14 rounded-full cinema-gradient flex items-center justify-center mx-auto mb-4 cinema-glow">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold mb-2">Coming Soon</p>
            <p className="text-muted-foreground max-w-sm mx-auto">
              This movie is not yet available for booking. Stay tuned for the
              schedule!
            </p>
          </div>
        )}
      </div>

      <TrailerModal
        isOpen={showTrailer}
        movie={movie}
        onClose={() => setShowTrailer(false)}
      />
    </div>
  );
};

export default MoviePage;
