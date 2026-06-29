import { ApiResponse, Pagination } from "@/lib/api";
import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { AdminUser } from "../types";

export type PaginatedAdminUsers = {
  users: AdminUser[];
  pagination: Pagination;
};

export const getAdminUsers = ({
  page = 1,
  limit = 10,
  search = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
} = {}): Promise<ApiResponse<PaginatedAdminUsers>> => {
  return api.get("/users/admin", {
    params: { page, limit, search },
  });
};

export const getAdminUsersQueryOptions = ({
  page = 1,
  limit = 10,
  search = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) => {
  return queryOptions({
    queryKey: ["admin-users", { page, limit, search }],
    queryFn: () => getAdminUsers({ page, limit, search }),
  });
};

type UseAdminUsersOptions = {
  page?: number;
  limit?: number;
  search?: string;
  queryConfig?: QueryConfig<typeof getAdminUsersQueryOptions>;
};

export const useAdminUsers = ({
  page,
  limit,
  search,
  queryConfig,
}: UseAdminUsersOptions = {}) => {
  return useQuery({
    ...getAdminUsersQueryOptions({ page, limit, search }),
    ...queryConfig,
  });
};
