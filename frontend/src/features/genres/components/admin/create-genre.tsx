import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormSheet } from "@/components/ui/form/form-sheet";
import {
  SubmitButton,
  SubmitButtonType,
} from "@/components/ui/form/submit-button";
import { Input } from "@/components/ui/input";
import { useNotifications } from "@/components/ui/notification/notification-store";
import {
  CreateGenreInput,
  createGenreInputSchema,
  useCreateGenre,
} from "@/features/genres/api/create-genre";
import { Authorization, ROLES } from "@/lib/authorization";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";

export const CreateGenre = () => {
  const createGenre = useCreateGenre({
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

  const form = useForm<CreateGenreInput>({
    resolver: zodResolver(createGenreInputSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: CreateGenreInput) => {
    createGenre.mutate({ data });
  };

  return (
    <Authorization allowedRoles={[ROLES.ADMIN]}>
      <FormSheet
        title="Create Genre"
        isDone={createGenre.isSuccess}
        triggerButton={
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Genre
          </Button>
        }
        submitButton={
          <SubmitButton
            form="create-genre-form"
            type={SubmitButtonType.CREATE}
            isPending={createGenre.isPending}
          >
            Create Genre
          </SubmitButton>
        }
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} id="create-genre-form">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Genre name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter genre name" {...field} />
                  </FormControl>
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
