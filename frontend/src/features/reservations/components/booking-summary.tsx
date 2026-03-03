import { Button } from "@/components/ui/button";
import { formatPrice } from "@/helper/format-helper";
import { Ticket } from "lucide-react";

type BookingSummaryProps = {
  price: number;
};

export const BookingSummary = ({ price }: BookingSummaryProps) => {
  return (
    <div className="mt-12 p-6 rounded-xl border border-border bg-card shadow-lg flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold text-foreground">
          Booking Summary
        </h3>
        <p className="text-sm text-muted-foreground mt-1">0 seats selected</p>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Price per seat</p>
          <p className="text-2xl font-bold text-primary">
            {formatPrice(price)}
          </p>
        </div>
        <Button
          size="lg"
          className="cinema-gradient cinema-glow text-white font-semibold gap-2"
          disabled
        >
          <Ticket className="w-5 h-5" />
          Checkout
        </Button>
      </div>
    </div>
  );
};
