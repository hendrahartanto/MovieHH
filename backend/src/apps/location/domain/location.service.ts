import { BadRequestError } from "../../../core/api-error";
import locationRepository from "../data-access/location.repository";
import { CreateLocationDTO } from "./dto/create-location.dto";
import { UpdateLocationDTO } from "./dto/update-location.dto";

const createLocation = async (createLocationData: CreateLocationDTO) => {
  const existingLocation = await locationRepository.getLocationByName(
    createLocationData.name
  );
  if (existingLocation)
    throw new BadRequestError("Location with given name already exists");

  return locationRepository.createLocation(createLocationData);
};

const getLocationsPaginated = async (
  page: number,
  limit: number,
  search: string
) => {
  return locationRepository.getLocationsPaginated(page, limit, search);
};

const getLocations = async () => {
  return locationRepository.getLocations();
};

const getLocation = async (locationId: string) => {
  const genre = locationRepository.getLocationById(locationId);
  if (!genre) throw new BadRequestError("Location not found");

  return genre;
};

const updateLocation = async (locationId: string, data: UpdateLocationDTO) => {
  return locationRepository.updateLocation(locationId, data);
};

const deleteLocation = async (locationId: string) => {
  return locationRepository.deleteLocation(locationId);
};

export default {
  createLocation,
  getLocationsPaginated,
  getLocations,
  getLocation,
  updateLocation,
  deleteLocation,
};
