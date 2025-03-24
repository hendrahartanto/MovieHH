import prisma from "../../../db";
import { CreateGenreDTO } from "../domain/dto/create-genre.dto";

const createGenre = async (newGenreData: CreateGenreDTO) => {
  return prisma.genre.create({
    data: newGenreData,
  });
};

const getGenreByName = async (name: string) => {
  return prisma.genre.findUnique({ where: { name } });
};

export default {
  createGenre,
  getGenreByName,
};
