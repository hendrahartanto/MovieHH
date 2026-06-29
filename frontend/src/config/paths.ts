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
    checkIn: {
      path: "check-in",
      getHref: () => "/admin/check-in",
    },
    verifyCheckIn: {
      path: "check-in/verify/:reservationId",
      getHref: (id: string) => `/admin/check-in/verify/${id}`,
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

  cinema: {
    path: "/cinemas/:theaterId",
    getHref: (id: string) => `/cinemas/${id}`,
  },

  movies: {
    path: "/movies",
    getHref: () => "/movies",
  },

  movie: {
    path: "/movies/:movieId",
    getHref: (id: string) => `/movies/${id}`,
  },

  showtime: {
    path: "/showtimes/:showtimeId",
    getHref: (id: string) => `/showtimes/${id}`,
  },

  seatSelection: {
    path: "/showtimes/:showtimeId/seats",
    getHref: (id: string) => `/showtimes/${id}/seats`,
  },

  paymentResult: {
    path: "/reservations/:reservationId/result",
    getHref: (id: string) => `/reservations/${id}/result`,
  },

  myTickets: {
    path: "/my-tickets",
    getHref: () => "/my-tickets",
  },
  profile: {
    path: "/profile",
    getHref: () => "/profile",
  },
} as const;
