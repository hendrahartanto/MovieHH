import { SuccessResponse } from "../../../core/api-response";
import asyncHandler from "../../../core/helpers/async-handler";
import { createLocationSchema } from "../domain/dto/create-location.dto";
import { updateLocationSchema } from "../domain/dto/update-location.dto";
import locationService from "../domain/location.service";

const createLocation = asyncHandler(async (req, res) => {
  const validatedData = createLocationSchema.parse(req.body);
  const location = await locationService.createLocation(validatedData);

  new SuccessResponse("Location created successfuly", { location }).send(res);
});

const getLocations = asyncHandler(async (req, res) => {
  const all = req.query.all === "true";
  if (all) {
    const locations = await locationService.getLocations();
    return new SuccessResponse("Get all locations successful", {
      locations,
    }).send(res);
  }

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const { locations, total } = await locationService.getLocationsPaginated(
    page,
    limit
  );

  new SuccessResponse("Get locations successful", {
    locations,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }).send(res);
});

const getLocation = asyncHandler(async (req, res) => {
  const { locationId } = req.params;
  const location = await locationService.getLocation(locationId);

  new SuccessResponse("Get location successful", { location }).send(res);
});

const updateLocation = asyncHandler(async (req, res) => {
  const { locationId } = req.params;
  const validatedData = updateLocationSchema.parse(req.body);

  const updatedLocation = await locationService.updateLocation(
    locationId,
    validatedData
  );

  new SuccessResponse("Update location successful", { updatedLocation }).send(
    res
  );
});

const deleteLocation = asyncHandler(async (req, res) => {
  const { locationId } = req.params;

  const deletedLocation = await locationService.deleteLocation(locationId);

  new SuccessResponse("Delete location successful", { deletedLocation }).send(
    res
  );
});

export default {
  createLocation,
  getLocations,
  getLocation,
  updateLocation,
  deleteLocation,
};
