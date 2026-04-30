import multer from "multer";
import { env } from "../config/env.js";

const allowedMime = new Set(["image/jpeg", "image/png"]);

/** Single-file memory upload for admin images (JPEG/PNG, size capped by env). */
export const adminImageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { files: 1, fileSize: env.UPLOAD_MAX_IMAGE_BYTES },
  fileFilter: (_req, file, cb) => {
    if (!allowedMime.has(file.mimetype)) {
      cb(new Error("Only JPEG and PNG images are allowed."));
      return;
    }
    cb(null, true);
  },
}).single("file");
