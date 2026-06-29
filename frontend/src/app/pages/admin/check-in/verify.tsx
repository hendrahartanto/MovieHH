import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useCheckInReservation } from "@/features/reservations/api/check-in";
import { SidebarContentLayout } from "@/components/layouts/sidebar-content-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Loader2,
  CheckCircle,
  XCircle,
  MapPin,
  Clock,
  Calendar,
  User,
  Armchair,
  QrCode,
} from "lucide-react";
import { format } from "date-fns";
import { paths } from "@/config/paths";

export const VerifyPage = () => {
  const { reservationId } = useParams();
  const navigate = useNavigate();
  const hasTriggered = useRef(false);

  const [reservationData, setReservationData] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const checkInMutation = useCheckInReservation({
    mutationConfig: {
      onSuccess: (response) => {
        setReservationData(response.data.reservation);
        setErrorMsg(null);
      },
      onError: (err: any) => {
        const message =
          err.response?.data?.message || err.message || "Failed to verify ticket";
        setErrorMsg(message);
        setReservationData(null);
      },
    },
  });

  useEffect(() => {
    if (reservationId && !hasTriggered.current) {
      hasTriggered.current = true;
      checkInMutation.mutate(reservationId);
    }
  }, [reservationId]);

  const isPending = checkInMutation.isPending;

  return (
    <SidebarContentLayout
      title="Ticket Verification"
      subtitle="Processing checkout QR check-in scan."
      showBackButton={true}
      onBackClick={() => navigate(paths.admin.checkIn.getHref())}
    >
      <div className="max-w-xl mx-auto space-y-6">

      {isPending && (
        <Card className="h-[300px] flex flex-col items-center justify-center border-dashed">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground font-medium animate-pulse">
            Verifying ticket details...
          </p>
        </Card>
      )}

      {/* Success View */}
      {!isPending && reservationData && (
        <Card className="border-emerald-500/30 bg-emerald-500/[0.04] shadow-xl animate-in fade-in duration-200">
          <CardHeader className="bg-emerald-500/10 border-b border-emerald-500/20 text-center py-8">
            <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-3 animate-bounce" />
            <CardTitle className="text-2xl font-extrabold text-emerald-400">
              Valid Ticket Verified
            </CardTitle>
            <CardDescription className="text-emerald-500/80 font-medium mt-1">
              Check-in completed successfully.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold block mb-1">
                Movie
              </span>
              <h2 className="text-xl font-bold text-foreground">
                {reservationData.showTime.movieSchedule.movie.title}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground block text-xs uppercase tracking-wider">
                  Cinema Hall
                </span>
                <span className="font-semibold text-foreground flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  {reservationData.showTime.movieSchedule.theater.name}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs uppercase tracking-wider">
                  Show Time
                </span>
                <span className="font-semibold text-foreground flex items-center gap-1.5 mt-1">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  {format(new Date(reservationData.showTime.startTime), "h:mm a")}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs uppercase tracking-wider">
                  Date
                </span>
                <span className="font-semibold text-foreground flex items-center gap-1.5 mt-1">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  {format(
                    new Date(reservationData.showTime.movieSchedule.date),
                    "MMM d, yyyy"
                  )}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs uppercase tracking-wider">
                  Customer
                </span>
                <span className="font-semibold text-foreground flex items-center gap-1.5 mt-1">
                  <User className="w-3.5 h-3.5 text-primary" />
                  {reservationData.user.name}
                </span>
              </div>
            </div>

            <div className="border-t border-border/30 pt-4">
              <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-2">
                Seats ({reservationData.reservationDetails.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {reservationData.reservationDetails.map((detail: any) => (
                  <div
                    key={detail.id}
                    className="inline-flex items-center gap-1 bg-primary/10 border border-primary/20 rounded px-2.5 py-1"
                  >
                    <Armchair className="w-3 h-3 text-primary" />
                    <span className="text-xs font-mono font-bold text-foreground">
                      {detail.seat.seatRow}
                      {detail.seat.seatNumber}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Button
              className="w-full flex items-center justify-center gap-2"
              variant="glow"
              onClick={() => navigate(paths.admin.checkIn.getHref())}
            >
              <QrCode className="w-4 h-4" />
              Open Scanner Dashboard
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Failure View */}
      {!isPending && errorMsg && (
        <Card className="border-red-500/30 bg-red-500/[0.04] shadow-xl animate-in fade-in duration-200">
          <CardHeader className="bg-red-500/10 border-b border-red-500/20 text-center py-8">
            <XCircle className="w-16 h-16 text-red-500/80 mx-auto mb-3" />
            <CardTitle className="text-2xl font-extrabold text-red-500">
              Check-in Refused
            </CardTitle>
            <CardDescription className="text-red-500/70 mt-1">
              The check-in scan could not be verified.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6 text-center">
            <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-lg max-w-sm mx-auto">
              <p className="text-sm font-semibold text-foreground mb-1">
                Refusal Reason:
              </p>
              <p className="text-muted-foreground text-sm">
                {errorMsg}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                className="w-full flex items-center justify-center gap-2"
                onClick={() => navigate(paths.admin.checkIn.getHref())}
              >
                <QrCode className="w-4 h-4" />
                Return to Scanner
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      </div>
    </SidebarContentLayout>
  );
};

export default VerifyPage;
