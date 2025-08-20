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
    bg: "bg-blue-500/10 border-blue-500/20",
    icon: "text-blue-400",
    title: "text-blue-300",
    message: "text-blue-200/80",
    progress: "bg-blue-500",
  },
  success: {
    bg: "bg-green-500/10 border-green-500/20",
    icon: "text-green-400",
    title: "text-green-300",
    message: "text-green-200/80",
    progress: "bg-green-500",
  },
  warning: {
    bg: "bg-yellow-500/10 border-yellow-500/20",
    icon: "text-yellow-400",
    title: "text-yellow-300",
    message: "text-yellow-200/80",
    progress: "bg-yellow-500",
  },
  error: {
    bg: "bg-red-500/10 border-red-500/20",
    icon: "text-red-400",
    title: "text-red-300",
    message: "text-red-200/80",
    progress: "bg-red-500",
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
          bg-orange-950/80 border border-orange-900/30
          rounded-lg shadow-xl ring-1 ring-black/5
          w-full max-w-sm
          ${style.bg}
        `}
        role="alert"
        aria-label={title}
      >
        {!persistent && duration > 0 && (
          <div className="absolute bottom-0 left-0 h-1 bg-orange-900/30 w-full">
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
                text-orange-400/60 hover:text-orange-200
                hover:bg-orange-900/30
                focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-orange-950
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
