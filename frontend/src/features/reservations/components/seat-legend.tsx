export const SeatLegend = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-8">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-t-md rounded-b-sm bg-muted border border-border" />
        <span className="text-sm text-muted-foreground">Available</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-t-md rounded-b-sm bg-primary border-primary cinema-glow" />
        <span className="text-sm text-muted-foreground">Selected</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-t-md rounded-b-sm bg-yellow-500/20 border border-yellow-500/50 opacity-50 cursor-not-allowed" />
        <span className="text-sm text-muted-foreground">Hold</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-t-md rounded-b-sm bg-primary/20 border border-primary/50 opacity-50 cursor-not-allowed" />
        <span className="text-sm text-muted-foreground">Sold</span>
      </div>
    </div>
  );
};
