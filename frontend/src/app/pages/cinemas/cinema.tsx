import { useState, useMemo } from "react";
import { format, addDays, startOfDay, isSameDay } from "date-fns";
import { Ticket, Calendar } from "lucide-react";
import { useParams } from "react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { useMovieSchedulesByTheaterIdAndDate } from "@/features/movie-schedules/api/get-movie-schedules-by-theaterid-and-date";
import { toApiDateString } from "@/helper/format-helper";
import { CinemaInfo } from "@/features/movie-schedules/components/cinema-info";
import { DateTab } from "@/features/movie-schedules/components/date-tab";
import { ScheduleAccordionForCinema } from "@/features/theaters/components/schedule-accordion-for-cinema";

const CinemaInfoSkeleton = () => (
  <div className="rounded-2xl border border-border bg-card/80 p-6 sm:p-8 mb-10 space-y-4">
    <div className="flex gap-6">
      <Skeleton className="w-16 h-16 rounded-2xl shrink-0" />
      <div className="flex-1 space-y-3">
        <Skeleton className="h-7 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  </div>
);

const ScheduleSkeleton = () => (
  <div className="space-y-3">
    {[1, 2, 3].map((i) => (
      <Skeleton key={i} className="w-full h-20 rounded-xl" />
    ))}
  </div>
);

const EmptyScheduleState = ({ date }: { date: Date }) => (
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

const CinemaDetailPage = () => {
  const generateDateTabs = (): Date[] => {
    const today = startOfDay(new Date());
    return Array.from({ length: 7 }, (_, i) => addDays(today, i));
  };

  const { theaterId } = useParams<{ theaterId: string }>();

  const dateTabs = useMemo(() => generateDateTabs(), []);
  const [selectedDate, setSelectedDate] = useState<Date>(dateTabs[0]);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(
    null,
  );
  const [selectedShowtimeId, setSelectedShowtimeId] = useState<string | null>(
    null,
  );

  const selectedDateStr = toApiDateString(selectedDate);
  const { data: schedulesData, isLoading: isSchedulesLoading } =
    useMovieSchedulesByTheaterIdAndDate({
      theaterId: theaterId!,
      startDate: selectedDateStr,
      endDate: selectedDateStr,
    });

  const weekStartStr = toApiDateString(dateTabs[0]);
  const weekEndStr = toApiDateString(dateTabs[dateTabs.length - 1]);
  const { data: weekSchedulesData } = useMovieSchedulesByTheaterIdAndDate({
    theaterId: theaterId!,
    startDate: weekStartStr,
    endDate: weekEndStr,
  });

  const schedules = schedulesData?.data?.movieSchedules ?? [];

  const datesWithSchedules = new Set(
    (weekSchedulesData?.data?.movieSchedules ?? []).map((s) =>
      toApiDateString(new Date(s.date)),
    ),
  );

  const theater =
    schedules[0]?.theater ??
    weekSchedulesData?.data?.movieSchedules?.[0]?.theater;

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedScheduleId(null);
    setSelectedShowtimeId(null);
  };

  const handleAccordionToggle = (scheduleId: string) => {
    const isOpening = selectedScheduleId !== scheduleId;
    setSelectedScheduleId(isOpening ? scheduleId : null);
    setSelectedShowtimeId(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="relative w-full h-[280px] sm:h-80 overflow-hidden bg-card">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-background/60 to-background z-10" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 20px,
              hsla(0,84%,60%,0.15) 20px,
              hsla(0,84%,60%,0.15) 21px
            )`,
          }}
        />
        <div className="absolute inset-0 cinema-gradient opacity-20" />
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full bg-primary/20 blur-3xl" />
      </div>

      <div className="content-wrapper -mt-32 relative z-20 pb-20">
        {!theater ? <CinemaInfoSkeleton /> : <CinemaInfo theater={theater} />}

        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-border" />
            <h2 className="text-xl font-semibold flex items-center gap-2 whitespace-nowrap">
              <Ticket className="w-5 h-5 text-primary" />
              Now Showing
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
                <ScheduleAccordionForCinema
                  key={schedule.id}
                  schedule={schedule}
                  isOpen={selectedScheduleId === schedule.id}
                  selectedShowtimeId={selectedShowtimeId}
                  onToggle={() => handleAccordionToggle(schedule.id)}
                  onShowtimeSelect={(id) => setSelectedShowtimeId(id)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default CinemaDetailPage;
