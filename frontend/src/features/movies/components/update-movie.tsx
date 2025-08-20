import { Authorization, ROLES } from "@/lib/authorization";
import {
  useUpdateMovie,
  updateMovieInputSchema,
  UpdateMovieInput,
} from "../api/update-movie";
import { FormSheet } from "@/components/ui/form/form-sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Search } from "lucide-react";
import {
  SubmitButton,
  SubmitButtonType,
} from "@/components/ui/form/submit-button";
import { useMemo, useState } from "react";
import { useGenres } from "@/features/genres/api/get-genres";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Movie } from "@/lib/api";
import { useNotifications } from "@/components/ui/notification/notification-store";

interface UpdateMovieProps {
  movie: Movie;
}

export const UpdateMovie = ({ movie }: UpdateMovieProps) => {
  const [genreSearchTerm, setGenreSearchTerm] = useState("");
  const { data: genresData, isLoading: isLoadingGenres } = useGenres({
    all: true,
  });
  const filteredGenres = useMemo(() => {
    if (!genresData?.data.genres) return [];

    return genresData.data.genres.filter((genre) =>
      genre.name.toLowerCase().includes(genreSearchTerm.toLowerCase())
    );
  }, [genresData?.data.genres, genreSearchTerm]);

  const updateMovie = useUpdateMovie({
    mutationConfig: {
      onSuccess: (response) => {
        useNotifications.getState().addNotification({
          type: "success",
          title: "Success",
          message: response.message,
        });
      },
    },
  });

  const form = useForm<UpdateMovieInput>({
    resolver: zodResolver(updateMovieInputSchema),
    defaultValues: {
      title: movie.title,
      description: movie.description || "",
      posterUrl: movie.posterUrl || "",
      genreIds: movie.genres?.map((genre) => genre.id) || [],
    },
  });

  const onSubmit = (data: UpdateMovieInput) => {
    updateMovie.mutate({ data, movieId: movie.id });
  };

  return (
    <Authorization allowedRoles={[ROLES.ADMIN]}>
      <FormSheet
        title="Update Movie"
        isDone={updateMovie.isSuccess}
        triggerButton={
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Edit className="w-4 h-4" />
          </Button>
        }
        submitButton={
          <SubmitButton
            type={SubmitButtonType.UPDATE}
            form="update-movie-form"
            isPending={updateMovie.isPending}
          >
            Update Movie
          </SubmitButton>
        }
        size="lg"
      >
        <Form {...form}>
          <form
            id="update-movie-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Movie Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter movie title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter movie description"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a brief description of the movie plot.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="posterUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Poster URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/poster.jpg"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional: URL to the movie poster image.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {genresData?.data.genres && genresData.data.genres.length > 0 && (
              <FormField
                control={form.control}
                name="genreIds"
                render={() => (
                  <FormItem>
                    <FormLabel>Genres</FormLabel>
                    <FormDescription>
                      Select at least one genre that applies to this movie.
                    </FormDescription>

                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search genres..."
                        value={genreSearchTerm}
                        onChange={(e) => setGenreSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    <ScrollArea className="h-48 w-full rounded-md border p-4">
                      {isLoadingGenres ? (
                        <div className="text-sm text-muted-foreground">
                          Loading genres...
                        </div>
                      ) : filteredGenres.length === 0 ? (
                        <div className="text-sm text-muted-foreground">
                          {genreSearchTerm
                            ? `No genres found matching "${genreSearchTerm}"`
                            : "No genres available"}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {filteredGenres.map((genre) => (
                            <FormField
                              key={genre.name}
                              control={form.control}
                              name="genreIds"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={genre.name}
                                    className="flex flex-row items-center"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(
                                          genre.id
                                        )}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([
                                                ...(field.value || []),
                                                genre.id,
                                              ])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (id) => id !== genre.id
                                                )
                                              );
                                        }}
                                        className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal text-foreground cursor-pointer">
                                      {genre.name}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {form.watch("posterUrl") && (
              <div className="space-y-2">
                <FormLabel className="text-foreground font-medium">
                  Poster Preview
                </FormLabel>
                <div className="border border-border rounded-lg p-4 bg-card">
                  <img
                    src={form.watch("posterUrl") || ""}
                    alt="Movie poster preview"
                    className="w-32 h-48 object-cover rounded-md mx-auto"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                </div>
              </div>
            )}
          </form>
        </Form>
      </FormSheet>
    </Authorization>
  );
};
