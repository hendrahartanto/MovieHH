import prisma from "../../../db";
import { CreateMovieDTO } from "../domain/dto/create-movie.dto";
import { UpdateMovieDTO } from "../domain/dto/update-movie.dto";

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

const getMovieById = async (movieId: string) => {
  return prisma.movie.findUnique({ where: { id: movieId } });
};

export default {
  createMovie,
  updateMovie,
  updateGenres,
  getMovieById,
};
