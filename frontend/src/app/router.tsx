import { paths } from "@/config/paths";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { AppRoot } from "./pages/root";
import { ProtectedRoute } from "@/lib/auth";
import { AdminRoot } from "./pages/admin/root";

//TODO:
//error boundary per route
//role-based admin gurad

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
      path: paths.home.path,
      element: <AppRoot />,
      children: [
        {
          index: true,
          lazy: () => import("./pages/home").then(convert(queryClient)),
        },
        {
          path: paths.cinemas.path,
          lazy: () => import("./pages/cinemas/cinemas").then(convert(queryClient)),
        },
        {
          path: paths.movies.path,
          lazy: () => import("./pages/movies/movies").then(convert(queryClient)),
        },
      ],
    },
    {
      path: paths.admin.root.path,
      element: (
        <ProtectedRoute>
          <AdminRoot />
        </ProtectedRoute>
      ),
      children: [
        {
          path: paths.admin.dashboard.path,
          lazy: () =>
            import("./pages/admin/dashboard").then(convert(queryClient)),
        },
        {
          path: paths.admin.movies.path,
          lazy: () =>
            import("./pages/admin/movies/movies").then(convert(queryClient)),
        },
        {
          path: paths.admin.genres.path,
          lazy: () =>
            import("./pages/admin/genres/genres").then(convert(queryClient)),
        },
        {
          path: paths.admin.locations.path,
          lazy: () =>
            import("./pages/admin/locations/locations").then(
              convert(queryClient),
            ),
        },
        {
          path: paths.admin.theaters.path,
          lazy: () =>
            import("./pages/admin/theaters/theaters").then(
              convert(queryClient),
            ),
        },
        {
          path: paths.admin.movieSchedules.path,
          lazy: () =>
            import("./pages/admin/movie-schedules/movie-schedules").then(
              convert(queryClient),
            ),
        },
      ],
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
