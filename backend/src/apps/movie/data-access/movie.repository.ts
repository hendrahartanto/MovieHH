import { Prisma } from "@prisma/client";
import prisma from "../../../db";
import { CreateMovieDTO } from "../domain/dto/create-movie.dto";

const createMovie = async (newMovieData: CreateMovieDTO) => {
  return prisma.movie.create({
    data: {
      title: newMovieData.title,
      description: newMovieData.description,
      posterUrl: newMovieData.posterUrl,
      duration: newMovieData.duration,
      writer: newMovieData.writer,
      director: newMovieData.director,
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
  return prisma.movie.findUnique({
    where: { id: movieId },
    include: { genres: { include: { genre: true } } },
  });
};

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
};
