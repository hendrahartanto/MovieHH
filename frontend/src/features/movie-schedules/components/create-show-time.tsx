import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createShowTimeInputSchema,
  CreateShowTimeInput,
  useCreateShowTime,
} from "../api/create-show-time";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNotifications } from "@/components/ui/notification/notification-store";

interface CreateShowTimeProps {
  movieScheduleId: string;
}

export const CreateShowTime = ({ movieScheduleId }: CreateShowTimeProps) => {
  const [open, setOpen] = useState(false);
  const createShowTime = useCreateShowTime({
    mutationConfig: {
      onSuccess: (response) => {
        useNotifications.getState().addNotification({
          type: "success",
          title: "Success",
          message: response.message,
        });
        setOpen(false);
      },
    },
  });

  const form = useForm<CreateShowTimeInput>({
    resolver: zodResolver(createShowTimeInputSchema),
    defaultValues: {
      movieScheduleId,
      startTime: "",
      endTime: "",
    },
  });

  const onSubmit = (data: CreateShowTimeInput) => {
    createShowTime.mutate({ data });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Add Show Time
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Show Time</DialogTitle>
          <DialogDescription>
            Set the time range for this movie schedule.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="create-show-time-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-2"
          >
            {/* Start Time */}
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      step="60"
                      {...field}
                      placeholder="HH:mm"
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the start time for the show.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* End Time */}
            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      step="60"
                      {...field}
                      placeholder="HH:mm"
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the end time for the show.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="create-show-time-form"
            disabled={createShowTime.isPending}
          >
            {createShowTime.isPending ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
