interface PageHeaderProps {
  activeCount: number;
}

export const PageHeader = ({ activeCount }: PageHeaderProps) => (
  <div className="flex items-end justify-between mb-8">
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-foreground">
        My Tickets
      </h2>
      <p className="text-muted-foreground">
        Manage your active reservations and view your booking history.
      </p>
    </div>
    {activeCount > 0 && (
      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 border border-border rounded-lg px-3 py-1.5">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 neon-pulse" />
        <span>
          {activeCount} active {activeCount === 1 ? "ticket" : "tickets"}
        </span>
      </div>
    )}
  </div>
);
