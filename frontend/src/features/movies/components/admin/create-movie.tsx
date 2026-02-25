import { Authorization, ROLES } from "@/lib/authorization";
import {
  useCreateMovie,
  createMovieInputSchema,
  CreateMovieInput,
} from "../../api/create-movie";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Search } from "lucide-react";
import {
  SubmitButton,
  SubmitButtonType,
} from "@/components/ui/form/submit-button";
import { useMemo, useState } from "react";
import { useGenres } from "@/features/genres/api/get-genres";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications } from "@/components/ui/notification/notification-store";

export const CreateMovie = () => {
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

  const createMovie = useCreateMovie({
    mutationConfig: {
      onSuccess: (response) => {
        useNotifications.getState().addNotification({
          type: "success",
          title: "Success",
          message: response.message,
        });
        form.reset();
      },
    },
  });

  const form = useForm<CreateMovieInput>({
    resolver: zodResolver(createMovieInputSchema),
    defaultValues: {
      title: "",
      synopsis: "",
      poster: undefined,
      banner: undefined,
      director: "",
      writer: "",
      duration: undefined,
      isFeatured: false,
      status: "ACTIVE",
      trailerUrl: "",
      genreIds: [],
    },
  });

  const onSubmit = (data: CreateMovieInput) => {
    createMovie.mutate({ data });
  };

  return (
    <Authorization allowedRoles={[ROLES.ADMIN]}>
      <FormSheet
        title="Create Movie"
        isDone={createMovie.isSuccess}
        triggerButton={
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Movie
          </Button>
        }
        submitButton={
          <SubmitButton
            type={SubmitButtonType.CREATE}
            form="create-movie-form"
            isPending={createMovie.isPending}
          >
            Create Movie
          </SubmitButton>
        }
        size="lg"
      >
        <Form {...form}>
          <form
            id="create-movie-form"
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
              name="synopsis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Synopsis (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter movie synopsis"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a brief synopsis of the movie plot.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="director"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Director (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter director name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="writer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Writer (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter writer name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        placeholder="Enter duration"
                        value={field.value === 0 ? "0" : String(field.value)}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === "") {
                            field.onChange(0);
                            return;
                          }
                          const num = Number(val);
                          field.onChange(isNaN(num) ? 0 : num);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                        <SelectItem value="COMING_SOON">Coming Soon</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="trailerUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trailer URL (optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://youtube.com/watch?v=..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the YouTube or video URL for the movie trailer.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured Movie</FormLabel>
                    <FormDescription>
                      Mark this movie as featured to display it prominently.
                    </FormDescription>
                  </div>
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="poster"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Poster (optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                      />
                    </FormControl>
                    <FormDescription>Upload movie poster image</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="banner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banner (optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                      />
                    </FormControl>
                    <FormDescription>Upload movie banner image</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {(form.watch("poster") || form.watch("banner")) && (
              <div className="flex flex-col gap-4">
                {form.watch("poster") && (
                  <div className="border border-border rounded-lg p-4 bg-card">
                    <p className="text-sm font-medium mb-2">Poster Preview</p>
                    <img
                      src={URL.createObjectURL(form.watch("poster") as File)}
                      alt="Poster preview"
                      className="w-32 h-48 object-cover rounded-md mx-auto"
                    />
                  </div>
                )}

                {form.watch("banner") && (
                  <div className="border border-border rounded-lg p-4 bg-card">
                    <p className="text-sm font-medium mb-2">Banner Preview</p>
                    <img
                      src={URL.createObjectURL(form.watch("banner") as File)}
                      alt="Banner preview"
                      className="w-full h-48 object-cover rounded-md mx-auto"
                    />
                  </div>
                )}
              </div>
            )}
          </form>
        </Form>
      </FormSheet>
    </Authorization>
  );
};
