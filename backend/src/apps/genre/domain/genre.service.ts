import { BadRequestError } from "../../../core/api-error";
import genreRepository from "../data-access/genre.repository";
import { CreateGenreDTO, createGenreSchema } from "./dto/create-genre.dto";

const createGenre = async (createGenreData: CreateGenreDTO) => {
  const isGenreExist = await genreRepository.getGenreByName(
    createGenreData.name
  );
  if (isGenreExist)
    throw new BadRequestError("Genre with given name already exists");

  return genreRepository.createGenre(createGenreData);
};

export default {
  createGenre,
};
