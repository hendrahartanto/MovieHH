import { JSX, useEffect, useState } from "react";
import { Info, AlertTriangle, X, CheckCircle } from "lucide-react";
import { Notification, NotificationType } from "./notification-store";

interface NotificationProps {
  notification: Notification;
  onDismiss: (id: string) => void;
}

const icons: Record<NotificationType, JSX.Element> = {
  info: <Info className="size-5" aria-hidden="true" />,
  success: <CheckCircle className="size-5" aria-hidden="true" />,
  warning: <AlertTriangle className="size-5" aria-hidden="true" />,
  error: <X className="size-5" aria-hidden="true" />,
};

const typeStyles: Record<
  NotificationType,
  {
    bg: string;
    icon: string;
    title: string;
    message: string;
    progress: string;
  }
> = {
  info: {
    bg: "bg-card border-border",
    icon: "text-primary",
    title: "text-foreground",
    message: "text-muted-foreground",
    progress: "bg-primary",
  },
  success: {
    bg: "bg-card border-border",
    icon: "text-green-500",
    title: "text-foreground",
    message: "text-muted-foreground",
    progress: "bg-green-500",
  },
  warning: {
    bg: "bg-card border-border",
    icon: "text-yellow-500",
    title: "text-foreground",
    message: "text-muted-foreground",
    progress: "bg-yellow-500",
  },
  error: {
    bg: "bg-card border-border",
    icon: "text-destructive",
    title: "text-destructive",
    message: "text-muted-foreground",
    progress: "bg-destructive",
  },
};

export const NotificationComponent = ({
  notification: {
    id,
    type,
    title,
    message,
    duration = 5000,
    persistent = false,
  },
  onDismiss,
}: NotificationProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const showTimer = setTimeout(() => setIsVisible(true), 50);

    if (!persistent && duration > 0) {
      const progressTimer = setInterval(() => {
        setProgress((prev) => {
          if (prev <= 0) {
            clearInterval(progressTimer);
            return 0;
          }
          return prev - 100 / (duration / 100);
        });
      }, 100);

      const dismissTimer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onDismiss(id), 300);
      }, duration);

      return () => {
        clearTimeout(showTimer);
        clearTimeout(dismissTimer);
        clearInterval(progressTimer);
      };
    }

    return () => clearTimeout(showTimer);
  }, [id, onDismiss, duration, persistent]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => onDismiss(id), 300);
  };

  const style = typeStyles[type];

  return (
    <div
      className={`
        transform transition-all duration-300 ease-in-out
        ${
          isVisible
            ? "translate-x-0 opacity-100"
            : "translate-x-[120%] opacity-0"
        }
      `}
    >
      <div
        className={`
          relative overflow-hidden backdrop-blur-md
          rounded-lg shadow-xl ring-1 ring-black/5
          w-full max-w-sm
          border
          ${style.bg}
        `}
        role="alert"
        aria-label={title}
      >
        {!persistent && duration > 0 && (
          <div className="absolute bottom-0 left-0 h-1 w-full bg-border">
            <div
              className={`h-full transition-all duration-100 ease-linear ${style.progress}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className={`shrink-0 ${style.icon}`}>{icons[type]}</div>

            <div className="flex-1 min-w-0">
              <h4 className={`text-sm font-semibold ${style.title}`}>
                {title}
              </h4>
              {message && (
                <p className={`mt-1 text-sm ${style.message} leading-relaxed`}>
                  {message}
                </p>
              )}
            </div>

            <button
              onClick={handleDismiss}
              className="
                shrink-0 p-1 rounded-md
                text-muted-foreground hover:text-foreground
                hover:bg-muted
                focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background
                transition-colors duration-200
              "
              aria-label="Close notification"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
