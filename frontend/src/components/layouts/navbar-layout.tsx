import { paths } from "@/config/paths";
import { useLogout, useUser } from "@/lib/auth";
import React from "react";
import { Link, useNavigate } from "react-router";
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
      <div className="flex bg-bacground bg-transparent">
        <div className="container mx-auto py-5 flex justify-between">
          <div className="left">MovieHH</div>
          <div className="right flex gap-2 items-center">
            {navItems.map((item, index) => (
              <Link key={index} to={item.to}>
                {item.name}
              </Link>
            ))}
            {user.data && (
              <Button onClick={() => logout.mutate({})}>logout</Button>
            )}
          </div>
        </div>
      </div>
      <div className="container mx-auto flex-grow max-w-[1200px] w-[90%]">
        {children}
      </div>
    </div>
  );
};
