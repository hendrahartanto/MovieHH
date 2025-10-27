import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { useDisclosure } from "@/hooks/use-disclosure";
import { ScrollArea } from "../scroll-area";

type FormDrawerProps = {
  isDone: boolean;
  triggerButton: React.ReactElement;
  submitButton: React.ReactElement;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "default" | "lg" | "xl";
};

export const FormSheet = ({
  title,
  description,
  children,
  isDone,
  triggerButton,
  submitButton,
  size = "default",
}: FormDrawerProps) => {
  const { close, open, isOpen } = useDisclosure();

  React.useEffect(() => {
    if (isDone) {
      close();
    }
  }, [isDone, close]);

  const sizeClasses = {
    sm: "w-80",
    default: "w-96",
    lg: "w-[500px]",
    xl: "w-[600px]",
  };

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          close();
        } else {
          open();
        }
      }}
    >
      <SheetTrigger asChild>{triggerButton}</SheetTrigger>
      <SheetContent
        side="right"
        className={`${sizeClasses[size]} flex flex-col justify-between`} //TODO: styling scroll bar
      >
        <SheetHeader className="shrink-0">
          <SheetTitle className="text-foreground text-xl font-semibold">
            {title}
          </SheetTitle>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
          <div className="mt-2 h-px bg-gradient-to-r from-primary/50 to-transparent" />
        </SheetHeader>
        <ScrollArea className="flex-1 px-4 overflow-y-auto">
          {children}
        </ScrollArea>
        <SheetFooter className="shrink-0 border-t border-border pt-4">
          <div className="flex gap-3 justify-end w-full">
            <SheetClose asChild>
              <Button
                variant="outline"
                className="text-muted-foreground hover:text-foreground"
              >
                Cancel
              </Button>
            </SheetClose>
            {submitButton}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
