import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  onNavigateHome: () => void;
}

export const ErrorState = ({ onNavigateHome }: ErrorStateProps) => (
  <div className="layout-middle py-12 flex justify-center text-center">
    <div className="w-full max-w-lg bg-card border border-border rounded-2xl p-10 space-y-5">
      <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
        <XCircle className="w-8 h-8 text-destructive" />
      </div>
      <div className="space-y-2">
        <h1 className="text-xl font-bold text-foreground">
          Reservation Not Found
        </h1>
        <p className="text-muted-foreground text-sm">
          We couldn't find the reservation you are looking for.
        </p>
      </div>
      <Button onClick={onNavigateHome} className="w-full cinema-glow">
        Back to Home
      </Button>
    </div>
  </div>
);
