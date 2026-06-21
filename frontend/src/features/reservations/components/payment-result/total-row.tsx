interface TotalRowProps {
  formattedPrice: string;
}

export const TotalRow = ({ formattedPrice }: TotalRowProps) => (
  <div className="flex items-center justify-between py-4 px-5 bg-primary/5 border border-primary/15 rounded-xl">
    <span className="text-sm font-medium text-muted-foreground">
      Total Charged
    </span>
    <span className="text-xl font-bold text-primary tabular-nums">
      {formattedPrice}
    </span>
  </div>
);
