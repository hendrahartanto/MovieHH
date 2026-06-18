import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  useActiveReservations,
  useTransactionHistory,
} from "@/features/reservations/api";
import { Ticket, Clock } from "lucide-react";
import {
  PageHeader,
  ReservationCard,
  ReservationSkeleton,
  EmptyState,
} from "@/features/reservations/components/my-tickets";

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
