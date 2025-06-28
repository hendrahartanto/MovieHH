import { useEffect, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDisclosure } from "@/hooks/user-disclosure";
import { DialogTrigger } from "@radix-ui/react-dialog";

export type ModalType = "create" | "delete" | "update" | null;

interface Props {
  title?: string;
  children: ReactNode;
  triggerButton: React.ReactElement;
  isDone: boolean;
}

export const Modal = ({ triggerButton, children, title, isDone }: Props) => {
  const { close, open, isOpen } = useDisclosure();

  useEffect(() => {
    if (isDone) {
      close();
    }
  }, [isDone, close]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          close();
        } else {
          open();
        }
      }}
    >
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        {title && (
          <DialogHeader>
            <DialogTitle className="text-foreground text-xl font-semibold">
              {title}
            </DialogTitle>
            <div className="mt-2 h-px bg-gradient-to-r from-primary/50 to-transparent" />
          </DialogHeader>
        )}
        <div className="text-card-foreground mt-4">{children}</div>
      </DialogContent>
    </Dialog>
  );
};
