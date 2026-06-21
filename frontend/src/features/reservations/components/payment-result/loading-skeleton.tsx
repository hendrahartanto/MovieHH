import { Skeleton } from "@/components/ui/skeleton";

export const LoadingSkeleton = () => (
  <div className="layout-middle py-12 flex justify-center">
    <div className="w-full max-w-2xl space-y-3">
      <Skeleton className="h-52 w-full rounded-2xl" />
      <Skeleton className="h-64 w-full rounded-2xl" />
      <Skeleton className="h-32 w-full rounded-2xl" />
    </div>
  </div>
);
