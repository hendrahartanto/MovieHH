import React, { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useNotifications } from "@/components/ui/notification/notification-store";
import { useCheckInReservation } from "@/features/reservations/api/check-in";
import { SidebarContentLayout } from "@/components/layouts/sidebar-content-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  QrCode,
  CheckCircle,
  XCircle,
  Hash,
  User,
  Film,
  MapPin,
  Calendar,
  Clock,
  Armchair,
} from "lucide-react";
import { format } from "date-fns";

export const ScannerPage = () => {
  const [manualId, setManualId] = useState("");
  const [isScanning, setIsScanning] = useState(true);
  const [scanResult, setScanResult] = useState<any | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const addNotification = useNotifications((state) => state.addNotification);

  const checkInMutation = useCheckInReservation({
    mutationConfig: {
      onSuccess: (response) => {
        setScanResult(response.data.reservation);
        setScanError(null);
        addNotification({
          type: "success",
          title: "Ticket Verified",
          message: "Check-in successful!",
        });
      },
      onError: (error: any) => {
        const errorMsg =
          error.response?.data?.message || error.message || "Failed to check in";
        setScanError(errorMsg);
        setScanResult(null);
      },
    },
  });

  const parseReservationId = (text: string): string | null => {
    // Matches UUID formats from QR raw text or check-in URLs
    const uuidRegex =
      /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
    const match = text.match(uuidRegex);
    return match ? match[0] : null;
  };

  const handleScanSuccess = (decodedText: string) => {
    // If we are currently processing a mutation or showing a result, skip
    if (checkInMutation.isPending || scanResult || scanError) return;

    const reservationId = parseReservationId(decodedText);
    if (!reservationId) {
      addNotification({
        type: "error",
        title: "Invalid Ticket QR",
        message: "The scanned QR code is not a valid MovieHH reservation.",
      });
      return;
    }

    checkInMutation.mutate(reservationId);
  };

  useEffect(() => {
    if (!isScanning) return;

    // Wait a brief tick to ensure DOM is ready for scanner target div
    const timer = setTimeout(() => {
      const scanner = new Html5QrcodeScanner(
        "reader",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          rememberLastUsedCamera: true,
        },
        /* verbose= */ false
      );

      scanner.render(
        (decodedText) => {
          handleScanSuccess(decodedText);
        },
        () => {
          // Silent scan error
        }
      );

      scannerRef.current = scanner;
    }, 100);

    return () => {
      clearTimeout(timer);
      if (scannerRef.current) {
        scannerRef.current.clear().catch((error) => {
          console.error("Failed to clear html5QrcodeScanner", error);
        });
        scannerRef.current = null;
      }
    };
  }, [isScanning, scanResult, scanError]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const reservationId = parseReservationId(manualId);
    if (!reservationId) {
      addNotification({
        type: "error",
        title: "Invalid ID Format",
        message: "Please enter a valid Reservation UUID.",
      });
      return;
    }

    checkInMutation.mutate(reservationId);
  };

  const resetScanner = () => {
    setScanResult(null);
    setScanError(null);
    setManualId("");
    setIsScanning(true);
  };

  const isPending = checkInMutation.isPending;

  return (
    <SidebarContentLayout
      title="Check-in Scanner"
      subtitle="Scan reservation QR codes or enter Booking IDs to check in moviegoers."
      headerComponent={
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-primary/30 text-primary">
            <QrCode className="w-3.5 h-3.5 mr-1" />
            Scanner Active
          </Badge>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 max-w-4xl">
        {/* Left Side: Scanner Preview or Scan Result */}
        <div className="md:col-span-3 space-y-6">
          {isPending && (
            <Card className="h-[320px] flex flex-col items-center justify-center border-dashed">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground font-medium animate-pulse">
                Verifying reservation details...
              </p>
            </Card>
          )}

          {!isPending && !scanResult && !scanError && (
            <Card className="overflow-hidden border border-border shadow-lg">
              <CardHeader className="bg-muted/40 pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-primary" />
                  Webcam Feed
                </CardTitle>
                <CardDescription>
                  Align the QR code inside the green marker box.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div id="reader" className="w-full bg-black min-h-[300px]" />
              </CardContent>
            </Card>
          )}

          {/* Success Overlay */}
          {!isPending && scanResult && (
            <Card className="border-emerald-500/30 bg-emerald-500/[0.04] shadow-xl animate-in fade-in duration-200">
              <CardHeader className="bg-emerald-500/10 border-b border-emerald-500/20 flex flex-row items-center justify-between py-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="font-bold text-emerald-400">
                    Check-in Successful
                  </span>
                </div>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                  Confirmed
                </Badge>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1">
                    <Film className="w-3.5 h-3.5 text-primary" />
                    <span>Movie Details</span>
                  </div>
                  <h2 className="text-2xl font-bold text-foreground leading-tight">
                    {scanResult.showTime.movieSchedule.movie.title}
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase tracking-wider">
                      Cinema Hall
                    </span>
                    <span className="font-semibold text-foreground flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      {scanResult.showTime.movieSchedule.theater.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase tracking-wider">
                      Show Time
                    </span>
                    <span className="font-semibold text-foreground flex items-center gap-1.5 mt-1">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      {format(new Date(scanResult.showTime.startTime), "h:mm a")}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase tracking-wider">
                      Date
                    </span>
                    <span className="font-semibold text-foreground flex items-center gap-1.5 mt-1">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      {format(
                        new Date(scanResult.showTime.movieSchedule.date),
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
                      {scanResult.user.name}
                    </span>
                  </div>
                </div>

                <div className="border-t border-border/30 pt-4">
                  <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-2">
                    Booked Seats ({scanResult.reservationDetails.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {scanResult.reservationDetails.map((detail: any) => (
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

                <Button className="w-full mt-2" variant="glow" onClick={resetScanner}>
                  Scan Next Ticket
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Failure Overlay */}
          {!isPending && scanError && (
            <Card className="border-red-500/30 bg-red-500/[0.04] shadow-xl animate-in fade-in duration-200">
              <CardHeader className="bg-red-500/10 border-b border-red-500/20 flex items-row items-center gap-2 py-4">
                <XCircle className="w-5 h-5 text-red-400" />
                <span className="font-bold text-red-400">Check-in Failed</span>
              </CardHeader>
              <CardContent className="p-6 space-y-6 text-center">
                <div className="py-4">
                  <XCircle className="w-16 h-16 text-red-500/20 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Invalid Ticket Scan
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                    {scanError}
                  </p>
                </div>
                <Button className="w-full" variant="destructive" onClick={resetScanner}>
                  Dismiss & Scan Next
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Side: Manual Input & Helper Details */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Hash className="w-4 h-4 text-primary" />
                Manual Check-in
              </CardTitle>
              <CardDescription>
                Usable if the QR code is unscannable or customer has a broken screen.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    placeholder="Enter Booking ID/UUID"
                    value={manualId}
                    onChange={(e) => setManualId(e.target.value)}
                    disabled={isPending}
                    className="font-mono text-sm"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isPending || !manualId.trim()}
                >
                  {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Verify Booking
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Staff Instructions
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2.5">
              <p>
                1. Make sure the scanner has webcam permissions in the browser settings.
              </p>
              <p>
                2. Tickets must be marked as <strong>CONFIRMED</strong> (Paid) in order to check in. Pending or expired tickets will be rejected.
              </p>
              <p>
                3. A ticket can only be scanned <strong>once</strong>. Repeated scans of the same ticket will display a failure.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarContentLayout>
  );
};

export default ScannerPage;
