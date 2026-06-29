import { paths } from "@/config/paths";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import AppRoot from "./pages/root";
import { ProtectedRoute } from "@/lib/auth";
import AdminRoot from "./pages/admin/root";

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
          lazy: () =>
            import("./pages/cinemas/cinemas").then(convert(queryClient)),
        },
        {
          path: paths.cinema.path,
          lazy: () =>
            import("./pages/cinemas/cinema").then(convert(queryClient)),
        },
        {
          path: paths.movies.path,
          lazy: () =>
            import("./pages/movies/movies").then(convert(queryClient)),
        },
        {
          path: paths.movie.path,
          lazy: () => import("./pages/movies/movie").then(convert(queryClient)),
        },
        {
          path: paths.seatSelection.path,
          lazy: () =>
            import("./pages/reservations/seat-selection").then(
              convert(queryClient),
            ),
        },
        {
          path: paths.paymentResult.path,
          lazy: () =>
            import("./pages/reservations/payment-result/payment-result").then(
              convert(queryClient),
            ),
        },
        {
          path: paths.myTickets.path,
          lazy: () =>
            import("./pages/reservations/my-tickets").then(convert(queryClient)),
        },
        {
          path: paths.profile.path,
          lazy: () =>
            import("./pages/profile").then(convert(queryClient)),
        },
      ],
    },
    {
      path: paths.admin.root.path,
      element: (
        <ProtectedRoute allowedRoles={["ADMIN"]}>
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
        {
          path: paths.admin.checkIn.path,
          lazy: () =>
            import("./pages/admin/check-in/scanner").then(convert(queryClient)),
        },
        {
          path: paths.admin.verifyCheckIn.path,
          lazy: () =>
            import("./pages/admin/check-in/verify").then(convert(queryClient)),
        },
        {
          path: paths.admin.reservations.path,
          lazy: () =>
            import("./pages/admin/reservations/reservations").then(convert(queryClient)),
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
