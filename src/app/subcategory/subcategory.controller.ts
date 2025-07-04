import { Request, Response } from "express";
import Subcategory from "./subcategory.model";
import Category from "../category/category.model";
import { convertToArray } from "../shared/convertToArray";
import { generateSlug } from "../shared/generateSLug";

export const create = async (req: Request, res: Response) => {
  try {
    const item = await Subcategory.create({
      ...req.body,
      slug: generateSlug(req.body.title),
    });

    // Send success message along with the created category data
    res.status(201).json({
      message: "Subcategory created successfully!",
      item,
    });
  } catch (error: any) {
    // Send error message if there was an issue
    res.status(500).json({
      message: "Failed to create subcategory.",
      error: error.message,
    });
  }
};
export const singleForEditPage = async (req: Request, res: Response) => {
  try {
    const item = await Subcategory.findOne({ _id: req.params.id });
    res
      .status(200)
      .json({ message: "Subcategory fetched successfully!", item });
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to fetch subcategory.", error: error.message });
  }
};
// Update
export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const item = await Subcategory.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Run validation on the updated data
    });

    if (!item) {
      return res.status(404).json({
        message: "Not found.",
      });
    }

    res.status(200).json({
      message: "Subcategory Updated successfully!",
      item,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update subcategory.",
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
