import React, { useState, useEffect } from "react";
import { useUser } from "@/lib/auth";
import { Link, useLocation } from "react-router";
import { paths } from "@/config/paths";
import { Button } from "../ui/button";
import { ConfirmLogout } from "@/features/auth/components/confirm-logout";
import moviehhLogo from "@/assets/moviehh_logo.png";
import { cn } from "@/lib/utils";
import { Footer } from "../ui/footer";

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
              {user.data ? (
                <ConfirmLogout
                  triggerButton={
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-border hover:border-primary hover:text-primary transition-colors"
                    >
                      Logout
                    </Button>
                  }
                />
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
                    <Button
                      variant="glow"
                      size="sm"
                    >
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
