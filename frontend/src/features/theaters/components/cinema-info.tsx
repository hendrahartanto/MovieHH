import { Theater } from "../types";
import { Film, MapPin } from "lucide-react";

interface CinemaInfoProps {
  theater: Theater;
}

export const CinemaInfo = ({ theater }: CinemaInfoProps) => {
  return (
    <div className="border border-border bg-card/80 backdrop-blur-sm p-6 sm:p-8 mb-10 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-start gap-6">
        <div className="w-16 h-16 cinema-gradient cinema-glow flex items-center justify-center shrink-0">
          <Film className="w-8 h-8 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
            {theater.name}
          </h1>

          {theater.location && (
            <span className="flex items-start gap-1.5 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mt-0.5 text-primary shrink-0" />
              <span>
                <span className="text-foreground font-medium">
                  {theater.location.name}
                </span>
                {theater.location.address && (
                  <span className="block text-xs opacity-70 mt-0.5">
                    {theater.location.address}
                  </span>
                )}
              </span>
            </span>
          )}
        </div>

        {theater.seats?.length > 0 && (
          <div className="shrink-0 text-center px-5 py-3 rounded-xl border border-border bg-background/50">
            <p className="text-2xl font-bold text-primary">
              {theater.seats.length}
            </p>
            <p className="text-xs text-muted-foreground">Seats</p>
          </div>
        )}
      </div>
    </div>
  );
};
