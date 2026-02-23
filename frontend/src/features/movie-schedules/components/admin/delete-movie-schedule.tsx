import { ConfirmationDialog } from "@/components/ui/confirmation-modal";
import {
  SubmitButton,
  SubmitButtonType,
} from "@/components/ui/form/submit-button";
import { Authorization, ROLES } from "@/lib/authorization";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/components/ui/notification/notification-store";
import { useDeleteMovieSchedule } from "@/features/movie-schedules/api/delete-movie-schedule";

export const DeleteMovieSchedule = ({
  movieScheduleId,
}: {
  movieScheduleId: string;
}) => {
  const deleteGenre = useDeleteMovieSchedule({
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
        title="Delete movie schedule"
        body="Are you sure you want to delete this movie schedule?"
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
            onClick={() => deleteGenre.mutate({ movieScheduleId })}
          >
            Delete
          </SubmitButton>
        }
      ></ConfirmationDialog>
    </Authorization>
  );
};
