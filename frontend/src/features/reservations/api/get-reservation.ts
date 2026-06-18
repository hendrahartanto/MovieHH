import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { ActiveReservation, PaymentToken } from "../types";

export type PopulatedReservation = ActiveReservation & {
  payment: PaymentToken | null;
  showTime: ActiveReservation["showTime"] & {
    movieSchedule: ActiveReservation["showTime"]["movieSchedule"] & {
      movie: {
        title: string;
        posterUrl?: string | null;
      };
      theater: {
        name: string;
      };
    };
  };
};

export const getReservation = (reservationId: string): Promise<{ data: { reservation: PopulatedReservation } }> => {
  return api.get(`/reservations/${reservationId}`);
};

export const getReservationQueryOptions = (reservationId: string) => {
  return {
    queryKey: ["reservation", reservationId],
    queryFn: () => getReservation(reservationId),
  } satisfies UseQueryOptions;
};

type UseReservationOptions = {
  reservationId: string;
  queryConfig?: QueryConfig<typeof getReservationQueryOptions>;
};

export const useReservation = ({
  reservationId,
  queryConfig,
}: UseReservationOptions) => {
  return useQuery({
    ...getReservationQueryOptions(reservationId),
    ...queryConfig,
  });
};