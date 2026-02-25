import { Theater } from "@/features/theaters/types";

export type Location = {
  id: string;
  name: string;
  address: string;
  theaters: Theater[];
  createdAt: Date;
};
