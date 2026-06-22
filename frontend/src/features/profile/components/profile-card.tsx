import {
  useActiveReservations,
  useTransactionHistory,
} from "@/features/reservations/api";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { paths } from "@/config/paths";
import {
  Ticket,
  Calendar,
  Shield,
  ArrowRight,
  CheckCircle2,
  Clock3,
} from "lucide-react";
import { User } from "@/lib/api";

const Section = ({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="rounded-xl border border-border/40 bg-card/60 backdrop-blur-md shadow-sm overflow-hidden">
      <div className="flex items-start gap-3 px-6 py-5 border-b border-border/40 bg-muted/20">
        <div className="shrink-0 w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="font-semibold text-foreground leading-tight">{title}</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
};

const StatPill = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-1 py-4 rounded-lg bg-muted/30 border border-border/40">
      <Icon className="w-4 h-4 text-primary mb-1" />
      <span className="text-2xl font-extrabold text-foreground leading-none">
        {value}
      </span>
      <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </span>
    </div>
  );
};

interface ProfileCardProps {
  user: User;
}

export const ProfileCard = ({ user }: ProfileCardProps) => {
  const activeReservationsQuery = useActiveReservations({ page: 1, limit: 1 });
  const transactionHistoryQuery = useTransactionHistory({ page: 1, limit: 1 });

  const activeCount =
    activeReservationsQuery.data?.data?.pagination?.total || 0;
  const historyCount =
    transactionHistoryQuery.data?.data?.pagination?.total || 0;

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border/40 bg-card/60 backdrop-blur-md shadow-sm overflow-hidden">
        <div className="relative h-24 bg-linear-to-br from-primary/30 via-primary/10 to-transparent">
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
            <Avatar
              name={user.name}
              size="xl"
              className="ring-4 ring-card shadow-xl"
            />
          </div>
        </div>

        <div className="pt-14 pb-6 px-6 text-center space-y-2">
          <h2 className="text-lg font-bold text-foreground truncate">
            {user.name}
          </h2>
          <p className="text-sm text-muted-foreground truncate">
            {user.email}
          </p>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <Shield className="w-3 h-3" />
            {user.role}
          </div>
        </div>

        <div className="border-t border-border/40 mx-6" />

        <div className="px-6 py-4 flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
          <span>
            Joined{" "}
            {new Date(user.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      <Section
        icon={Ticket}
        title="Booking Overview"
        description="Your reservation activity at a glance"
      >
        <div className="grid grid-cols-2 gap-3 mb-4">
          <StatPill
            icon={CheckCircle2}
            label="Active"
            value={activeCount}
          />
          <StatPill icon={Clock3} label="Total" value={historyCount} />
        </div>
        <Link to={paths.myTickets.getHref()}>
          <Button
            variant="outline"
            className="w-full justify-between group"
          >
            <span>View all tickets</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </Section>
    </div>
  );
};
