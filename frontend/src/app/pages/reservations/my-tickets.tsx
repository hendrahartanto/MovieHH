import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  useActiveReservations,
  useTransactionHistory,
} from "@/features/reservations/api";
import { ActiveReservation } from "@/features/reservations/types";
import {
  Calendar,
  MapPin,
  Ticket,
  Clock,
  Film,
  ChevronRight,
  Armchair,
  TicketX,
} from "lucide-react";

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }),
    time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    year: d.getFullYear(),
  };
};

const STATUS_STYLES: Record<string, string> = {
  CONFIRMED: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  PENDING: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  CANCELLED: "bg-red-500/15 text-red-400 border-red-500/30",
  COMPLETED: "bg-muted/60 text-muted-foreground border-border",
};

interface SeatDotsProps {
  count: number;
}

const SeatDots = ({ count }: SeatDotsProps) => {
  const visible = Math.min(count, 8);
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: visible }).map((_, i) => (
        <div
          key={i}
          className="w-2.5 h-2.5 rounded-sm bg-primary/70 border border-primary/40"
        />
      ))}
      {count > 8 && (
        <span className="text-xs text-muted-foreground ml-0.5">
          +{count - 8}
        </span>
      )}
    </div>
  );
};

interface ReservationCardProps {
  reservation: ActiveReservation;
  variant?: "active" | "history";
}

