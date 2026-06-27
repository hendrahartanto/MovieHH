import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const CINEMA_TIMEZONE = "Asia/Jakarta";

export const updateDateOnly = (original: Date, newDate: Date): Date => {
  const origDayjs = dayjs(original).tz(CINEMA_TIMEZONE);
  const newDayjs = dayjs(newDate).tz(CINEMA_TIMEZONE)
    .hour(origDayjs.hour())
    .minute(origDayjs.minute())
    .second(origDayjs.second())
    .millisecond(origDayjs.millisecond());
  return newDayjs.toDate();
};

export const combineDateAndTime = (date: Date, time: string): Date => {
  const [hours, minutes] = time.split(":").map(Number);
  const dateStr = dayjs(date).tz(CINEMA_TIMEZONE).format("YYYY-MM-DD");
  
  // Combine date and time relative to cinema timezone
  const combined = dayjs.tz(`${dateStr} ${hours}:${minutes}`, "YYYY-MM-DD H:m", CINEMA_TIMEZONE);
  return combined.toDate();
};
