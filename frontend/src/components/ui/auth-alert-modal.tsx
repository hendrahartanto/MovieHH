import { Link, useLocation } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { paths } from "@/config/paths";
import { LogIn, UserPlus } from "lucide-react";

interface AuthAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthAlertModal = ({ isOpen, onClose }: AuthAlertModalProps) => {
  const location = useLocation();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Authentication Required
          </DialogTitle>
          <DialogDescription className="text-muted-foreground mt-2">
            You need to be logged in to select seats and make a reservation.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-6">
          <Button
            asChild
            variant="glow"
            className="w-full"
          >
            <Link to={paths.auth.login.getHref(location.pathname)}>
              <LogIn className="w-4 h-4 mr-2" />
              Log In
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link to={paths.auth.register.getHref(location.pathname)}>
              <UserPlus className="w-4 h-4 mr-2" />
              Sign Up
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
