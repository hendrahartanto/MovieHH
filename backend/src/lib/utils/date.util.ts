export const updateDateOnly = (original: Date, newDate: Date): Date => {
  const updated = new Date(newDate);
  updated.setHours(original.getHours());
  updated.setMinutes(original.getMinutes());
  updated.setSeconds(original.getSeconds());
  updated.setMilliseconds(original.getMilliseconds());
  return updated;
};

export const combineDateAndTime = (date: Date, time: string): Date => {
  const [hours, minutes] = time.split(":").map(Number);
  const combined = new Date(date);
  combined.setHours(hours, minutes, 0, 0);
  return combined;
};
