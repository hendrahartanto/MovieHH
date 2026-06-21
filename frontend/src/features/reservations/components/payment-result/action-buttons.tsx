import { Link } from "react-router";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { paths } from "@/config/paths";
import { PaymentState } from "./types";

interface ActionButtonsProps {
  state: PaymentState;
  showTimeId: string;
}

export const ActionButtons = ({ state, showTimeId }: ActionButtonsProps) => (
  <div className="flex flex-col sm:flex-row gap-3">
    <Button
      variant="outline"
      className="flex-1 h-11 border-border/60 hover:border-primary/50 transition-colors"
      asChild
    >
      <Link to={paths.home.getHref()}>
        <ChevronLeft className="w-4 h-4 mr-1.5" />
        Back to Home
      </Link>
    </Button>

    {(state === "failed" || state === "pending") && (
      <Button variant="glow" className="flex-1 h-11" asChild>
        <Link to={paths.seatSelection.getHref(showTimeId)}>Try Again</Link>
      </Button>
    )}

    {state === "success" && (
      <Button variant="glow" className="flex-1 h-11" asChild>
        <Link to={paths.home.getHref()}>Browse More Films</Link>
      </Button>
    )}
  </div>
);
