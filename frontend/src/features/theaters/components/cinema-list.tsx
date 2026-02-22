import { useState, useMemo } from "react";
import { Film } from "lucide-react";
import { useTheaters } from "../api/get-theaters";
import { Skeleton } from "@/components/ui/skeleton";
import { UserSearchBox } from "@/components/ui/user-search-box";
import { CinemaCard } from "./cinema-card";

export const CinemaList = () => {
  const { data, isLoading, isError } = useTheaters({ all: true });
  const [searchQuery, setSearchQuery] = useState("");

  const theaters = data?.data.theaters || [];

  const filteredTheaters = useMemo(() => {
    if (!searchQuery.trim()) return theaters;

    const lowerCaseQuery = searchQuery.toLowerCase();

    return theaters.filter((theater) => {
      const matchName = theater.name.toLowerCase().includes(lowerCaseQuery);

      const locationString = (
        (theater.location as any)?.address ||
        (theater.location as any)?.city ||
        ""
      ).toLowerCase();
      const matchLocation = locationString.includes(lowerCaseQuery);

      return matchName || matchLocation;
    });
  }, [theaters, searchQuery]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-full max-w-md rounded-md cinema-border" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl cinema-border" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-12 text-center">
        <div className="bg-destructive/10 text-destructive p-6 rounded-xl cinema-border inline-block">
          <p className="text-lg font-semibold">
            Failed to load the cinema list.
          </p>
          <p className="text-sm opacity-80 mt-1">
            Please check your connection or try again later.
          </p>
        </div>
      </div>
    );
  }

  if (theaters.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        <Film className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p className="text-lg">No cinemas available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UserSearchBox
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search cinemas by name or location..."
        className="w-full max-w-md"
      />

      {filteredTheaters.length === 0 && (
        <div className="py-12 text-center text-muted-foreground bg-card/50 rounded-xl cinema-border">
          <p className="text-lg">
            No cinemas match your search "{searchQuery}".
          </p>
          <button
            onClick={() => setSearchQuery("")}
            className="mt-4 text-primary hover:underline text-sm font-medium"
          >
            Clear Search
          </button>
        </div>
      )}

      {filteredTheaters.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTheaters.map((theater) => (
            <CinemaCard key={theater.id} theater={theater} />
          ))}
        </div>
      )}
    </div>
  );
};
