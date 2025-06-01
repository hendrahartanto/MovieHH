import { get } from "http";
import prisma from "../../../db";
import { CreateGenreDTO } from "../domain/dto/create-genre.dto";

const createGenre = async (newGenreData: CreateGenreDTO) => {
  return prisma.genre.create({
    data: newGenreData,
  });
};

const getGenres = async () => {
  return prisma.genre.findMany();
};

const udpateGenre = async (genreId: string, data: { name: string }) => {
  return prisma.genre.update({
    where: { id: genreId },
    data,
  });
};

const deleteGenre = async (genreId: string) => {
  return prisma.genre.delete({ where: { id: genreId } });
};

const getGenreByName = async (name: string) => {
  return prisma.genre.findUnique({ where: { name } });
};

export default {
  createGenre,
  getGenres,
  udpateGenre,
  deleteGenre,
  getGenreByName,
};
