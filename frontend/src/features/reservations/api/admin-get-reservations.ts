import { ApiResponse } from "@/lib/api";
import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { ActiveReservation } from "../types";

export type AdminReservation = ActiveReservation & {
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  };
  payment: {
    id: string;
    reservationId: string;
    token: string;
    redirectUrl: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type PaginatedAdminReservations = {
  reservations: AdminReservation[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export const getAdminReservations = ({
  page = 1,
  limit = 10,
  search = "",
  status = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
} = {}): Promise<ApiResponse<PaginatedAdminReservations>> => {
  return api.get("/reservations/admin", {
    params: { page, limit, search, status: status || undefined },
  });
};

export const getAdminReservationsQueryOptions = ({
  page = 1,
  limit = 10,
  search = "",
  status = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
} = {}) => {
  return queryOptions({
    queryKey: ["admin-reservations", { page, limit, search, status }],
    queryFn: () => getAdminReservations({ page, limit, search, status }),
  });
};

type UseAdminReservationsOptions = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  queryConfig?: QueryConfig<typeof getAdminReservationsQueryOptions>;
};

export const useAdminReservations = ({
  page,
  limit,
  search,
  status,
  queryConfig,
}: UseAdminReservationsOptions = {}) => {
  return useQuery({
    ...getAdminReservationsQueryOptions({ page, limit, search, status }),
    ...queryConfig,
  });
};

export const getAdminReservation = (
  reservationId: string
): Promise<ApiResponse<{ reservation: AdminReservation }>> => {
  return api.get(`/reservations/admin/${reservationId}`);
};

export const getAdminReservationQueryOptions = (reservationId: string) => {
  return queryOptions({
    queryKey: ["admin-reservations", "detail", reservationId],
    queryFn: () => getAdminReservation(reservationId),
  });
};

type UseAdminReservationOptions = {
  reservationId: string;
  queryConfig?: QueryConfig<typeof getAdminReservationQueryOptions>;
};

export const useAdminReservation = ({
  reservationId,
  queryConfig,
}: UseAdminReservationOptions) => {
  return useQuery({
    ...getAdminReservationQueryOptions(reservationId),
    ...queryConfig,
    enabled: !!reservationId,
  });
};
