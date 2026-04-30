import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env.js";

export function isCloudinaryConfigured(): boolean {
  return (
    env.CLOUDINARY_CLOUD_NAME.length > 0 &&
    env.CLOUDINARY_API_KEY.length > 0 &&
    env.CLOUDINARY_API_SECRET.length > 0
  );
}

function ensureConfigured(): void {
  if (!isCloudinaryConfigured()) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET on the API."
    );
  }
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

/** Upload a JPEG/PNG buffer; returns HTTPS URL for storing in the database. */
export async function uploadAdminImageBuffer(
  buffer: Buffer,
  originalName: string
): Promise<{ url: string; publicId: string }> {
  ensureConfigured();
  const folder = env.CLOUDINARY_UPLOAD_FOLDER.replace(/^\/+|\/+$/g, "");

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        use_filename: true,
        unique_filename: true,
        overwrite: false,
      },
      (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        if (!result?.secure_url || !result.public_id) {
          reject(new Error("Cloudinary returned an empty result."));
          return;
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });
}
