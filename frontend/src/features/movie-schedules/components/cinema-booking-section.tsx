import { Ticket } from "lucide-react";
import { toApiDateString } from "@/helper/format-helper";
import { DateTab } from "@/features/movie-schedules/components/date-tab";
import { ScheduleAccordionForCinema } from "./schedule-accordion-for-cinema";
import {
  ScheduleSkeleton,
  EmptyScheduleState,
} from "@/features/movie-schedules/components/schedule-states";
import { useCinemaBooking } from "../hooks/use-cinema-booking";

interface CinemaBookingSectionProps {
  theaterId: string;
}

export const CinemaBookingSection = ({
  theaterId,
}: CinemaBookingSectionProps) => {
  const {
    dateTabs,
    selectedDate,
    schedules,
    isSchedulesLoading,
    selectedScheduleId,
    selectedShowtimeId,
    setSelectedShowtimeId,
    handleDateSelect,
    handleAccordionToggle,
    isDateSelected,
    hasSchedule,
  } = useCinemaBooking(theaterId);

  return (
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
  );
};
