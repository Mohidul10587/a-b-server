import { Request, Response } from "express";

import Banner from "./banner.model"; // Ensure the correct path to the model

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await Banner.create(req.body);

    // Send success message along with the created product data
    res.status(201).json({
      message: "Created successfully!",
      item, // Optionally, include the created product in the response
    });
  } catch (error: any) {
    console.log(error);
    // Send error message if there was an issue
    res.status(500).json({
      message: "Failed to create.",
      error: error.message,
    });
  }
};

// Controller function to update a banner by ID

export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log("THis is id");
    const item = await Banner.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ message: "Banner not found." });
    res.status(200).json({ message: "Banner updated successfully!", item });
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to update Banner.", error: error.message });
  }
};
export const singleForEditPage = async (req: Request, res: Response) => {
  try {
    const item = await Banner.findOne({ _id: req.params.id });
    res.status(200).json({ message: "Banner fetched successfully!", item });
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to fetch Banner.", error: error.message });
  }
};
export const allForAdminIndexPage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const items = await Banner.find().select("title").sort({ createdAt: -1 });
    res.status(200).json({ message: "Fetched Successfully", items });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllBanners = async (req: Request, res: Response) => {
  try {
    const banners = (await Banner.find()).reverse();

    res.status(200).json(banners);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getBannerById = async (req: Request, res: Response) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ error: "Banner not found" });
    }
    res.status(200).json(banner);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteBannerById = async (req: Request, res: Response) => {
  try {
    const bannerId = req.params.id;

    // Find and delete the banner by ID
    const banner = await Banner.findByIdAndDelete(bannerId);
    if (!banner) {
      return res.status(404).json({ error: "Banner not found" });
    }

    // Respond with a success message
    res.status(200).json({ message: "Banner deleted successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller function to get banners by category
export const getBannersByCategory = async (req: Request, res: Response) => {
  try {
    const categoryId = req.params.categoryId;

    // Find banners that contain the specified category ID
    const banners = await Banner.find({ category: categoryId });

    res.status(200).json(banners);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getBannersByBrand = async (req: Request, res: Response) => {
  try {
    const brandId = req.params.brandId;

    // Find banners that contain the specified category ID
    const banners = await Banner.find({ brands: brandId });

    res.status(200).json(banners);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// banners.controller.ts

// Controller function to update the pages field in all banner documents
export const updatePagesInBanners = async (req: Request, res: Response) => {
  try {
    const newPages = [{ _id: "1", title: "Home", checked: false }];

    // Update the pages field in all banner documents
    await Banner.updateMany({}, { pages: newPages });

    // Optionally, fetch updated banners after update
    const updatedBanners = await Banner.find();

    res.status(200).json(updatedBanners);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getBannersWithHomePageChecked = async (
  req: Request,
  res: Response
) => {
  try {
    const banners = await Banner.find({
      "pages.title": "Home",
      "pages.checked": true,
    }).sort({ position: 1 }); // Sort by 'position' in ascending order

    res.status(200).json(banners);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
