// Helper function to upload a file to Cloudinary

import cloudinary from "./cloudinary.config";

export interface CloudinaryUploadResult {
  secure_url: string;
  [key: string]: any;
}

export const uploadToCloudinary = (
  fileBuffer: Buffer
): Promise<CloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "image" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result as CloudinaryUploadResult);
      }
    );
    uploadStream.end(fileBuffer);
  });
};
