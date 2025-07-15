import { Request, Response } from "express";
import cloudinary from "../shared/cloudinary.config";
import Settings from "./settings.model";

const uploadToCloudinary = (file: Express.Multer.File) => {
  return new Promise<{ secure_url: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream((error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result as { secure_url: string });
    });
    stream.end(file.buffer);
  });
};

export const getSettings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const item = await Settings.findOne();
    if (!item) {
      res.status(404).json({ message: "Settings not found" });
      return;
    }
    res.status(200).json({ message: "Settings not found", item });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
export const getPrivacyPoliciesOfSettings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const settings = await Settings.findOne();
    if (!settings) {
      res.status(404).json({ message: "Settings not found" });
      return;
    }
    res.status(200).json(settings.privacyPolicies);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await Settings.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ message: "Product not found." });
    res.status(200).json({ message: "Product updated successfully!", item });
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to update Product.", error: error.message });
  }
};

export const updateDefaultSellerStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params; // Extract the ID from request parameters
    const { status } = req.body; // Extract the status from request body

    // Validate that status is provided
    if (status === undefined) {
      return res
        .status(400)
        .json({ message: "Missing required field: status" });
    }

    // Find the document by ID and update the 'sellerDefaultStatus' field
    const result = await Settings.findByIdAndUpdate(
      id, // Match the document by ID
      { sellerDefaultStatus: status }, // Update only the 'sellerDefaultStatus' field
      { new: true, runValidators: true } // Return the updated document and validate input
    );

    if (!result) {
      return res
        .status(404)
        .json({ message: "No settings document found with the provided ID" });
    }

    res.status(200).json({
      message: "Default seller status updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Error updating Default seller status",
      error: error.message,
    });
  }
};
