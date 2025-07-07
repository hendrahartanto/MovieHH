import { useSearchParams } from "react-router";
import { useMovies } from "../api/get-movies";
import {
  Edit,
  Trash2,
  Eye,
  Calendar,
  Tag,
  ImageIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteMovie } from "./delete-movie";

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

  const movies = moviesQuery.data?.data.movies;
  const pagination = moviesQuery.data?.data.pagination;

  console.log("MOVIES LIST");
  console.log(movies);

  if (!movies || movies.length === 0) {
    return <EmptyMoviesState />;
  }

  return (
    <div className="space-y-6">
      <Card className="p-0">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Movie</TableHead>
                <TableHead>Genres</TableHead>
                <TableHead>Showtimes</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movies.map((movie, index) => (
                <TableRow key={movie.id}>
                  <TableCell className="pl-6">
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
                        <h3 className="font-semibold truncate">
                          {movie.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {movie.description}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Genres */}
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {movie.genres.slice(0, 3).map((genre) => (
                        <Badge
                          key={genre.id}
                          variant="secondary"
                          className="text-xs"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {genre.name}
                        </Badge>
                      ))}
                      {movie.genres.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{movie.genres.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {movie.showTimes.length}
                        <span className="text-muted-foreground ml-1">
                          {movie.showTimes.length === 1
                            ? "showtime"
                            : "showtimes"}
                        </span>
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {new Date(movie.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </TableCell>

                  <TableCell className="text-right pr-6">
                    <div className="flex items-center gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          // Handle view details
                          console.log("View details for movie:", movie.id);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View Details</span>
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          // Handle edit movie
                          console.log("Edit movie:", movie.id);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit Movie</span>
                      </Button>

                      <DeleteMovie movieId={movie.id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {pagination && (
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} movies
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
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
                          variant={
                            pageNum === pagination.page ? "default" : "outline"
                          }
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
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const MovieTableSkeleton = () => {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">
                <Skeleton className="h-4 w-16" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-16" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-20" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-16" />
              </TableHead>
              <TableHead className="text-right pr-6">
                <Skeleton className="h-4 w-16 ml-auto" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell className="pl-6">
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-12 h-16 rounded-lg" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-12 rounded-full" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell className="text-right pr-6">
                  <Skeleton className="w-8 h-8 ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

const EmptyMoviesState = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Movies</h1>
          <p className="text-muted-foreground">Manage your movie collection</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Movie
        </Button>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <ImageIcon className="w-8 h-8 text-muted-foreground" />
          </div>
          <CardTitle className="mb-2">No movies found</CardTitle>
          <p className="text-muted-foreground mb-6 max-w-md">
            Get started by adding your first movie to the collection. You can
            manage genres, showtimes, and more.
          </p>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Movie
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
