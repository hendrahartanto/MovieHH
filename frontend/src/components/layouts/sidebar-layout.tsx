import React from "react";
import { Link } from "react-router";

interface SidebarItem {
  name: string;
  to: string;
}

export const SidebarLayout = ({ children }: { children: React.ReactNode }) => {
  const sidebarItems: SidebarItem[] = [
    { name: "Movies", to: "" },
    { name: "Cinemas", to: "" },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold">MovieHH</h2>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.to}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200"
                >
                  {/* {item.icon} */}
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-700">
          <div className="text-sm text-gray-400">© 2025 MovieHH</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100">
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};
