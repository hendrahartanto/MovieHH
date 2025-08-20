import { nanoid } from "nanoid";
import { create } from "zustand";

export type NotificationType = "info" | "success" | "warning" | "error";
export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
};

type NotificationsStore = {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id">) => void;
  dismissNotification: (id: string) => void;
  clearAll: () => void;
};

export const useNotifications = create<NotificationsStore>((set) => ({
  notifications: [],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        {
          id: nanoid(),
          duration: 5000,
          persistent: false,
          ...notification,
        },
      ],
    })),
  dismissNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter(
        (notification) => notification.id !== id
      ),
    })),
  clearAll: () =>
    set(() => ({
      notifications: [],
    })),
}));
