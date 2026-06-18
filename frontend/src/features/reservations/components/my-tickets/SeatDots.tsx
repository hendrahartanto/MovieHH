export interface SeatDotsProps {
  count: number;
}

export const SeatDots = ({ count }: SeatDotsProps) => {
  const visible = Math.min(count, 8);
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: visible }).map((_, i) => (
        <div
          key={i}
          className="w-2.5 h-2.5 rounded-sm bg-primary/70 border border-primary/40"
        />
      ))}
      {count > 8 && (
        <span className="text-xs text-muted-foreground ml-0.5">
          +{count - 8}
        </span>
      )}
    </div>
  );
};
