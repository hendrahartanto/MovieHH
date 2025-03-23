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

export default {
  createMovie,
};
