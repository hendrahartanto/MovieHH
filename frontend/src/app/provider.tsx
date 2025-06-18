import { MainErrorFallback } from "@/components/errors/main";
import { AuthLoader } from "@/lib/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  const queryClient = new QueryClient();

  return (
    <ErrorBoundary FallbackComponent={MainErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <AuthLoader
          renderLoading={() => (
            <div className="flex items-center justify-center h-screen">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        >
          {children}
        </AuthLoader>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};
