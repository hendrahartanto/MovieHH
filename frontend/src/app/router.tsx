import { paths } from "@/config/paths";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

const convert = (queryClient: QueryClient) => (m: any) => {
  const { clientLoader, clientAction, default: Component, ...rest } = m;
  return {
    ...rest,
    loader: clientLoader?.(queryClient),
    action: clientAction?.(queryClient),
    Component,
  };
};

const createAppRouter = (queryClient: QueryClient) =>
  createBrowserRouter([
    {
      path: paths.auth.login.path,
      lazy: () => import("./pages/auth/login").then(convert(queryClient)),
    },
    {
      path: paths.auth.register.path,
      lazy: () => import("./pages/auth/register").then(convert(queryClient)),
    },
    {
      path: "*",
      lazy: () => import("./pages/not-found").then(convert(queryClient)),
    },
  ]);

export const AppRouter = () => {
  const queryClient = useQueryClient();

  const router = useMemo(() => createAppRouter(queryClient), [queryClient]);

  return <RouterProvider router={router} />;
};
