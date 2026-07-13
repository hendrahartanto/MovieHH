import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmationDialog } from "@/components/ui/confirmation-modal";
import { useAdminReservation } from "../../api/admin-get-reservations";
import { useAdminCancelReservation } from "../../api/admin-cancel-reservation";
import { formatPrice } from "@/helper/format-helper";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, User, Ticket, CreditCard, Clock, Ban } from "lucide-react";

interface ReservationDetailsDialogProps {
  reservationId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ReservationDetailsDialog: React.FC<ReservationDetailsDialogProps> = ({
  reservationId,
  isOpen,
  onClose,
}) => {
  const { data, isLoading, error } = useAdminReservation({ reservationId });
  const cancelMutation = useAdminCancelReservation();

  const handleCancelReservation = async () => {
    try {
      await cancelMutation.mutateAsync(reservationId);
    } catch (err: any) {
      alert(err.message || "Failed to cancel reservation");
    }
  };

  const reservation = data?.data?.reservation;
  const bookingDate = reservation?.createAt || reservation?.createdAt;
  const theater = reservation?.showTime.movieSchedule.theater as { name: string; location?: { name: string } } | undefined;

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
      case "PAID":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "PENDING":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "CANCELLED":
      case "FAILED":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted-foreground/20";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl bg-card border border-border/50 text-card-foreground">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Ticket className="w-5 h-5 text-primary" />
            Reservation Details
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {reservationId ? `ID: ${reservationId}` : ""}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4 py-6">
            <Skeleton className="h-5 w-[200px]" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : error || !reservation ? (
          <div className="flex flex-col items-center justify-center py-6 text-center text-rose-400">
            <AlertCircle className="w-8 h-8 mb-2 animate-bounce" />
            <p className="text-sm font-semibold">Failed to load reservation details</p>
            <p className="text-xs text-muted-foreground mt-1">{(error as any)?.message || "Not found"}</p>
          </div>
        ) : (
          <div className="space-y-6 py-2">
            {/* Grid for User & Show Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-lg border border-border/50 bg-muted/20 space-y-2">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  Customer
                </h4>
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-foreground">{reservation.user.name}</p>
                  <p className="text-xs text-muted-foreground break-all">{reservation.user.email}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-lg border border-border/50 bg-muted/20 space-y-2">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Booking Time
                </h4>
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-foreground">
                    {bookingDate ? format(new Date(bookingDate), "MMM d, yyyy") : "—"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {bookingDate ? format(new Date(bookingDate), "h:mm:ss a") : "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Show Details */}
            <div className="p-4 rounded-lg border border-border/50 bg-muted/20 space-y-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Showtime & Theater
              </h4>
              <div className="space-y-1">
                <p className="text-base font-bold text-foreground">
                  {reservation.showTime.movieSchedule.movie?.title ?? "Movie Ticket"}
                </p>
                <p className="text-sm font-medium text-muted-foreground">
                  {theater?.name} • {theater?.location?.name ?? "Cinema Location"}
                </p>
                <p className="text-xs text-primary font-medium mt-1">
                  {format(new Date(reservation.showTime.startTime), "EEEE, MMMM d, yyyy")} •{" "}
                  {format(new Date(reservation.showTime.startTime), "HH:mm")} -{" "}
                  {format(new Date(reservation.showTime.endTime), "HH:mm")}
                </p>
              </div>
            </div>

            {/* Seats & Payment */}
            <div className="p-4 rounded-lg border border-border/50 bg-muted/20 space-y-3">
              <div className="flex justify-between items-center border-b border-border/50 pb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Seats Reserved ({reservation.reservationDetails.length})
                </span>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Price per ticket
                </span>
              </div>
              <div className="flex justify-between items-start">
                <div className="flex flex-wrap gap-1.5">
                  {reservation.reservationDetails.map((detail) => (
                    <Badge key={detail.id} variant="secondary" className="px-2 py-0.5 font-mono text-xs">
                      {detail.seat.seatRow}{detail.seat.seatNumber}
                    </Badge>
                  ))}
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {formatPrice(Number(reservation.showTime.movieSchedule.price))}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-border/30 font-semibold text-sm">
                <span className="text-foreground">Total Price</span>
                <span className="text-base font-bold text-primary">
                  {formatPrice(Number(reservation.totalPrice))}
                </span>
              </div>
            </div>

            {/* Status Badges Section */}
            <div className="p-4 rounded-lg border border-border/50 bg-muted/20 space-y-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5" />
                Status Summary
              </h4>
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div>
                  <p className="text-[11px] text-muted-foreground font-medium mb-1">Reservation Status</p>
                  <Badge variant="outline" className={`text-[10px] font-bold uppercase tracking-wider ${getStatusBadgeColor(reservation.status)}`}>
                    {reservation.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground font-medium mb-1">Payment Status</p>
                  <Badge variant="outline" className={`text-[10px] font-bold uppercase tracking-wider ${getStatusBadgeColor(reservation.payment?.status || "UNPAID")}`}>
                    {reservation.payment?.status || "UNPAID"}
                  </Badge>
                </div>
                {reservation.checkedInAt && (
                  <div className="col-span-2">
                    <p className="text-[11px] text-muted-foreground font-medium mb-1">Check-In Status</p>
                    <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                      Checked in at {format(new Date(reservation.checkedInAt), "MMM d, h:mm a")}
                    </Badge>
                  </div>
                )}
              </div>
              {reservation.status === "PENDING" && reservation.expiresAt && (
                <p className="text-[11px] text-amber-500 font-medium">
                  Expires at: {format(new Date(reservation.expiresAt), "MMM d, h:mm a")}
                </p>
              )}
            </div>
          </div>
        )}

        <DialogFooter className="flex sm:justify-between items-center gap-2 pt-2 border-t border-border/40">
          <div>
            {!isLoading && !error && reservation?.status === "PENDING" && (
              <ConfirmationDialog
                title="Cancel Reservation"
                body="Are you sure you want to cancel this reservation? This will release all locked seats."
                isDone={cancelMutation.isSuccess}
                triggerButton={
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={cancelMutation.isPending}
                    className="flex items-center gap-1.5"
                  >
                    <Ban className="w-4 h-4" />
                    Cancel Reservation
                  </Button>
                }
                confirmButton={
                  <Button
                    variant="destructive"
                    disabled={cancelMutation.isPending}
                    onClick={handleCancelReservation}
                  >
                    Confirm
                  </Button>
                }
              />
            )}
          </div>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
