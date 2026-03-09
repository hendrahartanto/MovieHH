import { Authorization, ROLES } from "@/lib/authorization";
import {
  useCreateMovieSchedule,
  createMovieScheduleInputSchema,
  CreateMovieScheduleInput,
} from "@/features/movie-schedules/api/create-movie-schedule";
import { FormSheet } from "@/components/ui/form/form-sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useMovies } from "@/features/movies/api/get-movies";
import { useTheaters } from "@/features/theaters/api/get-theaters";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications } from "@/components/ui/notification/notification-store";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DatePicker } from "@/components/ui/date-picker";

export const CreateMovieSchedule = () => {
  const [movieSearchTerm, setMovieSearchTerm] = useState("");
  const { data: moviesData, isLoading: isLoadingMovies } = useMovies({});
  const { data: theatersData, isLoading: isLoadingTheaters } = useTheaters({
    all: true,
  });

  const filteredMovies = useMemo(() => {
    if (!moviesData?.data.movies) return [];

    return moviesData.data.movies.filter((movie) =>
      movie.title.toLowerCase().includes(movieSearchTerm.toLowerCase())
    );
  }, [moviesData?.data.movies, movieSearchTerm]);

  const createMovieSchedule = useCreateMovieSchedule({
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

  const form = useForm<CreateMovieScheduleInput>({
    resolver: zodResolver(createMovieScheduleInputSchema),
    defaultValues: {
      movieId: "",
      theaterId: "",
      date: "",
      price: 0,
    },
  });

  const onSubmit = (data: CreateMovieScheduleInput) => {
    createMovieSchedule.mutate({ data });
  };

  return (
    <Authorization allowedRoles={[ROLES.ADMIN]}>
      <FormSheet
        title="Create Movie Schedule"
        isDone={createMovieSchedule.isSuccess}
        triggerButton={
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Schedule
          </Button>
        }
        submitButton={
          <SubmitButton
            type={SubmitButtonType.CREATE}
            form="create-movie-schedule-form"
            isPending={createMovieSchedule.isPending}
          >
            Create Schedule
          </SubmitButton>
        }
        size="lg"
      >
        <Form {...form}>
          <form
            id="create-movie-schedule-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {moviesData?.data.movies && moviesData.data.movies.length > 0 && (
              <FormField
                control={form.control}
                name="movieId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Movie</FormLabel>
                    <FormDescription>
                      Select the movie for this schedule.
                    </FormDescription>

                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search movies..."
                        value={movieSearchTerm}
                        onChange={(e) => setMovieSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    <ScrollArea className="h-48 w-full rounded-md border p-4">
                      {isLoadingMovies ? (
                        <div className="text-sm text-muted-foreground">
                          Loading movies...
                        </div>
                      ) : filteredMovies.length === 0 ? (
                        <div className="text-sm text-muted-foreground">
                          {movieSearchTerm
                            ? `No movies found matching "${movieSearchTerm}"`
                            : "No movies available"}
                        </div>
                      ) : (
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="space-y-3"
                        >
                          {filteredMovies.map((movie) => (
                            <div
                              key={movie.id}
                              className="flex items-center space-x-3"
                            >
                              <RadioGroupItem
                                value={movie.id}
                                id={movie.id}
                                className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                              />
                              <Label
                                htmlFor={movie.id}
                                className="text-sm font-normal text-foreground cursor-pointer flex-1"
                              >
                                {movie.title}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      )}
                    </ScrollArea>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="theaterId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Theater</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a theater" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingTheaters ? (
                        <div className="text-sm text-muted-foreground p-2">
                          Loading theaters...
                        </div>
                      ) : theatersData?.data.theaters &&
                        theatersData.data.theaters.length > 0 ? (
                        theatersData.data.theaters.map((theater) => (
                          <SelectItem key={theater.id} value={theater.id}>
                            {theater.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="text-sm text-muted-foreground p-2">
                          No theaters available
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose which theater will show this movie.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }}
                  />
                  <FormDescription>
                    Select the date for this movie schedule.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ticket Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      placeholder="Enter ticket price"
                      value={field.value === 0 ? "" : String(field.value)}
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
                  <FormDescription>
                    Set the ticket price for this schedule.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </FormSheet>
    </Authorization>
  );
};
