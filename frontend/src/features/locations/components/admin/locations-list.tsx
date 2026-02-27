import { useSearchParams } from "react-router";
import { useLocations } from "@/features/locations/api/get-locations";
import { Eye, MapPin, Building, ChevronLeft, ChevronRight } from "lucide-react";

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
import { UpdateLocation } from "./update-location";
import { DeleteLocation } from "./delete-location";

export const LocationsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = +(searchParams.get("page") || 1);
  const search = searchParams.get("search") || "";

  const locationsQuery = useLocations({
    page,
    search,
  });

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString() });
  };

  if (locationsQuery.isLoading) {
    return <LocationTableSkeleton />;
  }

  const locations = locationsQuery.data?.data.locations;
  const pagination = locationsQuery.data?.data.pagination;

  console.log("LOCATIONS LIST");
  console.log(locations);

  if (!locations || locations.length === 0) {
    return <EmptyLocationsState />;
  }

  return (
    <div className="space-y-6">
      <Card className="p-0">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Location</TableHead>
                <TableHead>Theaters</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locations.map((location) => (
                <TableRow key={location.id}>
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0 flex items-center justify-center">
                        <Building className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold truncate">
                          {location.name}
                        </h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {location.address}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {location.theaters?.length ?? 0}
                        <span className="text-muted-foreground ml-1">
                          {location.theaters?.length === 1
                            ? "theater"
                            : "theaters"}
                        </span>
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {new Date(location.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
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
                          console.log(
                            "View details for location:",
                            location.id
                          );
                        }}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View Details</span>
                      </Button>

                      <UpdateLocation location={location} />
                      <DeleteLocation locationId={location.id} />
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
                of {pagination.total} locations
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

const LocationTableSkeleton = () => {
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
                    <Skeleton className="w-12 h-12 rounded-lg" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-48" />
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

const EmptyLocationsState = () => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <Building className="w-8 h-8 text-muted-foreground" />
        </div>
        <CardTitle className="mb-2">No locations found</CardTitle>
        <p className="text-muted-foreground mb-6 max-w-md">
          Get started by adding your first cinema location. You can manage
          theaters, addresses, and more.
        </p>
      </CardContent>
    </Card>
  );
};
