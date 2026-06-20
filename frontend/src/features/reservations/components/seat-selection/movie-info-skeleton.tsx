import { Skeleton } from "@/components/ui/skeleton";

export const MovieInfoSkeleton = () => (
  <div className="mb-10 flex flex-col md:flex-row gap-6 items-start p-6 bg-card/50 border border-border rounded-xl">
    <Skeleton className="w-24 h-36 md:w-32 md:h-48 rounded-lg shrink-0" />
    <div className="flex-1 space-y-4 pt-1">
      <div className="space-y-2">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-7 w-28" />
        <Skeleton className="h-7 w-36" />
        <Skeleton className="h-7 w-32" />
      </div>
    </div>
  </div>
);
