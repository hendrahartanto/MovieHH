import { Button } from "@/components/ui/button";
import { formatPrice } from "@/helper/format-helper";
import { MovieSchedule, SeatStatus, Showtime } from "../types";
import { format } from "date-fns";
import { ChevronRight, MapPin, Ticket } from "lucide-react";
import { useUser } from "@/lib/auth";
import { useState } from "react";
import { AuthAlertModal } from "@/components/ui/auth-alert-modal";
import { useNavigate } from "react-router";
import { paths } from "@/config/paths";

interface ScheduleAccordionForMovieProps {
  schedule: MovieSchedule;
  selectedScheduleId: string | null;
  selectedShowtimeId: string | null;
  setSelectedScheduleId: (scheduleId: string | null) => void;
  setSelectedShowtimeId: (showtimeId: string | null) => void;
}

export const ScheduleAccordionForMovie = ({
  schedule,
  selectedScheduleId,
  selectedShowtimeId,
  setSelectedScheduleId,
  setSelectedShowtimeId,
}: ScheduleAccordionForMovieProps) => {
  const user = useUser();
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const isOpen = selectedScheduleId === schedule.id;
  const theater = schedule.theater;

  const getAvailableSeatCount = (showtime: Showtime): number => {
    return showtime.seats.filter(
      (s: any) => !s.status || s.status === SeatStatus.AVAILABLE,
    ).length;
  };

  const handleSelectSeats = () => {
    if (!user.data) {
      setIsAuthModalOpen(true);
      return;
    }

    if (selectedShowtimeId) {
      navigate(paths.seatSelection.getHref(selectedShowtimeId));
    }
  };

  return (
    <div
      key={schedule.id}
      className={`rounded-xl border transition-all duration-200 overflow-hidden ${
        isOpen
          ? "cinema-border cinema-glow"
          : "border-border hover:border-primary/40"
      }`}
    >
      <button
        className="w-full flex items-center justify-between px-5 py-4 bg-card hover:bg-accent/30 transition-colors text-left"
        onClick={() => {
          setSelectedScheduleId(isOpen ? null : schedule.id);
          setSelectedShowtimeId(null);
        }}
      >
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-foreground">{theater.name}</span>
          {theater.location && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />
              {theater.location.name}
              {theater.location.address && (
                <span className="opacity-60">— {theater.location.address}</span>
              )}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4 shrink-0 ml-4">
          <span className="text-primary font-bold text-sm">
            {formatPrice(schedule.price)}
          </span>
          <ChevronRight
            className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
              isOpen ? "rotate-90" : ""
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
              const availableSeats = getAvailableSeatCount(showtime);
              const totalSeats = showtime.seats.length;
              const isFull = availableSeats === 0 && totalSeats > 0;

              return (
                <button
                  key={showtime.id}
                  disabled={isFull}
                  onClick={() =>
                    setSelectedShowtimeId(isSelected ? null : showtime.id)
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
                  {totalSeats > 0 && (
                    <span
                      className={`text-xs mt-1.5 font-medium ${
                        isFull
                          ? "text-destructive"
                          : availableSeats <= 10
                            ? "text-amber-400"
                            : isSelected
                              ? "text-white/80"
                              : "text-green-400"
                      }`}
                    >
                      {isFull ? "Full" : `${availableSeats}/${totalSeats}`}
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
                <Button
                  variant="glow"
                  onClick={handleSelectSeats}
                  className="gap-2 px-6"
                >
                  <Ticket className="w-4 h-4" />
                  Select Seats
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
        </div>
      )}
      <AuthAlertModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};
