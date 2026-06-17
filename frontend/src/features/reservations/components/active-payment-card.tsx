import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/confirmation-modal";
import { formatPrice } from "@/helper/format-helper";
import { ActiveReservationPayment } from "../types";
import { format, differenceInSeconds } from "date-fns";
import { Loader2, RotateCcw, Timer, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface ActivePaymentCardProps {
  activePayment: ActiveReservationPayment;
  isResumePending: boolean;
  isCancelPending: boolean;
  onResumePayment: () => void;
  onCancelPayment: () => void;
}

const useCountdown = (expiresAt: string) => {
  const getSecondsLeft = () =>
    Math.max(0, differenceInSeconds(new Date(expiresAt), new Date()));

  const [secondsLeft, setSecondsLeft] = useState(getSecondsLeft);

  useEffect(() => {
    if (secondsLeft === 0) return;

    const interval = setInterval(() => {
      const remaining = getSecondsLeft();
      setSecondsLeft(remaining);
      if (remaining === 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const isExpired = secondsLeft === 0;
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const isUrgent = secondsLeft <= 120 && !isExpired;

  return {
    isExpired,
    isUrgent,
    display: isExpired
      ? "Expired"
      : `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
  };
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
    .map((d) => `${d.seat.seatRow}${d.seat.seatNumber}`)
    .join(", ");

  const movieTitle = reservation.showTime.movieSchedule.movie?.title;
  const theaterName = reservation.showTime.movieSchedule.theater?.name;
  const showDate = format(
    new Date(reservation.showTime.movieSchedule.date),
    "MMM d, yyyy",
  );

  const countdown = useCountdown(reservation.expiresAt);
  const canResumePayment = Boolean(payment?.token) && !countdown.isExpired;
  const isActionPending = isResumePending || isCancelPending;

  return (
    <div className="mb-8 rounded-xl border border-amber-500/30 bg-amber-500/[0.07] overflow-hidden shadow-lg shadow-amber-950/10">
      <div className="px-5 py-2.5 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">
          Ongoing Payment
        </p>
        <div
          className={`flex items-center gap-1.5 font-mono text-sm font-bold tabular-nums ${
            countdown.isExpired
              ? "text-red-400"
              : countdown.isUrgent
                ? "text-red-400 animate-pulse"
                : "text-amber-300"
          }`}
        >
          <Timer className="h-3.5 w-3.5" />
          {countdown.display}
        </div>
      </div>

      <div className="p-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-foreground leading-tight">
              {countdown.isExpired
                ? "Payment hold has expired"
                : "Complete or cancel your current reservation first"}
            </h2>

            <div className="grid gap-1.5 text-sm sm:grid-cols-2">
              {[
                { label: "Movie", value: movieTitle ?? "Selected showtime" },
                { label: "Cinema", value: theaterName ?? "Selected theater" },
                { label: "Date", value: showDate },
                {
                  label: "Total",
                  value: formatPrice(Number(reservation.totalPrice)),
                },
                { label: "Seats", value: selectedSeats, full: true },
              ].map(({ label, value, full }) => (
                <p
                  key={label}
                  className={`text-muted-foreground ${full ? "sm:col-span-2" : ""}`}
                >
                  <span className="font-medium text-foreground/80">
                    {label}:
                  </span>{" "}
                  {value}
                </p>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2.5 sm:flex-row lg:flex-col lg:min-w-[180px]">
            <Button
              variant="glow"
              disabled={!canResumePayment || isActionPending}
              onClick={onResumePayment}
              className="gap-2 w-full"
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
                  className="gap-2 w-full"
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
    </div>
  );
};
