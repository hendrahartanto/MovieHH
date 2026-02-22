import { useState, useMemo } from "react";
import { MapPin, Film, Armchair, Search } from "lucide-react";
import { useTheaters } from "../api/get-theaters";
import { Skeleton } from "@/components/ui/skeleton";

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
        {/* Skeleton untuk Search Bar */}
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
      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search cinemas by name or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-card text-foreground border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-muted-foreground transition-all"
        />
      </div>

      {/* Empty State untuk Search */}
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

      {/* Grid Bioskop */}
      {filteredTheaters.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTheaters.map((theater) => (
            <div
              key={theater.id}
              className="group relative bg-card text-card-foreground rounded-xl p-6 cinema-border hover:cinema-glow transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors mb-3 line-clamp-1">
                  {theater.name}
                </h3>

                <div className="flex items-start text-muted-foreground mb-4">
                  <MapPin className="w-5 h-5 mr-2 shrink-0 text-primary" />
                  <span className="text-sm line-clamp-2">
                    {(theater.location as any)?.address ||
                      (theater.location as any)?.city ||
                      "Address not available"}
                  </span>
                </div>
              </div>

              <div className="pt-4 mt-2 border-t border-border flex items-center justify-between text-sm">
                <div className="flex items-center text-muted-foreground">
                  <Armchair className="w-4 h-4 mr-1.5 text-primary" />
                  <span>
                    <strong className="text-foreground">
                      {theater.seats?.length || 0}
                    </strong>{" "}
                    Seats
                  </span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Film className="w-4 h-4 mr-1.5 text-primary" />
                  <span>
                    <strong className="text-foreground">
                      {theater.movieSchedules?.length || 0}
                    </strong>{" "}
                    Showing
                  </span>
                </div>
              </div>

              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[100px] -z-10 group-hover:bg-primary/10 transition-colors" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
