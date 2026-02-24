import { useMovieSchedulesByTheaterIdAndDate } from "@/features/movie-schedules/api/get-movie-schedules-by-theaterid-and-date";
import { toApiDateString } from "@/helper/format-helper";
import { addDays, isSameDay, startOfDay } from "date-fns";
import { useMemo, useState } from "react";

export const useCinemaBooking = (theaterId: string) => {
  const generateDateTabs = (): Date[] => {
    const today = startOfDay(new Date());
    return Array.from({ length: 7 }, (_, i) => addDays(today, i));
  };

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
      theaterId: theaterId,
      startDate: selectedDateStr,
      endDate: selectedDateStr,
    });

  const weekStartStr = toApiDateString(dateTabs[0]);
  const weekEndStr = toApiDateString(dateTabs[dateTabs.length - 1]);
  const { data: weekSchedulesData } = useMovieSchedulesByTheaterIdAndDate({
    theaterId: theaterId,
    startDate: weekStartStr,
    endDate: weekEndStr,
  });

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

  const handleAccordionToggle = (scheduleId: string) => {
    const isOpening = selectedScheduleId !== scheduleId;
    setSelectedScheduleId(isOpening ? scheduleId : null);
    setSelectedShowtimeId(null);
  };

  const isDateSelected = (date: Date) => isSameDay(date, selectedDate);
  const hasSchedule = (date: Date) =>
    datesWithSchedules.has(toApiDateString(date));

  return {
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
  };
};

export type UseCinemaBookingResult = ReturnType<typeof useCinemaBooking>;
