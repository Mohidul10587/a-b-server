// Helper function to handle Cloudinary uploads

import multer from "multer";
import cloudinary from "./cloudinary.config";
// Helper function to handle Cloudinary uploads
export const cloudinaryUpload = async (
  file: Express.Multer.File | undefined
): Promise<string> => {
  if (!file) return "";

  return new Promise<string>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ resource_type: "image" }, (error, result) => {
        if (error) reject(error);
        else resolve(result?.secure_url || "");
      })
      .end(file.buffer);
  });
};
// Multer configuration for file uploads (image validation)
const upload = multer({ storage: multer.memoryStorage() }); // Store files in memory

// Middleware for handling both single and multiple file uploads
export const uploadMiddleware = upload.any();
