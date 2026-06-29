import prisma from "../../../db";

const getMetrics = async () => {
  const revenueAggregate = await prisma.reservation.aggregate({
    where: { status: "CONFIRMED" },
    _sum: { totalPrice: true },
  });
  const totalRevenue = Number(revenueAggregate._sum.totalPrice || 0);

  const totalTicketsSold = await prisma.reservationDetail.count({
    where: {
      reservation: { status: "CONFIRMED" },
    },
  });

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const showTimes = await prisma.showTime.findMany({
    where: {
      startTime: {
        gte: startOfToday,
        lte: endOfToday,
      },
    },
    include: {
      movieSchedule: {
        include: {
          theater: {
            include: {
              _count: {
                select: { seats: true },
              },
            },
          },
        },
      },
      _count: {
        select: {
          seats: {
            where: { status: "RESERVED" },
          },
        },
      },
    },
  });

  let totalAvailableSeatsToday = 0;
  let totalBookedSeatsToday = 0;

  showTimes.forEach((st) => {
    totalAvailableSeatsToday += st.movieSchedule.theater._count.seats;
    totalBookedSeatsToday += st._count.seats;
  });

  const avgOccupancyRate = totalAvailableSeatsToday > 0
    ? Math.round((totalBookedSeatsToday / totalAvailableSeatsToday) * 100)
    : 0;

  const todayConfirmedTickets = await prisma.reservationDetail.count({
    where: {
      reservation: {
        status: "CONFIRMED",
        showTime: {
          startTime: {
            gte: startOfToday,
            lte: endOfToday,
          },
        },
      },
    },
  });

  const todayCheckedInTickets = await prisma.reservationDetail.count({
    where: {
      reservation: {
        status: "CONFIRMED",
        checkedInAt: { not: null },
        showTime: {
          startTime: {
            gte: startOfToday,
            lte: endOfToday,
          },
        },
      },
    },
  });

  return {
    totalRevenue,
    totalTicketsSold,
    avgOccupancyRate,
    todayConfirmedTickets,
    todayCheckedInTickets,
  };
};

const getTodaySchedules = async () => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const showTimes = await prisma.showTime.findMany({
    where: {
      startTime: {
        gte: startOfToday,
        lte: endOfToday,
      },
    },
    include: {
      movieSchedule: {
        include: {
          movie: true,
          theater: {
            include: {
              _count: {
                select: { seats: true },
              },
            },
          },
        },
      },
      _count: {
        select: {
          seats: {
            where: { status: "RESERVED" },
          },
        },
      },
    },
  });

  return showTimes.map((st) => {
    const totalSeats = st.movieSchedule.theater._count.seats;
    const bookedSeats = st._count.seats;

    return {
      id: st.id,
      startTime: st.startTime,
      endTime: st.endTime,
      movieTitle: st.movieSchedule.movie.title,
      theaterName: st.movieSchedule.theater.name,
      bookedSeats,
      totalSeats,
      occupancyPercent: totalSeats > 0 ? Math.round((bookedSeats / totalSeats) * 100) : 0,
    };
  });
};

const getRecentTransactions = async () => {
  return prisma.reservation.findMany({
    orderBy: { createAt: "desc" },
    take: 5,
    include: {
      user: {
        select: { name: true, email: true },
      },
      showTime: {
        include: {
          movieSchedule: {
            include: {
              movie: { select: { title: true } },
            },
          },
        },
      },
    },
  });
};

const getRecentCheckIns = async () => {
  return prisma.reservation.findMany({
    where: {
      checkedInAt: { not: null },
    },
    orderBy: { checkedInAt: "desc" },
    take: 5,
    include: {
      user: {
        select: { name: true },
      },
      showTime: {
        include: {
          movieSchedule: {
            include: {
              movie: { select: { title: true } },
              theater: { select: { name: true } },
            },
          },
        },
      },
      reservationDetails: {
        include: {
          seat: { select: { seatRow: true, seatNumber: true } },
        },
      },
    },
  });
};

const getPopularMovies = async () => {
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);

  const confirmedReservations = await prisma.reservation.findMany({
    where: {
      status: "CONFIRMED",
      createAt: { gte: last30Days },
    },
    include: {
      showTime: {
        include: {
          movieSchedule: {
            include: {
              movie: {
                select: { id: true, title: true, posterUrl: true },
              },
            },
          },
        },
      },
      reservationDetails: true,
    },
  });

  const movieStatsMap: Record<
    string,
    { title: string; posterUrl: string | null; ticketsSold: number; revenue: number }
  > = {};

  confirmedReservations.forEach((res) => {
    const movie = res.showTime.movieSchedule.movie;
    if (!movie) return;

    if (!movieStatsMap[movie.id]) {
      movieStatsMap[movie.id] = {
        title: movie.title,
        posterUrl: movie.posterUrl,
        ticketsSold: 0,
        revenue: 0,
      };
    }

    movieStatsMap[movie.id].ticketsSold += res.reservationDetails.length;
    movieStatsMap[movie.id].revenue += Number(res.totalPrice);
  });

  return Object.values(movieStatsMap)
    .sort((a, b) => b.ticketsSold - a.ticketsSold)
    .slice(0, 5);
};

export default {
  getMetrics,
  getTodaySchedules,
  getRecentTransactions,
  getRecentCheckIns,
  getPopularMovies,
};
