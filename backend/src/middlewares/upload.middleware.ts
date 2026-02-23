import multer from "multer";
import path from "path";
import fs from "fs"; // 1. Import module fs bawaan Node.js

const uploadDir = "uploads/"; // Definisikan path folder tujuan

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // 2. Cek apakah folder uploads/ sudah ada
    if (!fs.existsSync(uploadDir)) {
      // 3. Jika belum ada, buat foldernya
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

export const upload = multer({ storage });
