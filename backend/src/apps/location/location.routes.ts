import express from "express";
import locationController from "./entry-points/location.controller";

const router = express.Router();

router.post("/", locationController.createLocation);
router.get("/", locationController.getLocations);
router.get("/:locationId", locationController.getLocation);
router.put("/:locationId", locationController.updateLocation);
router.delete("/:locationId", locationController.deleteLocation);

export default router;
