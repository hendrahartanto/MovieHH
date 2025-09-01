import express from "express";
import genreController from "./entry-points/genre.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { Role } from "@prisma/client";

const router = express.Router();

//-------------------------------//
router.use(authenticate, authorize(Role.ADMIN));
//-------------------------------//

router.post("/", genreController.createGenre);
router.get("/search", genreController.searchGenres);
router.get("/", genreController.getGenres);
router.get("/:genreId", genreController.getGenre);
router.put("/:genreId", genreController.updateGenre);
router.delete("/:genreId", genreController.deleteGenre);

export default router;
