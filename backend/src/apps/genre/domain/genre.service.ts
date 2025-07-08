import { BadRequestError } from "../../../core/api-error";
import genreRepository from "../data-access/genre.repository";
import { CreateGenreDTO, createGenreSchema } from "./dto/create-genre.dto";

const createGenre = async (createGenreData: CreateGenreDTO) => {
  const existingGenre = await genreRepository.getGenreByName(
    createGenreData.name
  );
  if (existingGenre)
    throw new BadRequestError("Genre with given name already exists");

  return genreRepository.createGenre(createGenreData);
};

const getGenresPaginated = async (page: number, limit: number) => {
  return genreRepository.getGenresPaginated(page, limit);
};

const getGenres = async () => {
  return genreRepository.getGenres();
};

const getGenre = async (genreId: string) => {
  const genre = genreRepository.getGenreById(genreId);
  if (!genre) throw new BadRequestError("Genre not found");

  return genre;
};

const updateGenre = async (genreId: string, data: { name: string }) => {
  return genreRepository.udpateGenre(genreId, data);
};

const deleteGenre = async (genreId: string) => {
  return genreRepository.deleteGenre(genreId);
};

export default {
  createGenre,
  getGenres,
  getGenre,
  getGenresPaginated,
  updateGenre,
  deleteGenre,
  createGenreSchema,
};
