import { ApiResponse } from "@/lib/api";
import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type UpdateUserRoleInput = {
  userId: string;
  role: "USER" | "ADMIN";
};

export type ToggleSuspensionInput = {
  userId: string;
  isSuspended: boolean;
};

export const updateUserRoleAdmin = ({
  userId,
  role,
}: UpdateUserRoleInput): Promise<ApiResponse<any>> => {
  return api.put(`/users/admin/${userId}/role`, { role });
};

export const toggleUserSuspensionAdmin = ({
  userId,
  isSuspended,
}: ToggleSuspensionInput): Promise<ApiResponse<any>> => {
  return api.put(`/users/admin/${userId}/suspend`, { isSuspended });
};

type UseAdminUpdateUserRoleOptions = {
  mutationConfig?: MutationConfig<typeof updateUserRoleAdmin>;
};

export const useAdminUpdateUserRole = ({
  mutationConfig,
}: UseAdminUpdateUserRoleOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateUserRoleAdmin,
  });
};

type UseAdminToggleSuspensionOptions = {
  mutationConfig?: MutationConfig<typeof toggleUserSuspensionAdmin>;
};

export const useAdminToggleSuspension = ({
  mutationConfig,
}: UseAdminToggleSuspensionOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: toggleUserSuspensionAdmin,
  });
};
