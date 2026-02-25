import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/helper/format-helper";
import { formatImageUrl } from "@/helper/image-helper";
import { MovieSchedule, SeatStatus, Showtime } from "../types";
import { format } from "date-fns";
import { ChevronDown, ChevronRight, Clock, Film, Ticket } from "lucide-react";


interface ScheduleAccordionForCinemaProps {
  schedule: MovieSchedule;
  isOpen: boolean;
  selectedShowtimeId: string | null;
  onToggle: () => void;
  onShowtimeSelect: (id: string | null) => void;
}

export const ScheduleAccordionForCinema = ({
  schedule,
  isOpen,
  selectedShowtimeId,
  onToggle,
  onShowtimeSelect,
}: ScheduleAccordionForCinemaProps) => {
  const movie = schedule.movie;

  const getAvailableSeatCount = (showtime: Showtime): number => {
    return showtime.seats.filter(
      (s: any) => !s.status || s.status === SeatStatus.AVAILABLE,
    ).length;
  };

  return (
    <div
      className={`rounded-xl border transition-all duration-200 overflow-hidden ${
        isOpen
          ? "cinema-border cinema-glow"
          : "border-border hover:border-primary/40"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-5 py-4 bg-card hover:bg-accent/30 transition-colors text-left"
      >
        <div className="w-12 h-[72px] rounded-lg overflow-hidden bg-muted shrink-0">
          {movie.posterUrl ? (
            <img
              src={formatImageUrl(movie.posterUrl)}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Film className="w-5 h-5 text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground leading-tight mb-1.5 truncate">
            {movie.title}
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
            </span>
            {movie.genres?.slice(0, 2).map((g) => (
              <Badge
                key={g.id}
                variant="secondary"
                className="text-xs bg-accent/50 border border-border/60 px-1.5 py-0 h-5"
              >
                {g.name}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-2">
          <span className="text-primary font-bold text-sm hidden sm:block">
            {formatPrice(schedule.price)}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="px-5 py-5 bg-card/50 border-t border-border">
          <p className="text-xs text-muted-foreground mb-4 uppercase tracking-widest">
            Select Showtime
          </p>

          <div className="flex flex-wrap gap-3">
            {schedule.showTimes.map((showtime) => {
              const isSelected = selectedShowtimeId === showtime.id;
              const available = getAvailableSeatCount(showtime);
              const total = showtime.seats.length;
              const isFull = available === 0 && total > 0;

              return (
                <button
                  key={showtime.id}
                  disabled={isFull}
                  onClick={() =>
                    onShowtimeSelect(isSelected ? null : showtime.id)
                  }
                  className={`flex flex-col items-center px-5 py-3 rounded-lg border text-sm transition-all duration-200 min-w-[90px] ${
                    isFull
                      ? "opacity-40 cursor-not-allowed border-border bg-muted"
                      : isSelected
                        ? "cinema-gradient border-transparent text-white shadow-lg scale-105"
                        : "border-border bg-card hover:border-primary/60 hover:bg-accent/20"
                  }`}
                >
                  <span className="font-bold text-base tabular-nums">
                    {format(new Date(showtime.startTime), "HH:mm")}
                  </span>
                  <span className="text-xs opacity-60 mt-0.5 tabular-nums">
                    — {format(new Date(showtime.endTime), "HH:mm")}
                  </span>
                  {total > 0 && (
                    <span
                      className={`text-xs mt-1.5 font-medium ${
                        isFull
                          ? "text-destructive"
                          : available <= 10
                            ? "text-amber-400"
                            : isSelected
                              ? "text-white/80"
                              : "text-green-400"
                      }`}
                    >
                      {isFull ? "Full" : `${available}/${total}`}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {selectedShowtimeId &&
            schedule.showTimes.some((t) => t.id === selectedShowtimeId) && (
              <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                <div className="text-sm text-muted-foreground">
                  <span className="text-foreground font-semibold">
                    {formatPrice(schedule.price)}
                  </span>
                  <span className="ml-1">/ seat</span>
                </div>
                <Button className="cinema-gradient cinema-glow text-white font-semibold gap-2 px-6">
                  <Ticket className="w-4 h-4" />
                  Select Seats
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
        </div>
      )}
    </div>
  );
};
