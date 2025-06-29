import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { paths } from "@/config/paths";
import { useLogout } from "@/lib/auth";
import { AlertTriangle, LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";

interface ConfirmLogoutInterface {
  triggerButton: React.ReactElement;
}

export const ConfirmLogout = ({ triggerButton }: ConfirmLogoutInterface) => {
  const navigate = useNavigate();
  const [isClose, setIsClose] = useState(false);

  const logout = useLogout({
    onSuccess: () => {
      navigate(paths.auth.login.getHref(location.pathname));
    },
  });

  useEffect(() => {
    if (isClose) {
      setIsClose(false);
    }
  }, [isClose]);

  const handleLogoutConfirm = () => {
    logout.mutate({});
  };

  return (
    <Modal
      title="Confirm logout"
      triggerButton={triggerButton}
      isDone={logout.isSuccess || isClose}
    >
      <div className="space-y-4">
        <Alert
          variant="destructive"
          className="bg-destructive/5 border-destructive/20"
        >
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="space-y-1">
            <p className="font-medium text-foreground">
              Are you sure you want to logout?
            </p>
            <p className="text-xs text-muted-foreground">
              You will be redirected to the login page and will need to sign in
              again.
            </p>
          </AlertDescription>
        </Alert>

        <div className="flex gap-3 justify-end pt-2">
          <Button
            variant="outline"
            onClick={() => {
              setIsClose(true);
            }}
            disabled={logout.isPending}
            className="text-muted-foreground hover:text-foreground"
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={handleLogoutConfirm}
            disabled={logout.isPending}
            className="flex items-center gap-2"
          >
            {logout.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-destructive-foreground/30 border-t-destructive-foreground rounded-full animate-spin" />
                Logging out...
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4" />
                Logout
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
