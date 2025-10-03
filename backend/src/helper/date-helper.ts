export const updateDateOnly = (original: Date, newDate: Date): Date => {
  const updated = new Date(newDate);
  updated.setHours(original.getHours());
  updated.setMinutes(original.getMinutes());
  updated.setSeconds(original.getSeconds());
  updated.setMilliseconds(original.getMilliseconds());
  return updated;
};
