import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Calendar } from "lucide-react";

export const ScheduleSkeleton = () => {
  return (
    <div className="space-y-3">
      {[1, 2].map((i) => (
        <Skeleton key={i} className="w-full h-16 rounded-xl" />
      ))}
    </div>
  );
};

export const EmptyScheduleState = ({ date }: { date: Date }) => {
  return (
    <div className="rounded-xl border border-border bg-card/50 p-10 text-center">
      <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-50" />
      <p className="text-muted-foreground text-sm">
        No screenings on{" "}
        <span className="text-foreground font-medium">
          {format(date, "EEEE, dd MMMM yyyy")}
        </span>
      </p>
    </div>
  );
};
