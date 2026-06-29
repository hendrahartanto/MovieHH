import { SidebarContentLayout } from "@/components/layouts/sidebar-content-layout";
import { SearchBox } from "@/components/ui/search-box";
import { useSearchParams } from "react-router";
import { ReservationsList } from "@/features/reservations/components/admin/reservations-list";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const ReservationsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSearch = (value: string) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("search", value);
      params.set("page", "1");
      return params;
    });
  };

  const handleStatusChange = (value: string) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (value === "ALL" || !value) {
        params.delete("status");
      } else {
        params.set("status", value);
      }
      params.set("page", "1");
      return params;
    });
  };

  const currentStatus = searchParams.get("status") || "ALL";

  return (
    <SidebarContentLayout
      title="Reservations"
      subtitle="Audit and manage customer ticket reservations and payments."
      headerComponent={
        <div className="flex flex-col sm:flex-row gap-3 justify-between w-full">
          <div className="flex flex-1 gap-3 max-w-xl">
            <SearchBox
              onSearch={handleSearch}
              defaultValue={searchParams.get("search") || ""}
              placeholder="Search by buyer name, email, or reservation code..."
            />
            <Select value={currentStatus} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[180px] bg-background">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                <SelectItem value="EXPIRED">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      }
    >
      <ReservationsList />
    </SidebarContentLayout>
  );
};

export default ReservationsPage;
