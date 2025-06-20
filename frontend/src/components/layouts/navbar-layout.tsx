import React from "react";
import { Navbar } from "../ui/navbar";

export const NavbarLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="flex-grow">{children}</div>
    </div>
  );
};
