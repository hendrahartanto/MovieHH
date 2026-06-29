export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  isSuspended: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    reservations: number;
  };
};
