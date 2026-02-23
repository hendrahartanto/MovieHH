import { format, isSameDay } from "date-fns";

interface DateTabProps {
  date: Date;
  isSelected: boolean;
  hasSchedule: boolean;
  onClick: () => void;
}

export const DateTab = ({ date, isSelected, hasSchedule, onClick }: DateTabProps) => {
  const isToday = isSameDay(date, new Date());

  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center px-4 py-3 rounded-xl border text-sm transition-all duration-200 min-w-[72px] shrink-0 ${isSelected
        ? "cinema-gradient border-transparent text-white shadow-lg cinema-glow"
        : hasSchedule
          ? "border-border bg-card hover:border-primary/60 hover:bg-accent/20 text-foreground cursor-pointer"
          : "border-border/40 bg-card/40 text-muted-foreground/40 cursor-default"
        }`}
    >
      <span className="text-xs font-medium uppercase tracking-wider opacity-80">
        {isToday ? "Today" : format(date, "EEE",)}
      </span>
      <span className="text-xl font-bold leading-tight tabular-nums">
        {format(date, "dd")}
      </span>
      <span className="text-xs opacity-70">
        {format(date, "MMM")}
      </span>
      {hasSchedule && !isSelected && (
        <span className="absolute bottom-1.5 w-1 h-1 rounded-full bg-primary" />
      )}
    </button>
  );
}
