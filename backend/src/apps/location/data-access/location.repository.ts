import { Prisma } from "@prisma/client";
import prisma from "../../../db";
import { CreateLocationDTO } from "../dto/create-location.dto";
import { UpdateLocationDTO } from "../dto/update-location.dto";

const createLocation = async (newLocationData: CreateLocationDTO) => {
  return prisma.location.create({
    data: newLocationData,
  });
};

const getLocationsPaginated = async (
  page: number,
  limit: number,
  search: string
) => {
  const whereClause: Prisma.LocationWhereInput = {
    name: {
      contains: search,
      mode: "insensitive",
    },
  };

  const [locations, total] = await Promise.all([
    prisma.location.findMany({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        theaters: true,
      },
    }),
    prisma.location.count({
      where: whereClause,
    }),
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

export default {
  createLocation,
  getLocationsPaginated,
  getLocationById,
  getLocationByName,
  getLocations,
  updateLocation,
  deleteLocation,
};
