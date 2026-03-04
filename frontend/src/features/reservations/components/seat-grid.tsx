import { ShowtimeSeat } from "@/features/movie-schedules/types";
import { SeatStatus } from "@/features/theaters/types";
import { cn } from "@/lib/utils";

type SeatGridProps = {
  layout: (0 | 1)[][];
  seats: ShowtimeSeat[];
};

export const SeatGrid = ({ layout, seats }: SeatGridProps) => {
  let seatIndex = 0;

  return (
    <div className="flex flex-col items-center min-w-max">
      <div className="flex flex-col gap-2 mt-8 items-center">
        <div className="w-full h-12 bg-primary/20 rounded-t-full flex items-center justify-center text-primary/50 text-sm font-semibold tracking-widest cinema-glow mb-8">
          SCREEN
        </div>
        {layout.map((row, rowIndex) => {
          const isCorridorRow = row.every((val) => val === 0);

          if (isCorridorRow) {
            return <div key={`corridor-${rowIndex}`} className="h-8" />;
          }

          return (
            <div key={`row-${rowIndex}`} className="flex gap-2 justify-center">
              {row.map((col, colIndex) => {
                if (col === 0) {
                  return (
                    <div
                      key={`empty-${rowIndex}-${colIndex}`}
                      className="w-8 h-8 shrink-0"
                    />
                  );
                }

                const currentSeat = seats[seatIndex];
                seatIndex++;

                if (!currentSeat) return null;

                const isAvailable = currentSeat.status === SeatStatus.AVAILABLE;
                const isReserved = currentSeat.status === SeatStatus.RESERVED;
                const isHold = currentSeat.status === SeatStatus.HOLD;

                return (
                  <div
                    key={`seat-${currentSeat.id}`}
                    className={cn(
                      "w-8 h-8 shrink-0 rounded-t-lg rounded-b-sm border flex items-center justify-center text-xs transition-colors select-none",
                      isAvailable &&
                        "bg-muted border-border text-muted-foreground hover:border-primary/50 cursor-pointer",
                      isReserved &&
                        "bg-primary/20 border-primary/50 text-primary cursor-not-allowed",
                      isHold &&
                        "bg-yellow-500/20 border-yellow-500/50 text-yellow-500 cursor-not-allowed",
                    )}
                  >
                    {currentSeat.seatRow}
                    {currentSeat.seatNumber}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
