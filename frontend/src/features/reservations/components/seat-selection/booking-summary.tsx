import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/helper/format-helper";
import { AlertCircle, Loader2, Ticket } from "lucide-react";

interface BookingSummaryProps {
  price: number;
  selectedCount: number;
  isCheckoutPending?: boolean;
  isCheckoutDisabled?: boolean;
  checkoutDisabledReason?: string;
  onCheckout: () => void;
}

export const BookingSummary = ({
  price,
  selectedCount,
  isCheckoutPending = false,
  isCheckoutDisabled = false,
  checkoutDisabledReason,
  onCheckout,
}: BookingSummaryProps) => {
  const totalPrice = selectedCount > 0 ? price * selectedCount : 0;
  const hasSelection = selectedCount > 0;

  return (
    <div className="mt-8 border border-border bg-card rounded-xl shadow-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-border/50 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Booking Summary
        </h3>
        {hasSelection && (
          <span className="text-xs bg-primary/15 text-primary border border-primary/25 px-2.5 py-1 rounded-full font-medium">
            {selectedCount} {selectedCount === 1 ? "seat" : "seats"} selected
          </span>
        )}
      </div>

      <div className="p-6">
        <div className="flex flex-col gap-3 text-sm text-muted-foreground mb-5">
          <div className="flex items-center justify-between">
            <span>Price per seat</span>
            <span className="font-medium text-foreground">
              {formatPrice(price)}
            </span>
          </div>

          {hasSelection && (
            <>
              <div className="flex items-center justify-between">
                <span>
                  {selectedCount} {selectedCount === 1 ? "seat" : "seats"} ×{" "}
                  {formatPrice(price)}
                </span>
                <span className="font-medium text-foreground">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <Separator className="bg-border/50" />
              <div className="flex items-center justify-between pt-1">
                <span className="text-base font-semibold text-foreground">
                  Total
                </span>
                <span className="text-2xl font-bold text-primary tracking-tight">
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </>
          )}

          {!hasSelection && (
            <p className="text-xs text-muted-foreground/70 text-center py-1">
              Select seats above to see your total
            </p>
          )}
        </div>

        <Button
          size="lg"
          className="w-full cinema-gradient cinema-glow text-white font-semibold gap-2 transition-all duration-200 disabled:opacity-50 disabled:cinema-glow-none disabled:cursor-not-allowed"
          disabled={!hasSelection || isCheckoutPending || isCheckoutDisabled}
          onClick={onCheckout}
        >
          {isCheckoutPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing payment…
            </>
          ) : (
            <>
              <Ticket className="w-5 h-5" />
              {hasSelection
                ? `Checkout — ${formatPrice(totalPrice)}`
                : "Select seats to continue"}
            </>
          )}
        </Button>

        {checkoutDisabledReason && (
          <div className="mt-3 flex items-start gap-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2.5">
            <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <p>{checkoutDisabledReason}</p>
          </div>
        )}
      </div>
    </div>
  );
};
