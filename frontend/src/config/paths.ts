export const paths = {
  auth: {
    register: {
      path: "/auth/register",
      getHref: (redirectTo?: string | null | undefined) =>
        `/auth/register${
          redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""
        }`,
    },
    login: {
      path: "/auth/login",
      getHref: (redirectTo?: string | null | undefined) =>
        `/auth/login${
          redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""
        }`,
    },
  },

  admin: {
    root: {
      path: "/admin",
      getHref: () => "/admin",
    },
    dashboard: {
      path: "",
      getHref: () => "/admin",
    },
    movies: {
      path: "movies",
      getHref: () => "/app/movies",
    },
    cinemas: {
      path: "cinemas",
      getHref: () => "/app/cinmeas",
    },
  },

  home: {
    path: "/",
    getHref: () => "/",
  },

  app: {
    root: {
      path: "app",
      getHref: () => "/app",
    },
  },
} as const;
