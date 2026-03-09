import { ApiResponse } from "@/lib/api";
import { PaymentToken } from "../types";
import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

export const createReservationPaymentSchema = z.object({
  reservationId: z.string().uuid("Invalid reservation id format"),
});

export type CreateReservationPaymentInput = z.infer<
  typeof createReservationPaymentSchema
>;

export const createReservationPayment = (
  data: CreateReservationPaymentInput
): Promise<ApiResponse<PaymentToken>> => {
  return api.post("/reservations/payment", data);
};

type UseCreateReservationPaymentOptions = {
  mutationConfig?: MutationConfig<typeof createReservationPayment>;
};

export const useCreateReservationPayment = ({
  mutationConfig,
}: UseCreateReservationPaymentOptions = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createReservationPayment,
  });
};