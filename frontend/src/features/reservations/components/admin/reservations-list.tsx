import { useState } from "react";
import { useSearchParams } from "react-router";
import { useAdminReservations } from "../../api/admin-get-reservations";
import {
  Eye,
  ChevronLeft,
  ChevronRight,
  Receipt,
  Search,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/helper/format-helper";
import { format } from "date-fns";
import { ReservationDetailsDialog } from "./reservation-details-dialog";

export const ReservationsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const page = +(searchParams.get("page") || 1);
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";

  const { data, isLoading } = useAdminReservations({
    page,
    search,
    status,
  });

  const handlePageChange = (pageNum: number) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("page", pageNum.toString());
      return params;
    });
  };

  const getStatusBadgeColor = (statusVal: string) => {
    switch (statusVal) {
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

  if (isLoading) {
    return <ReservationsSkeleton />;
  }

  const reservations = data?.data?.reservations;
  const pagination = data?.data?.pagination;

  if (!reservations || reservations.length === 0) {
    return <EmptyReservationsState search={search} status={status} />;
  }

  return (
    <div className="space-y-6">
      <Card className="p-0 border-border bg-card text-card-foreground shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/20">
              <TableRow className="hover:bg-transparent border-b border-border/50">
                <TableHead className="pl-6 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Code</TableHead>
                <TableHead className="py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Customer</TableHead>
                <TableHead className="py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Movie</TableHead>
                <TableHead className="py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Date Booked</TableHead>
                <TableHead className="py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Total Price</TableHead>
                <TableHead className="py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Reservation</TableHead>
                <TableHead className="py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Payment</TableHead>
                <TableHead className="text-right pr-6 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border/30">
              {reservations.map((res) => {
                const bookingDate = res.createAt || res.createdAt;
                return (
                  <TableRow
                    key={res.id}
                    className="hover:bg-muted/10 transition-colors duration-150 group border-b border-border/10"
                  >
                    <TableCell className="pl-6 font-mono font-semibold text-xs text-primary">
                      {res.id.slice(0, 8).toUpperCase()}
                    </TableCell>
                    <TableCell>
                      <div>
                        <span className="font-semibold text-foreground text-xs block">
                          {res.user.name}
                        </span>
                        <span className="text-[11px] text-muted-foreground block truncate max-w-[160px]">
                          {res.user.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[180px] font-medium text-xs text-foreground truncate">
                      {res.showTime.movieSchedule.movie?.title ?? "Movie Ticket"}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {bookingDate ? format(new Date(bookingDate), "MMM d, yyyy h:mm a") : "—"}
                    </TableCell>
                  <TableCell className="font-semibold text-xs text-foreground whitespace-nowrap">
                    {formatPrice(Number(res.totalPrice))}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${getStatusBadgeColor(res.status)}`}>
                      {res.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${getStatusBadgeColor(res.payment?.status || "UNPAID")}`}>
                      {res.payment?.status || "UNPAID"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-colors rounded-lg"
                      onClick={() => setSelectedId(res.id)}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View Details</span>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            </TableBody>
          </Table>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-border/50">
              <div className="text-xs text-muted-foreground">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} reservations
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="bg-background"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: Math.min(5, pagination.totalPages) },
                    (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.page <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.page >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.page - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={pageNum === pagination.page ? "default" : "outline"}
                          size="sm"
                          className="w-8 h-8 p-0"
                          onClick={() => handlePageChange(pageNum)}
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
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="bg-background"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedId && (
        <ReservationDetailsDialog
          reservationId={selectedId}
          isOpen={!!selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
};

const ReservationsSkeleton = () => {
  return (
    <Card className="border-border shadow-sm">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6"><Skeleton className="h-4 w-12" /></TableHead>
              <TableHead><Skeleton className="h-4 w-20" /></TableHead>
              <TableHead><Skeleton className="h-4 w-16" /></TableHead>
              <TableHead><Skeleton className="h-4 w-16" /></TableHead>
              <TableHead><Skeleton className="h-4 w-16" /></TableHead>
              <TableHead><Skeleton className="h-4 w-16" /></TableHead>
              <TableHead><Skeleton className="h-4 w-16" /></TableHead>
              <TableHead className="text-right pr-6"><Skeleton className="h-4 w-12 ml-auto" /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell className="pl-6"><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <Skeleton className="h-3.5 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                <TableCell className="text-right pr-6"><Skeleton className="h-8 w-8 ml-auto rounded-lg" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

interface EmptyReservationsStateProps {
  search: string;
  status: string;
}

const EmptyReservationsState = ({ search, status }: EmptyReservationsStateProps) => {
  const hasFilters = search || status;

  return (
    <Card className="border-border bg-card text-card-foreground shadow-sm">
      <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-4 border border-border/50 text-muted-foreground">
          {hasFilters ? (
            <Search className="w-8 h-8" />
          ) : (
            <Receipt className="w-8 h-8" />
          )}
        </div>
        <CardTitle className="mb-2 text-lg font-semibold">
          {hasFilters ? "No matches found" : "No reservations yet"}
        </CardTitle>
        <p className="text-sm text-muted-foreground mb-6 max-w-md">
          {hasFilters
            ? "Your search query or status filter did not return any transactions. Try checking your spelling or adjusting filters."
            : "Customer ticket purchases and booking history will appear here once orders are made."}
        </p>
      </CardContent>
    </Card>
  );
};
