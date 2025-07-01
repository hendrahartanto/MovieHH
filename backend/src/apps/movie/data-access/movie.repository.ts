import prisma from "../../../db";
import { CreateMovieDTO } from "../domain/dto/create-movie.dto";

const createMovie = async (newMovieData: CreateMovieDTO) => {
  return prisma.movie.create({
    data: {
      title: newMovieData.title,
      description: newMovieData.description,
      posterUrl: newMovieData.posterUrl,
      genres: {
        create: newMovieData.genreIds.map((genreId) => ({
          genre: { connect: { id: genreId } },
        })),
      },
    },
    include: { genres: { include: { genre: true } } },
  });
};

const getMovies = async (page: number, limit: number) => {
  const [moviesRaw, total] = await Promise.all([
    prisma.movie.findMany({
      skip: (page - 1) * limit,
      take: limit,
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
        showTimes: true,
      },
    }),
    prisma.movie.count(),
  ]);

  const movies = moviesRaw.map((movie) => ({
    ...movie,
    genres: movie.genres.map((g) => g.genre), // ← ini kuncinya
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
  data: { title: string; description: string; posterUrl: string | null }
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
