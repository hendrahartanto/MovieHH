import { Skeleton } from "@/components/ui/skeleton";

export const ReservationSkeleton = () => (
  <div className="flex rounded-xl overflow-hidden cinema-border bg-card h-32">
    <div className="w-1 bg-primary/20" />
    <div className="flex-1 px-5 py-4 space-y-3">
      <Skeleton className="h-4 w-1/3 bg-muted/50" />
      <Skeleton className="h-5 w-2/3 bg-muted/50" />
      <Skeleton className="h-3 w-1/2 bg-muted/50" />
    </div>
  </div>
);
