import React from "react";
import { useUser } from "@/lib/auth";
import { Link } from "react-router";
import { paths } from "@/config/paths";
import { Button } from "../ui/button";
import { ConfirmLogout } from "@/features/auth/components/confirm-logout";
import moviehhLogo from "@/assets/moviehh_logo.png"

interface NavbarItem {
  name: string;
  to: string;
}

export const NavbarLayout = ({ children }: { children: React.ReactNode }) => {
  const user = useUser();

  const navItems = [
    { name: "Movies", to: paths.home.getHref() },
    !user.data && { name: "Login", to: paths.auth.login.getHref() },
    !user.data && { name: "Sign up", to: paths.auth.register.getHref() },
  ].filter(Boolean) as NavbarItem[];

  return (
    <div className="flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-50 flex">
        <div className="layout-middle py-5 flex justify-between items-center">
          <img src={moviehhLogo} className="w-35" />
          <div className="right items-center flex gap-2">
            {navItems.map((item, index) => (
              <Link key={index} to={item.to}>
                {item.name}
              </Link>
            ))}
            {user.data && (
              <ConfirmLogout triggerButton={<Button>Logout</Button>} />
            )}
          </div>
        </div>
      </div>
      <div className="flex-grow">{children}</div>
    </div>
  );
};
