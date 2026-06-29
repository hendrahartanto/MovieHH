import multer from "multer";
import path from "path";
import fs from "fs";

import { BadRequestError } from "../lib/exceptions/api-error";

const uploadDir = "uploads/";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = /jpeg|jpg|png|webp/;

export const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: (req, file, cb) => {
    const isMimetypeValid = ALLOWED_IMAGE_TYPES.test(file.mimetype);
    const isExtnameValid = ALLOWED_IMAGE_TYPES.test(
      path.extname(file.originalname).toLowerCase(),
    );

    if (isMimetypeValid && isExtnameValid) {
      return cb(null, true);
    }

    cb(
      new BadRequestError(
        "Only JPEG, JPG, PNG, and WEBP image files are allowed.",
      ),
    );
  },
});
