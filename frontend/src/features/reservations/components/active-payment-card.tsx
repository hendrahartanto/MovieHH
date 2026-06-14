import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/confirmation-modal";
import { formatPrice } from "@/helper/format-helper";
import { ActiveReservationPayment } from "../types";
import { format } from "date-fns";
import { Loader2, RotateCcw, Timer, XCircle } from "lucide-react";

type ActivePaymentCardProps = {
  activePayment: ActiveReservationPayment;
  isResumePending: boolean;
  isCancelPending: boolean;
  onResumePayment: () => void;
  onCancelPayment: () => void;
};

export const ActivePaymentCard = ({
  activePayment,
  isResumePending,
  isCancelPending,
  onResumePayment,
  onCancelPayment,
}: ActivePaymentCardProps) => {
  const { reservation, payment } = activePayment;
  const selectedSeats = reservation.reservationDetails
    .map((detail) => `${detail.seat.seatRow}${detail.seat.seatNumber}`)
    .join(", ");
  const movieTitle = reservation.showTime.movieSchedule.movie?.title;
  const theaterName = reservation.showTime.movieSchedule.theater?.name;
  const expiresAt = format(new Date(reservation.expiresAt), "MMM d, yyyy h:mm a");
  const canResumePayment = Boolean(payment?.token);
  const isActionPending = isResumePending || isCancelPending;

  return (
    <div className="mb-8 rounded-xl border border-amber-500/30 bg-amber-500/10 p-5 shadow-lg shadow-amber-950/10">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-amber-400">
              Ongoing Payment
            </p>
            <h2 className="mt-1 text-xl font-bold text-foreground">
              Complete or cancel your current reservation first
            </h2>
          </div>

          <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
            <p>
              <span className="text-foreground">Movie:</span>{" "}
              {movieTitle || "Selected showtime"}
            </p>
            <p>
              <span className="text-foreground">Cinema:</span>{" "}
              {theaterName || "Selected theater"}
            </p>
            <p>
              <span className="text-foreground">Seats:</span> {selectedSeats}
            </p>
            <p>
              <span className="text-foreground">Total:</span>{" "}
              {formatPrice(Number(reservation.totalPrice))}
            </p>
          </div>

          <p className="flex items-center gap-2 text-sm text-amber-300">
            <Timer className="h-4 w-4" />
            Payment hold expires at {expiresAt}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          <Button
            variant="glow"
            disabled={!canResumePayment || isActionPending}
            onClick={onResumePayment}
            className="gap-2"
          >
            {isResumePending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RotateCcw className="h-4 w-4" />
            )}
            Resume Payment
          </Button>

          <ConfirmationDialog
            title="Cancel ongoing payment?"
            body="This will cancel the Midtrans transaction and release the selected seats. You will need to choose seats again if you still want to book."
            cancelButtonText="Keep Payment"
            triggerButton={
              <Button
                variant="outline-destructive"
                disabled={isActionPending}
                className="gap-2"
              >
                <XCircle className="h-4 w-4" />
                Cancel Reservation
              </Button>
            }
            confirmButton={
              <Button
                variant="destructive"
                disabled={isActionPending}
                onClick={onCancelPayment}
                className="gap-2"
              >
                {isCancelPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Cancel Reservation
              </Button>
            }
          />
        </div>
      </div>
    </div>
  );
};
