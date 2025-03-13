import { Request, Response } from "express";
import Category from "./category.model";
import { generateSlug } from "../shared/generateSLug";

export const create = async (req: Request, res: Response) => {
  try {
    const newCategory = await Category.create({
      ...req.body,
      slug: generateSlug(req.body.title),
    });

    // Send success message along with the created category data
    res.status(201).json({
      message: "Created successfully!",
      respondedData: newCategory, // Optionally, include the created category in the response
    });
  } catch (error: any) {
    // Send error message if there was an issue
    res.status(500).json({
      message: "Failed to create.",
      error: error.message,
    });
  }
};

// Get all
export const allCategoriesForSubCatAddPage = async (
  req: Request,
  res: Response
) => {
  try {
    const items = await Category.find().select("title slug");

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
export const allCategoriesForNavBar = async (req: Request, res: Response) => {
  try {
    const items = await Category.find().select("title slug");

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
export const allCategoryForProductAddPage = async (
  req: Request,
  res: Response
) => {
  try {
    const items = await Category.find().select("title").populate({
      path: "subcategories",
      select: "title",
    });

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
export const allCategoriesForAdminCatIndexPage = async (
  req: Request,
  res: Response
) => {
  try {
    const items = await Category.find().select("title slug img");

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
export const allCategoryForFiltering = async (req: Request, res: Response) => {
  try {
    const items = await Category.find().select("title");

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
export const getAllCategoriesForCatMainPage = async (
  req: Request,
  res: Response
) => {
  try {
    const items = await Category.find();

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
export const singleCategoryForCategoryEditPage = async (
  req: Request,
  res: Response
) => {
  try {
    const item = await Category.findOne({ _id: req.params.id });

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

    const updatedItem = await Category.findByIdAndUpdate(id, req.body, {
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
    console.error(error);
    res.status(500).json({
      message: "Failed to update.",
      error: error.message,
    });
  }
};
