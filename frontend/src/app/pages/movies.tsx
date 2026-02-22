import { useState, useMemo } from "react";
import { useSearchParams } from "react-router";
import { Loader2, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMovies } from "@/features/movies/api/get-movies";
import { MovieCard } from "@/features/movies/components/movie-card";
import { MovieStatus } from "@/lib/api";
import { UserSearchBox } from "@/components/ui/user-search-box";

type TabValue = "now-showing" | "upcoming";

export default function MoviesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = (searchParams.get("tab") as TabValue) || "now-showing";

  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, isError } = useMovies({ page: 1 });

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
    if (searchQuery) {
      setSearchQuery("");
    }
  };

  const allMovies = data?.data.movies || [];

  const nowShowingMovies = allMovies.filter(
    (movie) => movie.status === MovieStatus.ACTIVE,
  );

  const upcomingMovies = allMovies.filter(
    (movie) => movie.status === MovieStatus.COMING_SOON,
  );

  const filteredNowShowing = useMemo(() => {
    if (!searchQuery.trim()) return nowShowingMovies;
    return nowShowingMovies.filter((movie) =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [nowShowingMovies, searchQuery]);

  const filteredUpcoming = useMemo(() => {
    if (!searchQuery.trim()) return upcomingMovies;
    return upcomingMovies.filter((movie) =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [upcomingMovies, searchQuery]);

  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="content-wrapper py-24">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          Explore Movies
        </h2>
        <p className="text-muted-foreground">
          Discover what's playing in theaters and what's coming soon.
        </p>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {isError && (
        <div className="text-center py-20">
          <div className="bg-destructive/10 text-destructive p-6 rounded-xl cinema-border inline-block">
            <p className="font-semibold">Failed to load movies.</p>
            <p className="text-sm opacity-80 mt-1">Please try again later.</p>
          </div>
        </div>
      )}

      {!isLoading && !isError && (
        <Tabs
          value={currentTab}
          onValueChange={handleTabChange}
          className="w-full animate-in fade-in duration-500"
        >
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
            <TabsList className="grid w-full md:w-[400px] grid-cols-2 bg-muted/50 p-1 cinema-border m-0">
              <TabsTrigger
                value="now-showing"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
              >
                Now Showing
              </TabsTrigger>
              <TabsTrigger
                value="upcoming"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
              >
                Coming Soon
              </TabsTrigger>
            </TabsList>

            <UserSearchBox
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search movies..."
              className="w-full md:w-80"
            />
          </div>

          {isSearching ? (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {filteredNowShowing.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-6 border-b border-border pb-2">
                    <h2 className="text-2xl font-bold text-foreground">
                      Now Showing
                    </h2>
                    <span className="bg-primary/20 text-primary px-2.5 py-0.5 rounded-full text-xs font-semibold">
                      {filteredNowShowing.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredNowShowing.map((movie) => (
                      <MovieCard key={movie.id} movie={movie} />
                    ))}
                  </div>
                </div>
              )}

              {filteredUpcoming.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-6 border-b border-border pb-2">
                    <h2 className="text-2xl font-bold text-foreground">
                      Coming Soon
                    </h2>
                    <span className="bg-primary/20 text-primary px-2.5 py-0.5 rounded-full text-xs font-semibold">
                      {filteredUpcoming.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredUpcoming.map((movie) => (
                      <MovieCard key={movie.id} movie={movie} />
                    ))}
                  </div>
                </div>
              )}

              {filteredNowShowing.length === 0 &&
                filteredUpcoming.length === 0 && (
                  <div className="text-center py-20 border border-dashed border-border rounded-xl bg-card/30">
                    <Search className="w-10 h-10 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium text-foreground">
                      No movies found
                    </p>
                    <p className="text-muted-foreground">
                      We couldn't find anything matching "{searchQuery}"
                    </p>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="mt-4 text-primary hover:underline text-sm font-medium"
                    >
                      Clear Search
                    </button>
                  </div>
                )}
            </div>
          ) : (
            <>
              <TabsContent
                value="now-showing"
                className="mt-0 focus-visible:outline-none focus-visible:ring-0"
              >
                {nowShowingMovies.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {nowShowingMovies.map((movie) => (
                      <MovieCard key={movie.id} movie={movie} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 border border-dashed border-border rounded-xl bg-card/50">
                    <p className="text-muted-foreground">
                      No movies are currently showing.
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent
                value="upcoming"
                className="mt-0 focus-visible:outline-none focus-visible:ring-0"
              >
                {upcomingMovies.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {upcomingMovies.map((movie) => (
                      <MovieCard key={movie.id} movie={movie} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 border border-dashed border-border rounded-xl bg-card/50">
                    <p className="text-muted-foreground">
                      No upcoming movies at the moment.
                    </p>
                  </div>
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      )}
    </div>
  );
}
