import prisma from "../../../db";
import { CreateLocationDTO } from "../domain/dto/create-location.dto";
import { UpdateLocationDTO } from "../domain/dto/update-location.dto";

const createLocation = async (newLocationData: CreateLocationDTO) => {
  return prisma.location.create({
    data: newLocationData,
  });
};

const getLocationsPaginated = async (page: number, limit: number) => {
  const [locations, total] = await Promise.all([
    prisma.location.findMany({
      skip: (page - 1) * limit,
      take: limit,
      include: {
        theaters: true,
      },
    }),
    prisma.location.count(),
  ]);

  return { locations, total };
};

const getLocations = async () => {
  return prisma.location.findMany();
};

const getLocationById = async (locationId: string) => {
  return prisma.location.findUnique({
    where: { id: locationId },
    include: {
      theaters: true,
    },
  });
};

const getLocationByName = async (locationName: string) => {
  return prisma.location.findUnique({
    where: { name: locationName },
    include: {
      theaters: true,
    },
  });
};

const updateLocation = async (locationId: string, data: UpdateLocationDTO) => {
  return prisma.location.update({
    where: { id: locationId },
    data,
  });
};

const deleteLocation = async (locationId: string) => {
  return prisma.location.delete({
    where: { id: locationId },
  });
};

const searchLocations = async (query: string, page: number, limit: number) => {
  const [locations, total] = await Promise.all([
    prisma.location.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        theaters: true,
      },
    }),
    prisma.location.count(),
  ]);

  return { locations, total };
};

export default {
  createLocation,
  getLocationsPaginated,
  getLocationById,
  getLocationByName,
  getLocations,
  updateLocation,
  deleteLocation,
  searchLocations,
};
