import { paths } from "@/config/paths";
import { useLogout } from "@/lib/auth";
import React from "react";
import { useNavigate } from "react-router";

export const NavbarLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const logout = useLogout({
    onSuccess: () => navigate(paths.auth.login.getHref(location.pathname)),
  });

  return (
    <div className="flex flex-col">
      <div className="container mx-auto flex-grow max-w-[1200px] w-[90%]">
        <div className="flex">
          This is navbar{" "}
          <button onClick={() => logout.mutate({})}>logout</button>
        </div>
        {children}
      </div>
    </div>
  );
};
