import { Showtime } from "@/lib/api";
import { CreateShowTime } from "./create-show-time";
import { Clock } from "lucide-react";

interface ShowTimesListDropdownProps {
  showTimes: Showtime[];
  movieScheduleId: string;
}

export const ShowTimesListDropdown = ({
  showTimes,
  movieScheduleId,
}: ShowTimesListDropdownProps) => {
  return (
    <div className="px-6 py-4">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-muted-foreground" />
        <div className="flex gap-5 items-center">
          <h4 className="font-semibold text-sm">Showtime Details</h4>
          <CreateShowTime movieScheduleId={movieScheduleId} />
        </div>
      </div>
      <div className="space-y-2">
        {showTimes.map((showtime, index) => (
          <div
            key={showtime.id}
            className="flex items-center gap-4 bg-background border rounded-lg px-5 py-3 w-fit"
          >
            <span className="text-sm font-medium text-muted-foreground min-w-[20px]">
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
        ))}
      </div>
    </div>
  );
};

export default ShowTimesListDropdown;
