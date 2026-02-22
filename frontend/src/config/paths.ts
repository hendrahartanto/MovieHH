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
      getHref: () => "/admin/movies",
    },
    genres: {
      path: "genres",
      getHref: () => "/admin/genres",
    },
    locations: {
      path: "locations",
      getHref: () => "/admin/locations",
    },
    theaters: {
      path: "theaters",
      getHref: () => "/admin/theaters",
    },
    showtimes: {
      path: "showtimes",
      getHref: () => "/admin/showtimes",
    },
    movieSchedules: {
      path: "movie-schedules",
      getHref: () => "/admin/movie-schedules",
    },
  },

  home: {
    path: "/",
    getHref: () => "/",
  },

  cinemas: {
    path: "/cinemas",
    getHref: () => "/cinemas",
  },

  movies: {
    path: "/movies",
    getHref: () => "/movies",
  },
} as const;
