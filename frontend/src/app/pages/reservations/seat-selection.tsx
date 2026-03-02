import { useParams } from "react-router";
import { SeatGrid } from "@/features/reservations/components/seat-grid";
import { SeatLegend } from "@/features/reservations/components/seat-legend";
import { BookingSummary } from "@/features/reservations/components/booking-summary";

export default function SeatSelectionRoute() {
  const { showtimeId } = useParams();

  return (
    <div className="content-wrapper py-24">
      <h1 className="text-2xl font-bold mb-2">Select Your Seats</h1>

      <div className="bg-card/30 rounded-2xl p-8 border border-border/50">
        <SeatGrid />
        <SeatLegend />
      </div>

      <BookingSummary />
    </div>
  );
}