const ReservationCard = ({
  reservation,
  variant = "active",
}: ReservationCardProps) => {
  const movie = reservation.showTime.movieSchedule.movie;
  const theater = reservation.showTime.movieSchedule.theater;
  const seatCount = reservation.reservationDetails.length;
  const { date, time } = formatDate(reservation.showTime.startTime);
  const statusStyle =
    STATUS_STYLES[reservation.status] ?? STATUS_STYLES["PENDING"];

  return (
    <article className="group relative flex rounded-xl overflow-hidden cinema-border bg-card transition-all duration-300 hover:cinema-glow hover:-translate-y-0.5">
      <div
        className={`w-1 shrink-0 cinema-gradient ${variant === "history" ? "opacity-30" : "opacity-100"}`}
      />

      <div className="flex flex-col sm:flex-row flex-1 min-w-0">
        <div className="flex-1 min-w-0 px-5 py-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <Film className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="text-xs text-primary font-medium uppercase tracking-wider truncate">
                  {theater?.name ?? "Unknown Theater"}
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground leading-tight truncate">
                {movie?.title ?? "Movie Title"}
              </h3>
            </div>
            <Badge
              variant="outline"
              className={`shrink-0 text-xs font-semibold border px-2 py-0.5 ${statusStyle}`}
            >
              {reservation.status}
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-primary/70 shrink-0" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-primary/70 shrink-0" />
              <span>{time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-primary/70 shrink-0" />
              <span className="truncate">{theater?.name ?? "—"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Armchair className="h-3.5 w-3.5 text-primary/70 shrink-0" />
              <span>
                {seatCount} {seatCount === 1 ? "seat" : "seats"}
              </span>
            </div>
          </div>

          <div className="pt-0.5">
            <SeatDots count={seatCount} />
          </div>
        </div>

        <div className="hidden sm:flex flex-col items-center justify-center px-0 py-4">
          <div className="w-px h-full border-l-2 border-dashed border-border/60 relative">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-background border border-border/60" />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-background border border-border/60" />
          </div>
        </div>

        <div className="sm:w-36 flex flex-row sm:flex-col items-center justify-between sm:justify-center gap-3 px-5 sm:px-4 py-3 sm:py-4 bg-muted/20">
          <div className="text-center">
            <Ticket className="h-6 w-6 text-primary mx-auto mb-1 opacity-80" />
            <p className="text-xs text-muted-foreground font-medium">Booking</p>
            <p className="text-xs font-mono text-foreground/70 truncate max-w-24">
              #{reservation.id.slice(-6).toUpperCase()}
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200" />
        </div>
      </div>
    </article>
  );
};

const ReservationSkeleton = () => (
  <div className="flex rounded-xl overflow-hidden cinema-border bg-card h-32">
    <div className="w-1 bg-primary/20" />
    <div className="flex-1 px-5 py-4 space-y-3">
      <Skeleton className="h-4 w-1/3 bg-muted/50" />
      <Skeleton className="h-5 w-2/3 bg-muted/50" />
      <Skeleton className="h-3 w-1/2 bg-muted/50" />
    </div>
  </div>
);

interface EmptyStateProps {
  label: string;
}

const EmptyState = ({ label }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-20 gap-4 cinema-border rounded-xl bg-card/40">
    <div className="relative">
      <TicketX className="h-14 w-14 text-muted-foreground/30" />
      <div className="absolute inset-0 blur-xl bg-primary/10 rounded-full" />
    </div>
    <div className="text-center">
      <p className="text-base font-semibold text-foreground/60">{label}</p>
      <p className="text-sm text-muted-foreground mt-1">
        Your bookings will appear here once made.
      </p>
    </div>
  </div>
);

interface PageHeaderProps {
  activeCount: number;
}

const PageHeader = ({ activeCount }: PageHeaderProps) => (
  <div className="flex items-end justify-between mb-8">
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-foreground">
        My Tickets
      </h2>
      <p className="text-muted-foreground">
        Manage your active reservations and view your booking history.
      </p>
    </div>
    {activeCount > 0 && (
      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 border border-border rounded-lg px-3 py-1.5">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 neon-pulse" />
        <span>
          {activeCount} active {activeCount === 1 ? "ticket" : "tickets"}
        </span>
      </div>
    )}
  </div>
);

export const MyTicketsPage = () => {
  const { data: activeData, isLoading: activeLoading } =
    useActiveReservations();
  const { data: historyData, isLoading: historyLoading } =
    useTransactionHistory();

  const activeReservations = activeData?.data.activeReservations ?? [];
  const historyReservations = historyData?.data.transactionHistory ?? [];

  return (
    <div className="layout-middle py-24">
      <PageHeader activeCount={activeReservations.length} />

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="inline-flex h-auto bg-muted/30 border border-border rounded-xl p-1 mb-8 gap-1">
          <TabsTrigger
            value="active"
            className="rounded-lg px-6 py-2.5 text-sm font-semibold text-muted-foreground transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md"
          >
            <Ticket className="h-4 w-4 mr-2 inline-block" />
            Active
            {activeReservations.length > 0 && (
              <span className="ml-2 text-xs bg-white/20 rounded-full px-1.5 py-0.5">
                {activeReservations.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="rounded-lg px-6 py-2.5 text-sm font-semibold text-muted-foreground transition-all duration-200 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:border data-[state=active]:border-border"
          >
            <Clock className="h-4 w-4 mr-2 inline-block" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-0">
          {activeLoading ? (
            <div className="grid gap-3">
              {[1, 2].map((i) => (
                <ReservationSkeleton key={i} />
              ))}
            </div>
          ) : activeReservations.length === 0 ? (
            <EmptyState label="No active tickets" />
          ) : (
            <div className="grid gap-3">
              {activeReservations.map((reservation) => (
                <ReservationCard
                  key={reservation.id}
                  reservation={reservation}
                  variant="active"
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-0">
          {historyLoading ? (
            <div className="grid gap-3">
              {[1, 2, 3].map((i) => (
                <ReservationSkeleton key={i} />
              ))}
            </div>
          ) : historyReservations.length === 0 ? (
            <EmptyState label="No booking history yet" />
          ) : (
            <>
              <div className="flex items-center gap-3 mb-5">
                <Separator className="flex-1 bg-border/50" />
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  {historyReservations.length}{" "}
                  {historyReservations.length === 1 ? "booking" : "bookings"}
                </span>
                <Separator className="flex-1 bg-border/50" />
              </div>
              <div className="grid gap-3">
                {historyReservations.map((reservation) => (
                  <ReservationCard
                    key={reservation.id}
                    reservation={reservation}
                    variant="history"
                  />
                ))}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyTicketsPage;
