const LEGEND_ITEMS = [
  {
    label: "Available",
    className: "bg-muted/60 border-border text-muted-foreground",
  },
  {
    label: "Selected",
    className: "bg-primary border-primary cinema-glow",
  },
  {
    label: "Reserved",
    className: "bg-primary/10 border-primary/30 text-primary/40",
  },
  {
    label: "On Hold",
    className: "bg-amber-500/15 border-amber-500/40 text-amber-500/60",
  },
];

export const SeatLegend = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
      {LEGEND_ITEMS.map(({ label, className }) => (
        <div key={label} className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-t-md rounded-b-sm border shrink-0 ${className}`}
          />
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
      ))}
    </div>
  );
};
