import { useSearchParams } from "react-router";
import { useMovies } from "../api/get-movies";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Tag,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export const MoviesList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const moviesQuery = useMovies({
    page: +(searchParams.get("page") || 1),
  });

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString() });
  };

  if (moviesQuery.isLoading) {
    return <MovieTableSkeleton />;
  }

  const movies = moviesQuery.data?.movies;
  const pagination = moviesQuery.data?.pagination;

  console.log("MOVIES LIST");
  console.log(moviesQuery.data);

  if (!movies || movies.length === 0) {
    return <EmptyMoviesState />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Movies</h1>
          <p className="text-muted-foreground">Manage your movie collection</p>
        </div>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200 font-medium">
          Add Movie
        </button>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-foreground">
                  Movie
                </th>
                <th className="text-left px-6 py-4 font-semibold text-foreground">
                  Genres
                </th>
                <th className="text-left px-6 py-4 font-semibold text-foreground">
                  Showtimes
                </th>
                <th className="text-left px-6 py-4 font-semibold text-foreground">
                  Created
                </th>
                <th className="text-right px-6 py-4 font-semibold text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie, index) => (
                <tr
                  key={movie.id}
                  className={`border-b border-border hover:bg-accent/50 transition-colors duration-200 ${
                    index === movies.length - 1 ? "border-b-0" : ""
                  }`}
                >
                  {/* Movie Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        {movie.posterUrl ? (
                          <img
                            src={movie.posterUrl}
                            alt={movie.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-foreground truncate">
                          {movie.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {movie.description}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Genres */}
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {movie.genres.slice(0, 3).map((genre) => (
                        <span
                          key={genre.id}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                        >
                          <Tag className="w-3 h-3" />
                          {genre.name}
                        </span>
                      ))}
                      {movie.genres.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs">
                          +{movie.genres.length - 3} more
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Showtimes */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground font-medium">
                        {movie.showtime.length}
                        <span className="text-muted-foreground ml-1">
                          {movie.showtime.length === 1
                            ? "showtime"
                            : "showtimes"}
                        </span>
                      </span>
                    </div>
                  </td>

                  {/* Created Date */}
                  <td className="px-6 py-4">
                    <span className="text-sm text-muted-foreground">
                      {new Date(movie.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors duration-200"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors duration-200"
                        title="Edit Movie"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors duration-200"
                        title="Delete Movie"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/20">
            <div className="text-sm text-muted-foreground">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              of {pagination.total} movies
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

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
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors duration-200 ${
                          pageNum === pagination.page
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                )}
              </div>

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Skeleton Loading Component
const MovieTableSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-32 bg-muted rounded-lg animate-pulse" />
          <div className="h-4 w-48 bg-muted rounded-lg animate-pulse" />
        </div>
        <div className="h-10 w-24 bg-muted rounded-lg animate-pulse" />
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left px-6 py-4">
                  <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                </th>
                <th className="text-left px-6 py-4">
                  <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                </th>
                <th className="text-left px-6 py-4">
                  <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                </th>
                <th className="text-left px-6 py-4">
                  <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                </th>
                <th className="text-right px-6 py-4">
                  <div className="h-4 w-16 bg-muted rounded animate-pulse ml-auto" />
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="border-b border-border">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-16 bg-muted rounded-lg animate-pulse" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                        <div className="h-3 w-48 bg-muted rounded animate-pulse" />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      <div className="h-6 w-16 bg-muted rounded-full animate-pulse" />
                      <div className="h-6 w-12 bg-muted rounded-full animate-pulse" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-8 h-8 bg-muted rounded-lg animate-pulse" />
                      <div className="w-8 h-8 bg-muted rounded-lg animate-pulse" />
                      <div className="w-8 h-8 bg-muted rounded-lg animate-pulse" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Empty State Component
const EmptyMoviesState = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Movies</h1>
          <p className="text-muted-foreground">Manage your movie collection</p>
        </div>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200 font-medium">
          Add Movie
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl">
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <ImageIcon className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No movies found
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Get started by adding your first movie to the collection. You can
            manage genres, showtimes, and more.
          </p>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200 font-medium">
            Add Your First Movie
          </button>
        </div>
      </div>
    </div>
  );
};
