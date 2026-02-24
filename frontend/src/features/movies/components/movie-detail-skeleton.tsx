import { Skeleton } from "@/components/ui/skeleton";

export const MovieDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-background">
      <Skeleton className="w-full h-[500px]" />
      <div className="layout-middle py-10 space-y-6">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );
};
