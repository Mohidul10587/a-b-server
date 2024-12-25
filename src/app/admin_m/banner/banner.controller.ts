import { Request, Response } from "express";
import cloudinary from "../../shared/cloudinary.config";
import Banner from "./banner.model"; // Ensure the correct path to the model
import { uploadToCloudinary } from "../../shared/uplCloudinary";
import { cloudinaryUpload } from "../../shared/uploadSingleFileToCloudinary";
import { extractPublicKeyAndDelete } from "../../shared/extractPublicKeyAndDelete";
export const createBanner = async (req: Request, res: Response) => {
  try {
    const { title, bannersInfo } = req.body;

    // Extract banners data from JSON string in request body
    const bannersData: { title: string; link: string }[] =
      JSON.parse(bannersInfo);

    // Handle file uploads and map them with banner data
    const bannerUploads = await Promise.all(
      bannersData.map(async (banner, index) => {
        const file = (
          req.files as { [fieldname: string]: Express.Multer.File[] }
        ).bannerImages[index];
        if (file) {
          const result = await uploadToCloudinary(file.buffer);
          return {
            img: result.secure_url,
            title: banner.title,
            link: banner.link,
          };
        }
        return null;
      })
    );

    // Filter out any null values in bannerUploads
    const filteredBannerUploads = bannerUploads.filter(
      (upload) => upload !== null
    ) as { img: string; title: string; link: string }[];

    // Create a new banner document
    const newBanner = new Banner({
      title,

      banners: filteredBannerUploads,
    });

    // Save the banner document to MongoDB
    await newBanner.save();

    // Respond with the saved banner data
    res.status(201).json(newBanner);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller function to update a banner by ID

export const updateBannerById = async (req: Request, res: Response) => {
  try {
    const { title, bannersInfo } = req.body;

    const parsedBannersInfo = JSON.parse(bannersInfo);

    const existingBanner = await Banner.findById(req.params.id);

    if (!existingBanner) {
      return res.status(404).json({ error: "Banner not found" });
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // Array to hold secure URLs of uploaded images, initialized with existing img values
    let secureUrlArray: string[] = [];

    if (files && files.bannerImages && files.bannerImages.length > 0) {
      // Upload images and collect secure URLs in the same order
      await Promise.all(
        files.bannerImages.map(async (file, index) => {
          try {
            const result = await uploadToCloudinary(file.buffer);
            // Assign secure_url to the correct index
            secureUrlArray[index] = result.secure_url;
          } catch (error) {
            console.error("Error uploading image:", error);
            throw new Error("Error uploading image");
          }
        })
      );
    }

    // Update parsedBannersInfo by filling in empty img fields with URLs from secureUrlArray
    let urlIndex = 0; // To track which collected URL to use

    const Updated_Banner_info = parsedBannersInfo.map((banner: any) => {
      // Check if the img is empty and we still have collected URLs left to use
      if (banner.img === "" && urlIndex < secureUrlArray.length) {
        // Replace the empty img with the next collected URL
        banner.img = secureUrlArray[urlIndex];
        urlIndex++; // Move to the next URL for the next empty img
      }
      return banner;
    });

    const updatedBanner = await Banner.findByIdAndUpdate(
      req.params.id,
      {
        title,
        banners: Updated_Banner_info,
      },
      { new: true }
    );

    if (!updatedBanner) {
      return res.status(404).json({ error: "Banner not found" });
    }

    res.status(200).json(updatedBanner);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
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
