import { Skeleton } from "@/components/ui/skeleton";

export const SeatGridSkeleton = () => (
  <div className="bg-card/30 p-8 border border-border/50 flex flex-col items-center gap-3 min-h-80 justify-center">
    <Skeleton className="h-4 w-48 mb-4" />
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="flex gap-2">
        {Array.from({ length: 10 }).map((__, j) => (
          <Skeleton key={j} className="w-8 h-8 rounded-t-lg rounded-b-sm" />
        ))}
      </div>
    ))}
  </div>
);
