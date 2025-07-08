import { useSearchParams } from "react-router";
import { useGenres } from "../api/get-genres";
import {
  Edit,
  Eye,
  Tag,
  ChevronLeft,
  ChevronRight,
  Plus,
  Music,
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
import { DeleteGenre } from "./delete-genre";

export const GenresList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const genresQuery = useGenres({
    page: +(searchParams.get("page") || 1),
  });

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString() });
  };

  if (genresQuery.isLoading) {
    return <GenreTableSkeleton />;
  }

  const genres = genresQuery.data?.data.genres;
  const pagination = genresQuery.data?.data.pagination;

  console.log("GENRES LIST");
  console.log(genres);

  if (!genres || genres.length === 0) {
    return <EmptyGenresState />;
  }

  return (
    <div className="space-y-6">
      <Card className="p-0">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Genre</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {genres.map((genre, index) => (
                <TableRow key={genre.name || index}>
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-4">
                      <div className="relative w-10 h-10 rounded-full bg-muted flex-shrink-0 flex items-center justify-center">
                        <Tag className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold truncate">{genre.name}</h3>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {new Date(genre.createdAt).toLocaleDateString("en-US", {
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
                          console.log("View details for genre:", genre.name);
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
                          // Handle edit genre
                          console.log("Edit genre:", genre.name);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit Genre</span>
                      </Button>
                      <DeleteGenre genreId={genre.id} />
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
                of {pagination.total} genres
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

const GenreTableSkeleton = () => {
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
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
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

const EmptyGenresState = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Genres</h1>
          <p className="text-muted-foreground">Manage your music genres</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Genre
        </Button>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Music className="w-8 h-8 text-muted-foreground" />
          </div>
          <CardTitle className="mb-2">No genres found</CardTitle>
          <p className="text-muted-foreground mb-6 max-w-md">
            Get started by adding your first genre to the collection. You can
            organize your music library with custom genres.
          </p>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Genre
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
