import { Prisma } from "@prisma/client";
import prisma from "../../../db";
import { CreateGenreDTO } from "../dto/create-genre.dto";

const createGenre = async (newGenreData: CreateGenreDTO) => {
  return prisma.genre.create({
    data: newGenreData,
  });
};

const getGenresPaginated = async (
  page: number,
  limit: number,
  search: string
) => {
  const whereClause: Prisma.GenreWhereInput = {
    name: {
      contains: search,
      mode: "insensitive",
    },
  };

  const [genres, total] = await Promise.all([
    prisma.genre.findMany({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.genre.count({ where: whereClause }),
  ]);

  return { genres, total };
};

const getGenres = async () => {
  return prisma.genre.findMany();
};

const getGenreById = async (genreId: string) => {
  return prisma.genre.findUnique({ where: { id: genreId } });
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
  getGenresPaginated,
  getGenres,
  getGenreById,
  udpateGenre,
  deleteGenre,
  getGenreByName,
};
