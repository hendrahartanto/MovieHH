import { SidebarContentLayout } from "@/components/layouts/sidebar-content-layout";
import {
  useDashboardMetrics,
  useDashboardTodaySchedules,
  useDashboardRecentTransactions,
  useDashboardRecentCheckins,
  useDashboardPopularMovies,
} from "@/features/dashboard/api/get-dashboard-stats";
import { RefreshCw } from "lucide-react";
import { KpiCards } from "@/features/dashboard/components/kpi-cards";
import { TodayShowtimes } from "@/features/dashboard/components/today-showtimes";
import { RecentTransactions } from "@/features/dashboard/components/recent-transactions";
import { QuickActions } from "@/features/dashboard/components/quick-actions";
import { RecentCheckins } from "@/features/dashboard/components/recent-checkins";
import { PopularMovies } from "@/features/dashboard/components/popular-movies";
import { format } from "date-fns";

export const DashboardPage = () => {
  const metricsQuery = useDashboardMetrics();
  const schedulesQuery = useDashboardTodaySchedules();
  const transactionsQuery = useDashboardRecentTransactions();
  const checkinsQuery = useDashboardRecentCheckins({
    queryConfig: {
      refetchInterval: 10000,
    },
  });
  const popularQuery = useDashboardPopularMovies();

  const lastUpdated = metricsQuery.dataUpdatedAt
    ? format(new Date(metricsQuery.dataUpdatedAt), "h:mm:ss a")
    : null;

  return (
    <SidebarContentLayout
      title="Dashboard"
      subtitle="Real-time overview of theater operations and ticket sales."
      headerComponent={
        lastUpdated ? (
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium bg-muted/40 border border-border/50 px-2.5 py-1 rounded-full w-fit">
            <RefreshCw className="w-3 h-3 text-emerald-400 animate-spin [animation-duration:10s]" />
            Updated {lastUpdated}
          </div>
        ) : undefined
      }
    >
      <div className="space-y-6 pb-12">
        <KpiCards
          metrics={metricsQuery.data?.data}
          isLoading={metricsQuery.isLoading}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <TodayShowtimes
              todaySchedules={schedulesQuery.data?.data}
              isLoading={schedulesQuery.isLoading}
            />
            <RecentTransactions
              recentTransactions={transactionsQuery.data?.data}
              isLoading={transactionsQuery.isLoading}
            />
          </div>

          <div className="space-y-6">
            <QuickActions />
            <RecentCheckins
              recentCheckIns={checkinsQuery.data?.data}
              isLoading={checkinsQuery.isLoading}
            />
            <PopularMovies
              popularMovies={popularQuery.data?.data}
              isLoading={popularQuery.isLoading}
            />
          </div>
        </div>
      </div>
    </SidebarContentLayout>
  );
};

export default DashboardPage;
