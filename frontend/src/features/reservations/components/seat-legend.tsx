export const SeatLegend = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 mt-12 border-t border-border/50 pt-8">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-t-lg rounded-b-sm bg-muted border border-border" />
        <span className="text-sm font-medium text-muted-foreground">Available</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-t-lg rounded-b-sm cinema-gradient border border-primary/50 shadow-[0_0_10px_rgba(255,0,0,0.5)]" />
        <span className="text-sm font-medium text-foreground">Selected</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-t-lg rounded-b-sm bg-primary/20 border border-primary/50 opacity-50" />
        <span className="text-sm font-medium text-muted-foreground">Reserved</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-t-lg rounded-b-sm bg-yellow-500/20 border border-yellow-500/50" />
        <span className="text-sm font-medium text-muted-foreground">Hold</span>
      </div>
    </div>
  );
};
