import { ConfirmationDialog } from "@/components/ui/confirmation-modal";
import {
  SubmitButton,
  SubmitButtonType,
} from "@/components/ui/form/submit-button";
import { Authorization, ROLES } from "@/lib/authorization";
import { Button } from "@/components/ui/button";
import { useDeleteShowTime } from "../api/delete-show-time";
import { useNotifications } from "@/components/ui/notification/notification-store";
import { MinusCircle } from "lucide-react";

export const DeleteShowTime = ({ showTimeId }: { showTimeId: string }) => {
  const deleteShowTime = useDeleteShowTime({
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
        title="Delete showtime"
        body="Are you sure you want to delete this showtime?"
        triggerButton={
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-destructive hover:text-destructive rounded-full"
          >
            <MinusCircle className="h-4 w-4" />
          </Button>
        }
        confirmButton={
          <SubmitButton
            isPending={deleteShowTime.isPending}
            type={SubmitButtonType.DELETE}
            variant={"destructive"}
            onClick={() => deleteShowTime.mutate({ showTimeId })}
          >
            Delete
          </SubmitButton>
        }
      />
    </Authorization>
  );
};
