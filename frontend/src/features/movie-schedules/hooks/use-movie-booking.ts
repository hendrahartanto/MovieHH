import { useMovieSchedulesByMovieIdAndDate } from "@/features/movie-schedules/api/get-movie-schedules-by-movieid-and-date";
import { toApiDateString } from "@/helper/format-helper";
import { addDays, isSameDay, startOfDay } from "date-fns";
import { useMemo, useState } from "react";

export const useMovieBooking = (movieId: string) => {
  const generateDateTabs = (): Date[] => {
    const today = startOfDay(new Date());
    return Array.from({ length: 7 }, (_, i) => addDays(today, i));
  };

  const dateTabs = useMemo(() => generateDateTabs(), []);
  const [selectedDate, setSelectedDate] = useState<Date>(dateTabs[0]);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(
    null
  );
  const [selectedShowtimeId, setSelectedShowtimeId] = useState<string | null>(
    null
  );

  const selectedDateStr = toApiDateString(selectedDate);
  const { data: schedulesData, isLoading: isSchedulesLoading } =
    useMovieSchedulesByMovieIdAndDate({
      movieId: movieId,
      startDate: selectedDateStr,
      endDate: selectedDateStr,
    });

  const weekStartStr = toApiDateString(dateTabs[0]);
  const weekEndStr = toApiDateString(dateTabs[dateTabs.length - 1]);
  const { data: weekSchedulesData } = useMovieSchedulesByMovieIdAndDate({
    movieId: movieId,
    startDate: weekStartStr,
    endDate: weekEndStr,
  });

  const schedules = schedulesData?.data?.movieSchedules ?? [];

  const datesWithSchedules = new Set(
    (weekSchedulesData?.data?.movieSchedules ?? []).map((s) =>
      toApiDateString(new Date(s.date))
    )
  );

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedScheduleId(null);
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
    setSelectedScheduleId,
    setSelectedShowtimeId,
    handleDateSelect,
    isDateSelected,
    hasSchedule,
  };
};
