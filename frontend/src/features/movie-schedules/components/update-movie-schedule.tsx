import { Authorization, ROLES } from "@/lib/authorization";
import {
  UpdateMovieScheduleInput,
  updateMovieScheduleInputSchema,
  useUpdateMovieSchedule,
} from "../api/update-movie-schedule";
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
import { Edit, Search } from "lucide-react";
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
import { MovieSchedule } from "@/lib/api";

interface UpdateMovieScheduleProps {
  schedule: MovieSchedule;
}

export const UpdateMovieSchedule = ({ schedule }: UpdateMovieScheduleProps) => {
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

  const updateMovieSchedule = useUpdateMovieSchedule({
    mutationConfig: {
      onSuccess: (response: any) => {
        useNotifications.getState().addNotification({
          type: "success",
          title: "Success",
          message: response.message,
        });
      },
    },
  });

  const form = useForm<UpdateMovieScheduleInput>({
    resolver: zodResolver(updateMovieScheduleInputSchema),
    defaultValues: {
      movieId: schedule.movie.id,
      theaterId: schedule.theater.id,
      date: new Date(schedule.date).toISOString().split("T")[0],
      price: +schedule.price,
    },
  });

  const onSubmit = (data: UpdateMovieScheduleInput) => {
    updateMovieSchedule.mutate({ data, movieScheduleId: schedule.id });
  };

  return (
    <Authorization allowedRoles={[ROLES.ADMIN]}>
      <FormSheet
        title="Update Movie Schedule"
        isDone={updateMovieSchedule.isSuccess}
        triggerButton={
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Edit className="h-4 w-4" />
          </Button>
        }
        submitButton={
          <SubmitButton
            form="update-movie-schedule-form"
            type={SubmitButtonType.UPDATE}
            isPending={updateMovieSchedule.isPending}
          >
            Update Schedule
          </SubmitButton>
        }
        size="lg"
      >
        <Form {...form}>
          <form
            id="update-movie-schedule-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
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
                            <RadioGroupItem value={movie.id} id={movie.id} />
                            <Label
                              htmlFor={movie.id}
                              className="cursor-pointer"
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
                      ) : (
                        theatersData?.data.theaters.map((theater) => (
                          <SelectItem key={theater.id} value={theater.id}>
                            {theater.name}
                          </SelectItem>
                        ))
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
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </FormControl>
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
                        let val = e.target.value;
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
