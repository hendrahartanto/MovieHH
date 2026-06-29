import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User2 } from "lucide-react";
import { format } from "date-fns";

interface CheckIn {
  id: string;
  checkedInAt: string;
  user: { name: string };
  showTime: {
    movieSchedule: {
      movie: { title: string };
      theater: { name: string };
    };
  };
  reservationDetails: Array<{
    id: string;
    seat: { seatRow: string; seatNumber: string };
  }>;
}

interface RecentCheckinsProps {
  recentCheckIns?: CheckIn[];
  isLoading?: boolean;
}

export const RecentCheckins = ({
  recentCheckIns,
  isLoading,
}: RecentCheckinsProps) => {
  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-4 border-b border-border/50 px-6 pt-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <div>
              <CardTitle className="text-base font-semibold leading-none">
                Live Check-ins
              </CardTitle>
              <CardDescription className="mt-1 text-xs">
                Entry logs from ticket ushers
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {isLoading || !recentCheckIns ? (
          <ul className="space-y-6 relative animate-pulse">
            {[...Array(3)].map((_, i) => (
              <li key={i} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="h-3.5 bg-muted/50 rounded w-24" />
                  <div className="h-4.5 bg-muted/40 rounded w-16" />
                </div>
                <div className="h-4 bg-muted/50 rounded w-40" />
                <div className="h-3 bg-muted/40 rounded w-28" />
              </li>
            ))}
          </ul>
        ) : recentCheckIns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <User2 className="w-8 h-8 text-muted-foreground/30 mb-3" />
            <p className="text-sm font-medium text-muted-foreground">
              No check-ins yet
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Live entries will appear here.
            </p>
          </div>
        ) : (
          <ul className="space-y-0 relative">
            <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border/40" />

            {recentCheckIns.map((scan) => {
              const seatsStr = scan.reservationDetails
                .map((d) => `${d.seat.seatRow}${d.seat.seatNumber}`)
                .join(", ");

              return (
                <li
                  key={scan.id}
                  className="relative pl-7 pb-5 last:pb-0 animate-in fade-in duration-300"
                >
                  <div className="absolute left-0 top-1.5 w-[11px] h-[11px] rounded-full bg-emerald-500/20 border-2 border-emerald-500 shadow-sm shadow-emerald-500/30" />

                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-semibold text-foreground flex items-center gap-1">
                      <User2 className="w-3 h-3 text-muted-foreground" />
                      {scan.user.name}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                      {format(new Date(scan.checkedInAt), "h:mm a")}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-foreground leading-tight truncate">
                    {scan.showTime.movieSchedule.movie.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-tight">
                    {scan.showTime.movieSchedule.theater.name}
                    <span className="mx-1 text-border">·</span>
                    <span className="font-mono font-semibold text-foreground/70">
                      {seatsStr}
                    </span>
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};
