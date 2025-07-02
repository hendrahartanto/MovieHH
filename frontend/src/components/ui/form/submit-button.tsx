import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "../button";
import { VariantProps } from "class-variance-authority";

export enum SubmitButtonType {
  CREATE,
  UPDATE,
  DELETE,
  LOGIN,
  REGISTER,
  LOGOUT,
}

interface SubmitButtonProps {
  children: React.ReactNode;
  isPending: boolean;
  type: SubmitButtonType;
  className?: string;
  form?: string;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  onClick?: () => void;
}

export const SubmitButton = ({
  isPending,
  type,
  className,
  form,
  children,
  variant = "default",
  onClick,
}: SubmitButtonProps) => {
  const loadingText: Record<SubmitButtonType, string> = {
    [SubmitButtonType.CREATE]: "Creating...",
    [SubmitButtonType.UPDATE]: "Updating...",
    [SubmitButtonType.DELETE]: "Deleting...",
    [SubmitButtonType.LOGIN]: "Logging in...",
    [SubmitButtonType.REGISTER]: "Registering...",
    [SubmitButtonType.LOGOUT]: "Logging out...",
  };

  return (
    <Button
      form={form}
      type="submit"
      disabled={isPending}
      className={cn("flex items-center", className)}
      variant={variant}
      onClick={onClick}
    >
      {isPending ? (
        <>
          <div
            className={cn(
              "w-4 h-4 border-2 rounded-full animate-spin mr-2",
              type === SubmitButtonType.LOGOUT
                ? "border-destructive-foreground/30 border-t-destructive-foreground"
                : "border-primary-foreground/30 border-t-primary-foreground"
            )}
          />
          {loadingText[type]}
        </>
      ) : (
        <>{children}</>
      )}
    </Button>
  );
};
