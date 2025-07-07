import { ConfirmationDialog } from "@/components/ui/confirmation-modal";
import {
  SubmitButton,
  SubmitButtonType,
} from "@/components/ui/form/submit-button";
import { Authorization, ROLES } from "@/lib/authorization";
import { Trash2 } from "lucide-react";
import { useDeleteMovie } from "../api/delete-movie";
import { Button } from "@/components/ui/button";

export const DeleteMovie = ({ movieId }: { movieId: string }) => {
  const deleteMovie = useDeleteMovie({
    mutationConfig: {
      onSuccess: () => {
        //TODO: add toast
      },
    },
  });

  return (
    <Authorization allowedRoles={[ROLES.ADMIN]}>
      <ConfirmationDialog
        icon="danger"
        title="Delete movie"
        body="Are you sure you want to delete this movie?"
        triggerButton={
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        }
        confirmButton={
          <SubmitButton
            isPending={deleteMovie.isPending}
            type={SubmitButtonType.DELETE}
            variant={"destructive"}
            onClick={() => deleteMovie.mutate({ movieId })}
          >
            Delete
          </SubmitButton>
        }
      ></ConfirmationDialog>
    </Authorization>
  );
};
