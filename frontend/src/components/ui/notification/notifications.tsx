import { NotificationComponent } from "./notification";
import { useNotifications } from "./notification-store";

export const NotificationsContainer = () => {
  const { notifications, dismissNotification } = useNotifications();

  if (notifications.length === 0) return null;

  return (
    <div
      aria-live="assertive"
      className="
        pointer-events-none fixed inset-0 z-100
        flex flex-col items-end justify-start
        p-4 sm:p-6 gap-3
        overflow-hidden
      "
    >
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          className="pointer-events-auto"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <NotificationComponent
            notification={notification}
            onDismiss={dismissNotification}
          />
        </div>
      ))}
    </div>
  );
};
