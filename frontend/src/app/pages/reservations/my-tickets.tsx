import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  useActiveReservations,
  useTransactionHistory,
} from "@/features/reservations/api";
import { Ticket, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PageHeader,
  ReservationCard,
  ReservationSkeleton,
  EmptyState,
} from "@/features/reservations/components/my-tickets";

interface PaginationControlsProps {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemName: string;
}

const PaginationControls = ({
  page,
  limit,
  total,
  totalPages,
  onPageChange,
  itemName,
}: PaginationControlsProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-6 py-4 border border-border/50 bg-card/50 rounded-xl mt-6">
      <div className="text-sm text-muted-foreground">
        Showing {(page - 1) * limit + 1} to{" "}
        {Math.min(page * limit, total)}{" "}
        of {total} {itemName}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1">
          {Array.from(
            { length: Math.min(5, totalPages) },
            (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={
                    pageNum === page ? "default" : "outline"
                  }
                  size="sm"
                  className="w-8 h-8 p-0"
                  onClick={() => onPageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            }
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export const MyTicketsPage = () => {
  const [activePage, setActivePage] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);

  const { data: activeData, isLoading: activeLoading } = useActiveReservations({
    page: activePage,
    limit: 10,
  });
  const { data: historyData, isLoading: historyLoading } = useTransactionHistory({
    page: historyPage,
    limit: 10,
  });

  const activeReservations = activeData?.data.activeReservations ?? [];
  const historyReservations = historyData?.data.transactionHistory ?? [];

  const activePagination = activeData?.data.pagination;
  const historyPagination = historyData?.data.pagination;

  const totalActive = activePagination?.total ?? 0;
  const totalHistory = historyPagination?.total ?? 0;

  return (
    <div className="layout-middle py-24">
      <PageHeader activeCount={totalActive} />

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="inline-flex h-auto bg-muted/30 border border-border rounded-xl p-1 mb-8 gap-1">
          <TabsTrigger
            value="active"
            className="rounded-lg px-6 py-2.5 text-sm font-semibold text-muted-foreground transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md"
          >
            <Ticket className="h-4 w-4 mr-2 inline-block" />
            Active
            {totalActive > 0 && (
              <span className="ml-2 text-xs bg-white/20 rounded-full px-1.5 py-0.5">
                {totalActive}
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
            <>
              <div className="grid gap-3">
                {activeReservations.map((reservation) => (
                  <ReservationCard
                    key={reservation.id}
                    reservation={reservation}
                    variant="active"
                  />
                ))}
              </div>

              {activePagination && (
                <PaginationControls
                  page={activePage}
                  limit={10}
                  total={totalActive}
                  totalPages={activePagination.totalPages}
                  onPageChange={setActivePage}
                  itemName={totalActive === 1 ? "ticket" : "tickets"}
                />
              )}
            </>
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
                  {totalHistory} {totalHistory === 1 ? "booking" : "bookings"}
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

              {historyPagination && (
                <PaginationControls
                  page={historyPage}
                  limit={10}
                  total={totalHistory}
                  totalPages={historyPagination.totalPages}
                  onPageChange={setHistoryPage}
                  itemName={totalHistory === 1 ? "booking" : "bookings"}
                />
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyTicketsPage;
