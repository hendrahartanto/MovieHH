import { format } from "date-fns";
import { Film, MapPin, Calendar as CalendarIcon, Clock } from "lucide-react";
import { PopulatedReservation } from "@/features/reservations/api/get-reservation";
import { formatImageUrl } from "@/helper/image-helper";

interface MovieBannerProps {
  movie: PopulatedReservation["showTime"]["movieSchedule"]["movie"];
  theater: PopulatedReservation["showTime"]["movieSchedule"]["theater"];
  showTime: PopulatedReservation["showTime"];
  scheduleDate: string;
}

export const MovieBanner = ({
  movie,
  theater,
  showTime,
  scheduleDate,
}: MovieBannerProps) => (
  <div className="flex gap-5 items-start">
    <div className="shrink-0">
      {movie.posterUrl ? (
        <img
          src={formatImageUrl(movie.posterUrl)}
          alt={movie.title}
          className="w-20 h-28 object-cover rounded-xl shadow-lg border border-border/50"
        />
      ) : (
        <div className="w-20 h-28 bg-muted rounded-xl flex flex-col items-center justify-center gap-1 text-muted-foreground border border-border/50">
          <Film className="w-5 h-5" />
          <span className="text-[10px]">No poster</span>
        </div>
      )}
    </div>

    <div className="flex-1 min-w-0 space-y-2.5 pt-1">
      <h2 className="text-lg font-bold text-foreground leading-snug line-clamp-2">
        {movie.title}
      </h2>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="truncate">{theater.name}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarIcon className="w-3.5 h-3.5 text-primary shrink-0" />
          <span>{format(new Date(scheduleDate), "EEE, MMM d, yyyy")}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
          <span>
            {format(new Date(showTime.startTime), "h:mm a")}
            {" – "}
            {format(new Date(showTime.endTime), "h:mm a")}
          </span>
        </div>
      </div>
    </div>
  </div>
);
