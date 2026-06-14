import { Button } from "@/components/ui/button";
import { formatPrice } from "@/helper/format-helper";
import { Loader2, Ticket } from "lucide-react";

type BookingSummaryProps = {
  price: number;
  selectedCount: number;
  isCheckoutPending?: boolean;
  isCheckoutDisabled?: boolean;
  checkoutDisabledReason?: string;
  onCheckout: () => void;
};

export const BookingSummary = ({
  price,
  selectedCount,
  isCheckoutPending = false,
  isCheckoutDisabled = false,
  checkoutDisabledReason,
  onCheckout,
}: BookingSummaryProps) => {
  const totalPrice = selectedCount > 0 ? price * selectedCount : price;

  return (
    <div className="mt-12 p-6 rounded-xl border border-border bg-card shadow-lg flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="text-lg font-semibold text-foreground">
          Booking Summary
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {selectedCount} {selectedCount === 1 ? "seat" : "seats"} selected
        </p>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <div className="sm:text-right">
          <p className="text-sm text-muted-foreground">
            {selectedCount > 0 ? "Total Price" : "Price per seat"}
          </p>
          <p className="text-2xl font-bold text-primary">
            {formatPrice(totalPrice)}
          </p>
        </div>
        <Button
          size="lg"
          className="cinema-gradient cinema-glow text-white font-semibold gap-2"
          disabled={selectedCount === 0 || isCheckoutPending || isCheckoutDisabled}
          onClick={onCheckout}
        >
          {isCheckoutPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Ticket className="w-5 h-5" />
          )}
          {isCheckoutPending ? "Processing..." : "Checkout"}
        </Button>
        {checkoutDisabledReason && (
          <p className="max-w-xs text-xs text-amber-400 sm:text-right">
            {checkoutDisabledReason}
          </p>
        )}
      </div>
    </div>
  );
};
