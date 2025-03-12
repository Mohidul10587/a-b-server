import { Request, Response } from "express";
import Subcategory from "./subcategory.model";
import Category from "../category/category.model";
import { convertToArray } from "../shared/convertToArray";
import { generateSlug } from "../shared/generateSLug";

export const createSubcategory = async (req: Request, res: Response) => {
  try {
    const { parentCategory, title } = req.body;

    // Split titles into an array
    const titlesArray = convertToArray(title);
    console.log(titlesArray);
    // Initialize an array to store new subcategory IDs
    const createdItems = [];

    // Iterate through titles and create subcategories
    for (const title of titlesArray) {
      const newSubcategory = await Subcategory.create({
        ...req.body,
        title,
        slug: generateSlug(title),
      });

      // Add the created subcategory ID to the array
      createdItems.push(newSubcategory._id);
    }

    // Update the parent category with all new subcategory IDs
    const updatedCategory = await Category.findByIdAndUpdate(
      parentCategory,
      { $push: { subcategories: { $each: createdItems } } }, // Push multiple subcategory IDs at once
      { new: true } // Return the updated document
    );

    if (!updatedCategory) {
      console.log("Parent category not found.");
      return res.status(404).json({ message: "Parent category not found." });
    }

    // Send success response
    res.status(201).json({
      message: "Subcategories created successfully!",
      subcategories: createdItems,
      updatedCategory,
    });
  } catch (error: any) {
    console.error(error);
    // Send error response
    res.status(500).json({
      message: "Failed to create subcategories.",
      error: error.message,
    });
  }
};
// Get all
export const allSubcategoriesForAdminSubCatIndexPage = async (
  req: Request,
  res: Response
) => {
  try {
    const items = await Subcategory.find().select("title slug img");

    res.status(200).json({
      message: "Fetched successfully!",
      respondedData: items.reverse(),
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch.",
      error: error.message,
    });
  }
};

// Get all
export const allSubcategoriesForChildCatAddPage = async (
  req: Request,
  res: Response
) => {
  try {
    const items = await Subcategory.find().select("title slug");

    res.status(200).json({
      message: "Fetched successfully!",
      respondedData: items.reverse(),
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch.",
      error: error.message,
    });
  }
};
// Get single
export const singleSubcategoryForSubcategoryEditPage = async (
  req: Request,
  res: Response
) => {
  try {
    const item = await Subcategory.findOne({ _id: req.params.id });

    res.status(200).json({
      message: "Fetched successfully!",
      respondedData: item,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch.",
      error: error.message,
    });
  }
};

// Update
export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const updatedItem = await Subcategory.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Run validation on the updated data
    });

    if (!updatedItem) {
      return res.status(404).json({
        message: "Not found.",
      });
    }

    res.status(200).json({
      message: "Updated successfully!",
      respondedData: updatedItem,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to update.",
      error: error,
    });
  }
};
