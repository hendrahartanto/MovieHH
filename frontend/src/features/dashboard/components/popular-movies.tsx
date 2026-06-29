import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUp, Film } from "lucide-react";
import { formatPrice } from "@/helper/format-helper";

interface PopularMovie {
  title: string;
  posterUrl: string | null;
  ticketsSold: number;
  revenue: number;
}

interface PopularMoviesProps {
  popularMovies?: PopularMovie[];
  isLoading?: boolean;
}

const RANK_STYLES = [
  "text-amber-400 bg-amber-500/10 border-amber-500/20",
  "text-slate-400 bg-slate-500/10 border-slate-500/20",
  "text-orange-400 bg-orange-500/10 border-orange-500/20",
];

export const PopularMovies = ({
  popularMovies,
  isLoading,
}: PopularMoviesProps) => {
  const maxTickets = popularMovies
    ? Math.max(...popularMovies.map((m) => m.ticketsSold), 1)
    : 1;

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-4 border-b border-border/50 px-6 pt-5">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold leading-none">
              Top Movies
            </CardTitle>
            <CardDescription className="mt-1 text-xs">
              By tickets sold in the last 30 days
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-5">
        {isLoading || !popularMovies ? (
          <div className="space-y-4 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-md bg-muted/50 shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3.5 bg-muted/50 rounded w-28" />
                    <div className="flex justify-between">
                      <div className="h-3 bg-muted/40 rounded w-14" />
                      <div className="h-3 bg-muted/40 rounded w-16" />
                    </div>
                  </div>
                </div>
                <div className="ml-9 h-1 bg-muted rounded-full w-full" />
              </div>
            ))}
          </div>
        ) : popularMovies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Film className="w-8 h-8 text-muted-foreground/30 mb-3" />
            <p className="text-sm font-medium text-muted-foreground">
              No sales data
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Data will appear after tickets are sold.
            </p>
          </div>
        ) : (
          popularMovies.map((movie, index) => {
            const barWidth = Math.round((movie.ticketsSold / maxTickets) * 100);
            const rankStyle =
              RANK_STYLES[index] ??
              "text-muted-foreground bg-muted/30 border-border/40";

            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 rounded-md text-[11px] font-extrabold border shrink-0 font-mono ${rankStyle}`}
                  >
                    {index + 1}
                  </span>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm leading-tight truncate">
                      {movie.title}
                    </p>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-xs text-muted-foreground">
                        {movie.ticketsSold.toLocaleString()} tickets
                      </span>
                      <span className="text-xs font-mono font-semibold text-foreground/80">
                        {formatPrice(movie.revenue)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-primary/70 to-primary rounded-full transition-all duration-500"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};
