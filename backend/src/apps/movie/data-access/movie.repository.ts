import { Prisma } from "@prisma/client";
import prisma from "../../../db";
import { CreateMovieDTO } from "../domain/dto/create-movie.dto";

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
        movieSchedules: { include: { showTimes: true } },
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
  const movieRaw = await prisma.movie.findUnique({
    where: { id: movieId },
    include: {
      genres: {
        include: {
          genre: true
        }
      },
      movieSchedules: {
        include: {
          showTimes: {
            include: {
              seats: true
            }
          },
          theater: {
            include: {
              location: true
            }
          },
        }
      }
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
    where: { isFeatured: true },
  });
};

const getActiveMovies = async () => {
  return prisma.movie.findMany({
    where: { status: "ACTIVE" },
    include: { movieSchedules: true }
  })
}

const getUpcomingMovies = async () => {
  return prisma.movie.findMany({
    where: { status: "COMING_SOON" },
    include: { movieSchedules: true }
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

const deleteMovie = async (movieId: string) => {
  return prisma.movie.delete({ where: { id: movieId } });
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
