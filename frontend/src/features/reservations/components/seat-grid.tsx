export const SeatGrid = () => {
  return (
    <div className="flex flex-col items-center gap-4 my-8">
      <div className="w-3/4 h-12 bg-primary/20 rounded-t-full flex items-center justify-center text-primary/50 text-sm font-semibold tracking-widest cinema-glow">
        SCREEN
      </div>
      <div className="grid grid-cols-10 gap-2 mt-8">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="w-8 h-8 rounded-t-lg rounded-b-sm bg-muted border border-border flex items-center justify-center text-xs text-muted-foreground hover:border-primary/50 cursor-pointer transition-colors"
          >
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
};
