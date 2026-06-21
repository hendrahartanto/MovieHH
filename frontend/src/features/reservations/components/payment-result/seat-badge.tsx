interface SeatBadgeProps {
  label: string;
}

export const SeatBadge = ({ label }: SeatBadgeProps) => (
  <span className="inline-flex items-center justify-center px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-md text-xs font-mono font-semibold tracking-wide">
    {label}
  </span>
);
