import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { paths } from "@/config/paths";
import { Scan, Plus, Film, ChevronRight } from "lucide-react";

const actions = [
  {
    label: "Open Ticket Scanner",
    description: "Scan & validate gate entry",
    icon: Scan,
    href: (p: typeof paths) => p.admin.checkIn.getHref(),
    primary: true,
  },
  {
    label: "Schedule Showtime",
    description: "Add a new movie showtime",
    icon: Plus,
    href: (p: typeof paths) => p.admin.movieSchedules.getHref(),
    primary: false,
  },
  {
    label: "Manage Movies",
    description: "Edit the movie catalog",
    icon: Film,
    href: (p: typeof paths) => p.admin.movies.getHref(),
    primary: false,
  },
];

export const QuickActions = () => {
  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-4 border-b border-border/50 px-6 pt-5">
        <CardTitle className="text-base font-semibold leading-none">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        {actions.map(({ label, description, icon: Icon, href, primary }) =>
          primary ? (
            <Button
              key={label}
              className="w-full justify-between gap-2 h-auto py-3 px-4"
              variant="glow"
              asChild
            >
              <Link to={href(paths)}>
                <span className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="text-left">
                    <span className="block text-sm font-semibold leading-tight">
                      {label}
                    </span>
                    <span className="block text-[11px] font-normal opacity-80 mt-0.5">
                      {description}
                    </span>
                  </span>
                </span>
                <ChevronRight className="w-4 h-4 opacity-70 shrink-0" />
              </Link>
            </Button>
          ) : (
            <Button
              key={label}
              className="w-full justify-between gap-2 h-auto py-3 px-4 group"
              variant="outline"
              asChild
            >
              <Link to={href(paths)}>
                <span className="flex items-center gap-2.5">
                  <span className="p-1 rounded-md bg-primary/10 shrink-0">
                    <Icon className="w-3.5 h-3.5 text-primary" />
                  </span>
                  <span className="text-left">
                    <span className="block text-sm font-semibold leading-tight">
                      {label}
                    </span>
                    <span className="block text-[11px] font-normal text-muted-foreground mt-0.5">
                      {description}
                    </span>
                  </span>
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-muted-foreground/70 transition-colors shrink-0" />
              </Link>
            </Button>
          ),
        )}
      </CardContent>
    </Card>
  );
};
