import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Calendar, MapPin, Clock } from "lucide-react";
import { format } from "date-fns";

interface Schedule {
  id: string;
  startTime: string;
  endTime: string;
  movieTitle: string;
  theaterName: string;
  bookedSeats: number;
  totalSeats: number;
  occupancyPercent: number;
}

interface TodayShowtimesProps {
  todaySchedules?: Schedule[];
  isLoading?: boolean;
}

function getOccupancyColor(pct: number) {
  if (pct >= 85) return "from-rose-500 to-red-600";
  if (pct >= 60) return "from-amber-400 to-orange-500";
  return "from-violet-500 to-indigo-500";
}

function getOccupancyBadge(pct: number) {
  if (pct >= 85) return "bg-rose-500/10 text-rose-400 border-rose-500/20";
  if (pct >= 60) return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  return "bg-violet-500/10 text-violet-400 border-violet-500/20";
}

export const TodayShowtimes = ({
  todaySchedules,
  isLoading,
}: TodayShowtimesProps) => {
  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-4 border-b border-border/50 px-6 pt-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold leading-none">
                Today&apos;s Showtimes
              </CardTitle>
              <CardDescription className="mt-1 text-xs">
                Real-time seat occupancy per hall
              </CardDescription>
            </div>
          </div>
          {!isLoading && todaySchedules && (
            <span className="text-xs text-muted-foreground font-medium bg-muted/50 px-2.5 py-1 rounded-full border border-border/60">
              {todaySchedules.length} show
              {todaySchedules.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {isLoading || !todaySchedules ? (
          <ul className="divide-y divide-border/40">
            {[...Array(3)].map((_, i) => (
              <li key={i} className="px-6 py-4 animate-pulse space-y-3">
                <div className="flex justify-between items-center">
                  <div className="space-y-1.5">
                    <div className="h-4 bg-muted/50 rounded w-44" />
                    <div className="h-3 bg-muted/40 rounded w-28" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-muted/50 rounded w-16" />
                    <div className="h-6 bg-muted/40 rounded w-10" />
                  </div>
                </div>
                <div className="h-1.5 bg-muted rounded-full w-full" />
              </li>
            ))}
          </ul>
        ) : todaySchedules.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center px-6">
            <Calendar className="w-8 h-8 text-muted-foreground/30 mb-3" />
            <p className="text-sm font-medium text-muted-foreground">
              No showtimes today
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Check back once schedules are set.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border/40">
            {todaySchedules.map((schedule) => (
              <li
                key={schedule.id}
                className="px-6 py-4 hover:bg-muted/20 transition-colors duration-150"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <h4 className="font-semibold text-foreground text-sm leading-tight truncate">
                      {schedule.movieTitle}
                    </h4>
                    <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 shrink-0" />
                      {schedule.theaterName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground bg-muted/60 border border-border/60 px-2 py-1 rounded-md">
                      <Clock className="w-3 h-3" />
                      {format(new Date(schedule.startTime), "h:mm a")}
                    </span>
                    <span
                      className={`text-xs font-semibold border px-2 py-1 rounded-md ${getOccupancyBadge(schedule.occupancyPercent)}`}
                    >
                      {schedule.occupancyPercent}%
                    </span>
                  </div>
                </div>

                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-linear-to-r ${getOccupancyColor(schedule.occupancyPercent)} rounded-full transition-all duration-500`}
                    style={{
                      width: `${Math.min(schedule.occupancyPercent, 100)}%`,
                    }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[10px] text-muted-foreground/60 font-medium">
                    {schedule.bookedSeats} booked
                  </span>
                  <span className="text-[10px] text-muted-foreground/60 font-medium">
                    {schedule.totalSeats} total seats
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};
