import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { socket } from "@/lib/socket";
import { getAccessToken } from "@/lib/token-store";
import { getShowTimeSeatsQueryOptions } from "../api/get-show-time-seats";
import { ShowtimeSeat, SeatStatus } from "../types";
import { ApiResponse } from "@/lib/api";

type SeatUpdatePayload = {
  showTimeId: string;
  seatIds: string[];
  status: SeatStatus;
};

export const useShowTimeSeatsSocket = (
  showTimeId: string | undefined,
): void => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!showTimeId) return;

    if (!socket.connected) {
      socket.auth = { token: getAccessToken() };
      socket.connect();
    }

    socket.emit("join-showtime", showTimeId);

    const handleSeatsUpdated = (payload: SeatUpdatePayload) => {
      if (payload.showTimeId !== showTimeId) return;

      const queryKey = getShowTimeSeatsQueryOptions(showTimeId).queryKey;

      queryClient.setQueryData<ApiResponse<{ showTimeSeats: ShowtimeSeat[] }>>(
        queryKey,
        (oldData) => {
          if (!oldData) return oldData;

          const updatedSeats = oldData.data.showTimeSeats.map((seat) => {
            if (payload.seatIds.includes(seat.id)) {
              return { ...seat, status: payload.status };
            }
            return seat;
          });

          return {
            ...oldData,
            data: {
              ...oldData.data,
              showTimeSeats: updatedSeats,
            },
          };
        },
      );
    };

    socket.on("seats-updated", handleSeatsUpdated);

    return () => {
      socket.emit("leave-showtime", showTimeId);
      socket.off("seats-updated", handleSeatsUpdated);
      socket.disconnect();
    };
  }, [showTimeId, queryClient]);
};
