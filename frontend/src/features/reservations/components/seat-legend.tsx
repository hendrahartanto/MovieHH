export const SeatLegend = () => {
  return (
    <div className="flex items-center justify-center gap-6 mt-8">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-t-md rounded-b-sm bg-muted border border-border" />
        <span className="text-sm text-muted-foreground">Available</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-t-md rounded-b-sm cinema-gradient border-transparent" />
        <span className="text-sm text-muted-foreground">Selected</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-t-md rounded-b-sm bg-destructive/20 border-destructive/50 opacity-50 cursor-not-allowed" />
        <span className="text-sm text-muted-foreground">Sold</span>
      </div>
    </div>
  );
};
