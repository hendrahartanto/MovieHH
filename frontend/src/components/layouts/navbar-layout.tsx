import React, { useState, useEffect } from "react";
import { useUser } from "@/lib/auth";
import { Link, useLocation } from "react-router";
import { paths } from "@/config/paths";
import { Button } from "../ui/button";
import { Avatar } from "../ui/avatar";
import { ConfirmLogout } from "@/features/auth/components/confirm-logout";
import moviehhLogo from "@/assets/moviehh_logo.png";
import { cn } from "@/lib/utils";
import { Footer } from "../ui/footer";
import { ShieldCheck } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { User as UserIcon, LogOut, Ticket } from "lucide-react";

interface NavbarItem {
  name: string;
  to: string;
}

export const NavbarLayout = ({ children }: { children: React.ReactNode }) => {
  const user = useUser();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { name: "Movies", to: paths.movies.getHref() },
    { name: "Cinemas", to: paths.cinemas.getHref() },
    ...(user.data
      ? [{ name: "My Tickets", to: paths.myTickets.getHref() }]
      : []),
  ] as NavbarItem[];

  return (
    <div className="flex flex-col min-h-screen">
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-background/95 backdrop-blur-md border-b border-border shadow-lg shadow-black/40"
            : "bg-linear-to-b from-background/90 via-background/40 to-transparent",
        )}
      >
        <div className="content-wrapper">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="group shrink-0">
              <img
                src={moviehhLogo}
                className="w-36 transition-opacity duration-200 group-hover:opacity-80"
                alt="MovieHH"
              />
            </Link>

            <nav className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "relative px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {isActive && (
                      <span className="absolute inset-0 rounded-md bg-accent" />
                    )}
                    <span className="relative">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-3">
              {user.data?.role === "ADMIN" && (
                <Link to={paths.admin.root.getHref()}>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Admin Panel
                  </Button>
                </Link>
              )}
              {user.data ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 outline-hidden cursor-pointer group">
                      <Avatar
                        name={user.data.name}
                        size="sm"
                        className="group-hover:border-primary"
                      />
                      <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground hidden md:inline transition-colors">
                        {user.data.name}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 bg-background border border-border shadow-xl rounded-xl p-1.5"
                  >
                    <DropdownMenuLabel className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      My Account
                    </DropdownMenuLabel>
                    <div className="px-2 py-2 flex flex-col gap-0.5">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {user.data.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.data.email}
                      </p>
                    </div>
                    <DropdownMenuSeparator className="my-1 bg-border/50" />
                    <DropdownMenuItem asChild className="rounded-lg">
                      <Link
                        to={paths.profile.getHref()}
                        className="w-full flex items-center gap-2 cursor-pointer"
                      >
                        <UserIcon className="w-4 h-4 text-muted-foreground" />
                        <span>Profile Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-lg">
                      <Link
                        to={paths.myTickets.getHref()}
                        className="w-full flex items-center gap-2 cursor-pointer"
                      >
                        <Ticket className="w-4 h-4 text-muted-foreground" />
                        <span>My Tickets</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-1 bg-border/50" />
                    <ConfirmLogout
                      triggerButton={
                        <button className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-red-500 hover:bg-red-500/10 rounded-lg cursor-pointer transition-colors text-left font-medium">
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      }
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link to={paths.auth.login.getHref()}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link to={paths.auth.register.getHref()}>
                    <Button variant="glow" size="sm">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="grow">{children}</main>

      <Footer />
    </div>
  );
};
