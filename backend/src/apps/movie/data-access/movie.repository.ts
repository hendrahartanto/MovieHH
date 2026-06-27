import { Prisma } from "@prisma/client";
import prisma from "../../../db";
import { CreateMovieDTO } from "../dto/create-movie.dto";

const createMovie = async (newMovieData: CreateMovieDTO) => {
  return prisma.movie.create({
    data: {
      title: newMovieData.title,
      synopsis: newMovieData.synopsis,
      posterUrl: newMovieData.posterUrl,
      bannerUrl: newMovieData.bannerUrl,
      duration: newMovieData.duration,
      director: newMovieData.director,
      writer: newMovieData.writer,
      isFeatured: newMovieData.isFeatured,
      status: newMovieData.status,
      trailerUrl: newMovieData.trailerUrl,
      genres: {
        create: newMovieData.genreIds.map((genreId) => ({
          genre: { connect: { id: genreId } },
        })),
      },
    },
    include: { genres: { include: { genre: true } } },
  });
};

const getMovies = async (page: number, limit: number, search: string) => {
  const whereClause: Prisma.MovieWhereInput = {
    title: {
      contains: search,
      mode: "insensitive",
    },
    deletedAt: null,
  };

  const [moviesRaw, total] = await Promise.all([
    prisma.movie.findMany({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
        movieSchedules: {
          where: { deletedAt: null },
          include: { showTimes: { where: { deletedAt: null } } },
        },
      },
    }),
    prisma.movie.count({
      where: whereClause,
    }),
  ]);

  const movies = moviesRaw.map((movie) => ({
    ...movie,
    genres: movie.genres.map((g) => g.genre),
  }));

  return { movies, total };
};

const getMovieById = async (movieId: string) => {
  const movieRaw = await prisma.movie.findFirst({
    where: { id: movieId, deletedAt: null },
    include: {
      genres: {
        include: {
          genre: true
        }
      },
    },
  });

  if (!movieRaw) {
    return null;
  }

  const formattedMovie = {
    ...movieRaw,
    genres: movieRaw.genres.map((g) => g.genre),
  };

  return formattedMovie;
};

const getFeaturedMovies = async () => {
  return prisma.movie.findMany({
    where: { isFeatured: true, deletedAt: null },
  });
};

const getActiveMovies = async () => {
  return prisma.movie.findMany({
    where: { status: "ACTIVE", deletedAt: null },
    include: { movieSchedules: { where: { deletedAt: null } } }
  })
}

const getUpcomingMovies = async () => {
  return prisma.movie.findMany({
    where: { status: "COMING_SOON", deletedAt: null },
    include: { movieSchedules: { where: { deletedAt: null } } }
  })
}

const updateMovie = async (
  movieId: string,
  data: {
    title: string;
    description?: string;
    posterUrl?: string;
    writer?: string;
    director?: string;
    duration: number;
  }
) => {
  return prisma.movie.update({
    where: { id: movieId },
    data,
  });
};

const updateGenres = async (movieId: string, genreIds: string[]) => {
  return prisma.genresOnMovies
    .deleteMany({
      where: { movieId: movieId },
    })
    .then(() =>
      prisma.genresOnMovies.createMany({
        data: genreIds.map((genreId) => ({ movieId, genreId })),
      })
    );
};

const deleteMovie = async (movieId: string, tx: any = prisma) => {
  return tx.movie.update({
    where: { id: movieId },
    data: { deletedAt: new Date() },
  });
};

export default {
  createMovie,
  getMovies,
  getMovieById,
  updateMovie,
  updateGenres,
  deleteMovie,
  getFeaturedMovies,
  getActiveMovies,
  getUpcomingMovies,
};
