import { TicketX } from "lucide-react";

interface EmptyStateProps {
  label: string;
}

export const EmptyState = ({ label }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-20 gap-4 cinema-border rounded-xl bg-card/40">
    <div className="relative">
      <TicketX className="h-14 w-14 text-muted-foreground/30" />
      <div className="absolute inset-0 blur-xl bg-primary/10 rounded-full" />
    </div>
    <div className="text-center">
      <p className="text-base font-semibold text-foreground/60">{label}</p>
      <p className="text-sm text-muted-foreground mt-1">
        Your bookings will appear here once made.
      </p>
    </div>
  </div>
);
