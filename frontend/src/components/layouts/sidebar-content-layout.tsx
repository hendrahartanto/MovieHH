import React from "react";
import { ArrowLeft } from "lucide-react";

interface SidebarContentLayoutProps {
  children: React.ReactNode;
  headerComponent?: React.ReactNode;
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

export const SidebarContentLayout = ({
  children,
  headerComponent,
  title,
  subtitle,
  showBackButton = false,
  onBackClick,
}: SidebarContentLayoutProps) => {
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="pt-6 pb-4 border-b border-border sticky top-0 z-10 bg-background">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <button
                onClick={onBackClick}
                className="p-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
                aria-label="Go back"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-foreground">{title}</h1>
              {subtitle && (
                <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
              )}
            </div>
          </div>
          <div className="">{headerComponent}</div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto mt-6">{children}</div>
      </div>
    </div>
  );
};
