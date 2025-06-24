import { paths } from "@/config/paths";
import { useLogout } from "@/lib/auth";
import { AlertTriangle, LogOut } from "lucide-react";
import { useNavigate } from "react-router";

interface ConfirmLogoutInterface {
  onCancel: () => void;
}

export const ConfirmLogout = ({ onCancel }: ConfirmLogoutInterface) => {
  const navigate = useNavigate();
  const logout = useLogout({
    onSuccess: () => {
      onCancel();
      navigate(paths.auth.login.getHref(location.pathname));
    },
  });
  const handleLogoutConfirm = () => {
    logout.mutate({});
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
        <div className="flex-shrink-0">
          <AlertTriangle className="w-5 h-5 text-destructive" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">
            Are you sure you want to logout?
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            You will be redirected to the login page and will need to sign in
            again.
          </p>
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-2">
        <button
          onClick={onCancel}
          disabled={logout.isPending}
          className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground bg-secondary hover:bg-secondary/80 border border-border rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          onClick={handleLogoutConfirm}
          disabled={logout.isPending}
          className="px-4 py-2 text-sm font-medium text-destructive-foreground bg-destructive hover:bg-destructive/90 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
        </button>
      </div>
    </div>
  );
};
