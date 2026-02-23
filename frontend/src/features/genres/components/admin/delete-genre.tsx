import { ConfirmationDialog } from "@/components/ui/confirmation-modal";
import {
  SubmitButton,
  SubmitButtonType,
} from "@/components/ui/form/submit-button";
import { Authorization, ROLES } from "@/lib/authorization";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDeleteGenre } from "../../api/delete-genre";
import { useNotifications } from "@/components/ui/notification/notification-store";

export const DeleteGenre = ({ genreId }: { genreId: string }) => {
  const deleteGenre = useDeleteGenre({
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

  return (
    <Authorization allowedRoles={[ROLES.ADMIN]}>
      <ConfirmationDialog
        title="Delete genre"
        body="Are you sure you want to delete this genre?"
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
            isPending={deleteGenre.isPending}
            type={SubmitButtonType.DELETE}
            variant={"destructive"}
            onClick={() => deleteGenre.mutate({ genreId })}
          >
            Delete
          </SubmitButton>
        }
      ></ConfirmationDialog>
    </Authorization>
  );
};
