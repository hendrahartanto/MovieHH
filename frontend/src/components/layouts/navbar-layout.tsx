import React from "react";
import { useLogout, useUser } from "@/lib/auth";
import { Link, useNavigate } from "react-router";
import { paths } from "@/config/paths";
import { Button } from "../ui/button";

interface NavbarItem {
  name: string;
  to: string;
}

export const NavbarLayout = ({ children }: { children: React.ReactNode }) => {
  const user = useUser();
  const navigate = useNavigate();
  const logout = useLogout({
    onSuccess: () => navigate(paths.auth.login.getHref(location.pathname)),
  });

  const navItems = [
    { name: "Movies", to: paths.home.getHref() },
    !user.data && { name: "Login", to: paths.auth.login.getHref() },
    !user.data && { name: "Sign up", to: paths.auth.register.getHref() },
  ].filter(Boolean) as NavbarItem[];

  return (
    <div className="flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-50 flex bg-gradient-to-b from-background to-transparent border-b-[0.5px]">
        <div className="container mx-auto py-5 flex justify-between items-center">
          <div className="left">MovieHH</div>
          <div className="right items-center flex gap-2">
            {navItems.map((item, index) => (
              <Link key={index} to={item.to}>
                {item.name}
              </Link>
            ))}
            {user.data && (
              <Button onClick={() => logout.mutate({})}>Log out</Button>
            )}
          </div>
        </div>
      </div>
      <div className="flex-grow">{children}</div>
    </div>
  );
};
