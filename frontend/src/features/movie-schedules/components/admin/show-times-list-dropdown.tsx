import { Showtime } from "@/lib/api";
import { CreateShowTime } from "./create-show-time";
import { Clock, CalendarX } from "lucide-react";
import { DeleteShowTime } from "./delete-show-time";

interface ShowTimesListDropdownProps {
  showTimes: Showtime[];
  movieScheduleId: string;
}

export const ShowTimesListDropdown = ({
  showTimes,
  movieScheduleId,
}: ShowTimesListDropdownProps) => {
  const hasShowTimes = showTimes && showTimes.length > 0;

  return (
    <div className="px-14 py-4">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-muted-foreground" />
        <div className="flex gap-5 items-center">
          <h4 className="font-semibold text-sm">Showtime Details</h4>
          <CreateShowTime movieScheduleId={movieScheduleId} />
        </div>
      </div>

      {hasShowTimes ? (
        <div className="space-y-2">
          {showTimes.map((showtime, index) => (
            <div key={showtime.id} className="flex gap-2 items-center">
              <div className="flex items-center gap-4 bg-background border rounded-lg px-5 py-3 w-fit">
                <span className="text-sm font-medium text-muted-foreground min-w-5">
                  {index + 1}.
                </span>
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-sm font-medium">
                    {new Date(showtime.startTime).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </span>
                  <span className="text-muted-foreground">-</span>
                  <span className="text-sm font-medium">
                    {new Date(showtime.endTime).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </span>
                </div>
              </div>
              <DeleteShowTime showTimeId={showtime.id} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center border rounded-lg bg-muted/20 py-8">
          <CalendarX className="w-8 h-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            No showtimes available yet.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Click “+ Add Showtime” to create one.
          </p>
        </div>
      )}
    </div>
  );
};

export default ShowTimesListDropdown;
