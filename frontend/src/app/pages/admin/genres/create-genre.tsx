import { Button } from "@/components/ui/button";
import { FormSheet } from "@/components/ui/form/form-sheet";
import {
  SubmitButton,
  SubmitButtonType,
} from "@/components/ui/form/submit-button";
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
      onSuccess: () => {
        // TODO: add toast notification
      },
    },
  });

  const form = useForm<CreateGenreInput>({
    resolver: zodResolver(createGenreInputSchema),
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
            type={SubmitButtonType.CREATE}
            form="create-movie-form"
            isPending={createGenre.isPending}
          >
            Create Genre
          </SubmitButton>
        }
      >
        <div>sesusatu</div>
      </FormSheet>
    </Authorization>
  );
};
