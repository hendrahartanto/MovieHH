import React, { useState } from "react";
import { Link } from "react-router";
import {
  Film,
  MapPin,
  Home,
  User,
  PanelLeftOpen,
  PanelLeftClose,
  LogOut,
  Tags,
  Map,
  Calendar,
  Globe,
  QrCode,
  Receipt,
} from "lucide-react";
import { paths } from "@/config/paths";
import { useUser } from "@/lib/auth";
import { ConfirmLogout } from "@/features/auth/components/confirm-logout";

interface SidebarItem {
  name: string;
  to: string;
  icon: React.ReactNode;
}

export const SidebarLayout = ({ children }: { children: React.ReactNode }) => {
  const user = useUser();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sidebarItems: SidebarItem[] = [
    {
      name: "Dashboard",
      to: paths.admin.dashboard.getHref(),
      icon: <Home className="w-5 h-5" />,
    },
    {
      name: "Movies",
      to: paths.admin.movies.getHref(),
      icon: <Film className="w-5 h-5" />,
    },
    {
      name: "Genres",
      to: paths.admin.genres.getHref(),
      icon: <Tags className="w-5 h-5" />,
    },
    {
      name: "Locations",
      to: paths.admin.locations.getHref(),
      icon: <Map className="w-5 h-5" />,
    },
    {
      name: "Theaters",
      to: paths.admin.theaters.getHref(),
      icon: <MapPin className="w-5 h-5" />,
    },
    {
      name: "Movie Schedules",
      to: paths.admin.movieSchedules.getHref(),
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      name: "Reservations",
      to: paths.admin.reservations.getHref(),
      icon: <Receipt className="w-5 h-5" />,
    },
    {
      name: "Check-in Scanner",
      to: paths.admin.checkIn.getHref(),
      icon: <QrCode className="w-5 h-5" />,
    },
    {
      name: "User Portal",
      to: paths.home.getHref(),
      icon: <Globe className="w-5 h-5" />,
    },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <div className="flex min-h-screen bg-background">
        <div
          className={`${
            isCollapsed ? "w-20" : "w-64"
          } h-screen bg-card border-r border-border flex flex-col shadow-lg transition-all duration-300 ease-in-out`}
        >
          <div
            className={`${
              isCollapsed ? "p-4" : "p-6 pr-3"
            } border-b border-border`}
          >
            <div className="flex items-center justify-between">
              <div
                className={`flex items-center ${
                  isCollapsed ? "justify-center w-full" : "gap-3"
                }`}
              >
                {!isCollapsed && (
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl font-bold text-foreground">
                      MovieHH
                    </h2>
                  </div>
                )}
              </div>
              {!isCollapsed && (
                <button
                  onClick={toggleSidebar}
                  className="p-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors duration-200 shrink-0"
                  aria-label="Collapse sidebar"
                >
                  <PanelLeftClose className="w-5 h-5" />
                </button>
              )}
            </div>
            {!isCollapsed && (
              <p className="text-sm text-muted-foreground mt-1">
                Cinema & Entertainment
              </p>
            )}
            {isCollapsed && (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={toggleSidebar}
                  className="p-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
                  aria-label="Expand sidebar"
                >
                  <PanelLeftOpen className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          <nav className="flex-1 p-4 flex flex-col min-h-0">
            <ul className="space-y-1 flex-1 overflow-y-auto">
              {sidebarItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.to}
                    className={`flex items-center ${
                      isCollapsed ? "justify-center px-0" : "gap-3 px-4"
                    } py-3 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200 group relative overflow-hidden`}
                  >
                    <div
                      className={`relative z-10 flex items-center ${
                        isCollapsed ? "justify-center" : "gap-3 w-full"
                      }`}
                    >
                      <div className="transition-transform duration-200 group-hover:scale-110">
                        {item.icon}
                      </div>
                      {!isCollapsed && (
                        <span className="font-medium">{item.name}</span>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-linear-to-r from-orange-500/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg" />
                  </Link>
                </li>
              ))}
            </ul>

            <div className="my-6 border-t border-border" />

            <div
              className={`${
                isCollapsed
                  ? "flex item-center justify-center py-2 px-0"
                  : "px-4 py-3"
              } rounded-lg bg-muted/50 border border-border`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      Welcome back!
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.data?.name}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {!isCollapsed && (
              <div className="mt-3">
                <ConfirmLogout
                  triggerButton={
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200 group relative overflow-hidden border border-transparent hover:border-destructive/20">
                      <div className="relative z-10 flex items-center gap-3 w-full">
                        <div className="transition-transform duration-200 group-hover:scale-110">
                          <LogOut className="w-5 h-5" />
                        </div>
                        <span className="font-medium">Logout</span>
                      </div>
                      <div className="absolute inset-0 bg-linear-to-r from-destructive/5 to-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg" />
                    </button>
                  }
                />
              </div>
            )}

            {isCollapsed && (
              <div className="mt-3 flex justify-center">
                <ConfirmLogout
                  triggerButton={
                    <button
                      className="p-3 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200 group border border-transparent hover:border-destructive/20"
                      aria-label="Logout"
                    >
                      <LogOut className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                    </button>
                  }
                />
              </div>
            )}
          </nav>

          <div
            className={`${isCollapsed ? "p-2" : "p-4"} border-t border-border`}
          >
            {isCollapsed ? (
              <div className="flex justify-center">
                <div className="cinema-gradient w-6 h-1" />
              </div>
            ) : (
              <>
                <div className="text-xs text-muted-foreground text-center">
                  © 2025 MovieHH
                </div>
                <div className="mt-2 h-1 cinema-gradient" />
              </>
            )}
          </div>
        </div>

        <div className="flex-1 bg-background h-screen">
          <div className="max-h-full overflow-auto px-10">{children}</div>
        </div>
      </div>
    </>
  );
};
