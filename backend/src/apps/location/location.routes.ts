import express from "express";
import locationController from "./entry-points/location.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { Role } from "@prisma/client";

const router = express.Router();

//-------------------------------//
router.use(authenticate);
//-------------------------------//

router.post("/", authorize(Role.ADMIN), locationController.createLocation);
router.get("/", locationController.getLocations);
router.get("/:locationId", locationController.getLocation);
router.put(
  "/:locationId",
  authorize(Role.ADMIN),
  locationController.updateLocation,
);
router.delete(
  "/:locationId",
  authorize(Role.ADMIN),
  locationController.deleteLocation,
);

export default router;
