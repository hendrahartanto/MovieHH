import { type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

export type ModalType = "create" | "delete" | "update" | null;

interface Props {
  title?: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Modal = ({ isOpen, onClose, children, title }: Props) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
