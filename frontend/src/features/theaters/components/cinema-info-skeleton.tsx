import { Skeleton } from "@/components/ui/skeleton";

export const CinemaInfoSkeleton = () => (
  <div className="rounded-2xl border border-border bg-card/80 p-6 sm:p-8 mb-10 space-y-4">
    <div className="flex gap-6">
      <Skeleton className="w-16 h-16 rounded-2xl shrink-0" />
      <div className="flex-1 space-y-3">
        <Skeleton className="h-7 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  </div>
);
