import { ShowtimeSeat } from "@/features/movie-schedules/types";
import { SeatStatus } from "@/features/theaters/types";
import { cn } from "@/lib/utils";

interface SeatGridProps {
  layout: (0 | 1)[][];
  seats: ShowtimeSeat[];
  selectedSeats: string[];
  onSeatToggle: (seatId: string) => void;
}

const SEAT_STATUS_STYLES: Record<string, string> = {
  available:
    "bg-muted/60 border-border text-muted-foreground hover:border-primary/70 hover:bg-primary/10 hover:text-primary cursor-pointer hover:-translate-y-0.5 hover:shadow-sm hover:shadow-primary/20",
  selected:
    "bg-primary text-primary-foreground border-primary cinema-glow scale-110 cursor-pointer z-10 shadow-md shadow-primary/40",
  reserved:
    "bg-primary/10 border-primary/30 text-primary/40 cursor-not-allowed",
  hold: "bg-amber-500/15 border-amber-500/40 text-amber-500/60 cursor-not-allowed",
};

export const SeatGrid = ({
  layout,
  seats,
  selectedSeats,
  onSeatToggle,
}: SeatGridProps) => {
  let seatIndex = 0;

  return (
    <div className="flex flex-col items-center min-w-max">
      <div className="relative w-full mb-10">
        <div className="w-full max-w-lg mx-auto h-1.5 bg-linear-to-r from-transparent via-primary/40 to-transparent rounded-full" />
        <div className="w-3/4 mx-auto h-6 bg-primary/10 rounded-b-[40%] flex items-center justify-center mt-0.5 border-b border-x border-primary/20">
          <span className="text-[10px] font-semibold tracking-[0.25em] text-primary/50 uppercase">
            Screen
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2 items-center">
        {layout.map((row, rowIndex) => {
          const isCorridorRow = row.every((val) => val === 0);

          if (isCorridorRow) {
            return (
              <div
                key={`corridor-${rowIndex}`}
                className="h-6 flex items-center w-full"
              >
                <div className="w-full border-t border-dashed border-border/30" />
              </div>
            );
          }

          const seatsInRow: ShowtimeSeat[] = [];
          const tempIndex = seatIndex;

          row.forEach((col) => {
            if (col === 1 && seats[seatIndex]) {
              seatsInRow.push(seats[seatIndex]);
              seatIndex++;
            } else if (col === 0) {
              // placeholder
            }
          });

          const rowLabel = seatsInRow[0]?.seatRow ?? "";

          return (
            <div
              key={`row-${rowIndex}`}
              className="flex gap-1.5 items-center justify-center"
            >
              <span className="w-5 text-center text-[10px] font-semibold text-muted-foreground/50 select-none shrink-0">
                {rowLabel}
              </span>

              {(() => {
                let localSeatIdx = tempIndex;
                return row.map((col, colIndex) => {
                  if (col === 0) {
                    return (
                      <div
                        key={`empty-${rowIndex}-${colIndex}`}
                        className="w-8 h-8 shrink-0"
                      />
                    );
                  }

                  const currentSeat = seats[localSeatIdx];
                  localSeatIdx++;

                  if (!currentSeat) return null;

                  const isAvailable =
                    currentSeat.status === SeatStatus.AVAILABLE;
                  const isReserved = currentSeat.status === SeatStatus.RESERVED;
                  const isHold = currentSeat.status === SeatStatus.HOLD;
                  const isSelected = selectedSeats.includes(currentSeat.id);

                  const statusKey = isSelected
                    ? "selected"
                    : isReserved
                      ? "reserved"
                      : isHold
                        ? "hold"
                        : "available";

                  return (
                    <div
                      key={`seat-${currentSeat.id}`}
                      title={
                        isReserved
                          ? "Seat reserved"
                          : isHold
                            ? "Seat on hold"
                            : `${currentSeat.seatRow}${currentSeat.seatNumber}`
                      }
                      onClick={() =>
                        isAvailable && onSeatToggle(currentSeat.id)
                      }
                      className={cn(
                        "w-8 h-8 shrink-0 rounded-t-lg rounded-b-sm border flex items-center justify-center text-[10px] font-medium transition-all duration-150 select-none",
                        SEAT_STATUS_STYLES[statusKey],
                      )}
                    >
                      {currentSeat.seatRow}
                      {currentSeat.seatNumber}
                    </div>
                  );
                });
              })()}

              <span className="w-5 text-center text-[10px] font-semibold text-muted-foreground/50 select-none shrink-0">
                {rowLabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
