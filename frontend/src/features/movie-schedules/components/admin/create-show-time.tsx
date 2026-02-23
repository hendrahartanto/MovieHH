import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createShowTimeInputSchema,
  CreateShowTimeInput,
  useCreateShowTime,
} from "@/features/movie-schedules/api/create-show-time";
import { Modal } from "@/components/ui/modal";
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
import { useEffect, useState } from "react";

interface CreateShowTimeProps {
  movieScheduleId: string;
}

export const CreateShowTime = ({ movieScheduleId }: CreateShowTimeProps) => {
  const [isClose, setIsClose] = useState(false);

  const createShowTime = useCreateShowTime({
    mutationConfig: {
      onSuccess: (response) => {
        useNotifications.getState().addNotification({
          type: "success",
          title: "Success",
          message: response.message,
        });
        setIsClose(true);
        form.reset();
      },
      onError: () => {
        setIsClose(true);
      },
    },
  });

  useEffect(() => {
    if (isClose) {
      setIsClose(false);
    }
  }, [isClose]);

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

  const handleCancel = () => {
    form.reset();
    setIsClose(true);
  };

  return (
    <Modal
      title="Create Show Time"
      triggerButton={
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Add Show Time
        </Button>
      }
      isDone={createShowTime.isSuccess || isClose}
    >
      <Form {...form}>
        <form
          id="create-show-time-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 py-2"
        >
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <Input type="time" step="60" {...field} placeholder="HH:mm" />
                </FormControl>
                <FormDescription>
                  Enter the start time for the show.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <Input type="time" step="60" {...field} placeholder="HH:mm" />
                </FormControl>
                <FormDescription>
                  Enter the end time for the show.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={createShowTime.isPending}>
              {createShowTime.isPending ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
};
