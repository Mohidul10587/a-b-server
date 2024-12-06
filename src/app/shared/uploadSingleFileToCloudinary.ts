// Helper function to handle Cloudinary uploads

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
