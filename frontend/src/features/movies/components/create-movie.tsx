import { Authorization, ROLES } from "@/lib/authorization";
import {
  useCreateMovie,
  createMovieInputSchema,
  CreateMovieInput,
} from "../api/create-movie";
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
import { Plus, Film } from "lucide-react";
import {
  SubmitButton,
  SubmitButtonType,
} from "@/components/ui/form/submit-button";

//TODO: Mock genres - replace with actual genres query
const MOCK_GENRES = [
  { id: "1", name: "Action" },
  { id: "2", name: "Comedy" },
  { id: "3", name: "Drama" },
  { id: "4", name: "Horror" },
  { id: "5", name: "Romance" },
  { id: "6", name: "Sci-Fi" },
  { id: "7", name: "Thriller" },
];

export const CreateMovie = () => {
  const createMovie = useCreateMovie({
    mutationConfig: {
      onSuccess: () => {
        // TODO: add toast notification
        form.reset();
      },
    },
  });

  const form = useForm<CreateMovieInput>({
    resolver: zodResolver(createMovieInputSchema),
    defaultValues: {
      title: "",
      description: "",
      posterUrl: "",
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

            <FormField
              control={form.control}
              name="genreIds"
              render={() => (
                <FormItem>
                  <FormLabel>Genres</FormLabel>
                  <FormDescription>
                    Select at least one genre that applies to this movie.
                  </FormDescription>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    {MOCK_GENRES.map((genre) => (
                      <FormField
                        key={genre.id}
                        control={form.control}
                        name="genreIds"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={genre.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(genre.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          genre.id,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== genre.id
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
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Preview section if poster URL is provided */}
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
