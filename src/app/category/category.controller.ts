import { Request, Response } from "express";
import Category from "./category.model";
import { generateSlug } from "../shared/generateSLug";
import Writer from "../writer/writer.model";
import Publisher from "../publishers/publishers.model";

export const create = async (req: Request, res: Response) => {
  try {
    const item = await Category.create({
      ...req.body,
      slug: generateSlug(req.body.title),
    });

    // Send success message along with the created category data
    res.status(201).json({
      message: "Created successfully!",
      item,
    });
  } catch (error: any) {
    // Send error message if there was an issue
    res.status(500).json({
      message: "Failed to create.",
      error: error.message,
    });
  }
};
export const singleForEditPage = async (req: Request, res: Response) => {
  try {
    const item = await Category.findOne({ _id: req.params.id });
    res.status(200).json({ message: "Category fetched successfully!", item });
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to fetch Category.", error: error.message });
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

export const getAllCatWithSubCat = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find()
      .select("title  subcategories")
      .populate({
        path: "subcategories",
        select: "title",
      });

    res.status(200).json(categories);
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching categories." });
  }
};

export const getCatsWritersPublishersForNavbar = async (
  req: Request,
  res: Response
) => {
  try {
    const [categories, writers, publishers] = await Promise.all([
      Category.find()
        .select("img title slug subcategories")
        .populate({ path: "subcategories", select: "img title slug" }),
      Writer.find().select("title slug"),
      Publisher.find().select("title slug"),
    ]);

    res.json({ categories, writers, publishers });
  } catch (err) {
    console.error("Failed to fetch common data:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};
// ✅ GET all categories for filter page
export const getAllCategoryForFilterPage = async (
  req: Request,
  res: Response
) => {
  try {
    const categories = await Category.find(
      {},
      { _id: 1, slug: 1, title: 1, img: 1 }
    ).sort({ position: 1 }); // sort by position field

    res.status(200).json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
