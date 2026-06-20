import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBookingId(id: string) {
  if (!id) return "";
  return id.split("-")[0].toUpperCase();
}
