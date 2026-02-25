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
import {
  UpdateGenreInput,
  updateGenreInputSchema,
  useUpdateGenre,
} from "@/features/genres/api/update-genre";
import { Authorization, ROLES } from "@/lib/authorization";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "lucide-react";
import { useForm } from "react-hook-form";
import { Genre } from "../../types";
import { useNotifications } from "@/components/ui/notification/notification-store";

interface UpdateGenreProps {
  genre: Genre;
}

export const UpdateGenre = ({ genre }: UpdateGenreProps) => {
  const updateGenre = useUpdateGenre({
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

  const form = useForm<UpdateGenreInput>({
    resolver: zodResolver(updateGenreInputSchema),
    defaultValues: {
      name: genre.name,
    },
  });

  const onSubmit = (data: UpdateGenreInput) => {
    updateGenre.mutate({ data, genreId: genre.id });
  };

  return (
    <Authorization allowedRoles={[ROLES.ADMIN]}>
      <FormSheet
        title="Update Genre"
        isDone={updateGenre.isSuccess}
        triggerButton={
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Edit className="h-4 w-4" />
          </Button>
        }
        submitButton={
          <SubmitButton
            form="update-genre-form"
            type={SubmitButtonType.UPDATE}
            isPending={updateGenre.isPending}
          >
            Update Genre
          </SubmitButton>
        }
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} id="update-genre-form">
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
