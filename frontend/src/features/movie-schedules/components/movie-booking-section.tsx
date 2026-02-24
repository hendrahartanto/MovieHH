import { Ticket } from "lucide-react";
import { toApiDateString } from "@/helper/format-helper";
import { DateTab } from "./date-tab";
import { ScheduleAccordionForMovie } from "./schedule-accordion-for-movie";
import { useMovieBooking } from "../hooks/use-movie-booking";
import { ScheduleSkeleton, EmptyScheduleState } from "./schedule-states";

interface MovieBookingSectionProps {
  movieId: string;
}

export const MovieBookingSection = ({ movieId }: MovieBookingSectionProps) => {
  const {
    dateTabs,
    selectedDate,
    schedules,
    isSchedulesLoading,
    selectedScheduleId,
    selectedShowtimeId,
    setSelectedScheduleId,
    setSelectedShowtimeId,
    handleDateSelect,
    isDateSelected,
    hasSchedule,
  } = useMovieBooking(movieId);

  return (
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
            isSelected={isDateSelected(date)}
            hasSchedule={hasSchedule(date)}
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
              key={schedule.id}
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
  );
};
