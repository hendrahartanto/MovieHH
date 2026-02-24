import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { Theater } from "@/lib/api";

export const getTheater = ({ theaterId }: { theaterId: string }) => {
  return api.get<{ theater: Theater }>(`/theaters/${theaterId}`);
};

export const useTheater = ({ theaterId }: { theaterId: string }) => {
  return useQuery({
    queryKey: ["theater", theaterId],
    queryFn: () => getTheater({ theaterId }),
  });
};
